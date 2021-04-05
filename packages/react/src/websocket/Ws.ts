import type { WsRoutes, WsServerEvents } from "@amfa-team/space-service-types";
import { Severity, captureException, captureMessage } from "@sentry/react";
import { EventTarget } from "event-target-shim";
import { v4 as uuid } from "uuid";
import { WsEvent } from "./WsEvent";

type PendingReq = {
  resolve: (payload: unknown) => void;
  reject: (error: unknown) => void;
};

type WsSetting = {
  endpoint: string;
  spaceId: string;
};

type WsPendingReq = Map<string, PendingReq>;

const RESPONSE_TIMEOUT = 60_000;
const REFRESH_INTERVAL_MINUTES = 90;

async function sendToWs<P extends keyof WsRoutes>(
  ws: WebSocket,
  pendingReq: WsPendingReq,
  action: P,
  data: WsRoutes[P]["in"],
): Promise<WsRoutes[P]["out"]> {
  return new Promise((resolve, reject) => {
    const msgId = uuid();

    let timeout: NodeJS.Timeout | null = null;

    const clear = () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      pendingReq.delete(msgId);
    };

    timeout = setTimeout(() => {
      clear();
      reject(new Error("Request timeout"));
    }, RESPONSE_TIMEOUT);

    pendingReq.set(msgId, {
      resolve: (payload) => {
        clear();
        // TODO: validation?
        resolve(payload as WsRoutes[P]["out"]);
      },
      reject: (error) => {
        clear();
        reject(error);
      },
    });

    if (
      ws.readyState === WebSocket.CLOSING ||
      ws.readyState === WebSocket.CLOSED
    ) {
      reject(new Error("Websocket is closed"));
    } else {
      ws.send(JSON.stringify({ action, data, msgId }));
    }
  });
}

type WebSocketState =
  | "initial"
  | "connecting"
  | "connected"
  | "disconnected"
  | "closed";

export type WsEvents = {
  "state:change": WsEvent<"state:change", WebSocketState>;
  server: WsEvent<"server", WsServerEvents>;
};

export class Ws extends EventTarget<WsEvents, "strict"> {
  #ws: WebSocket;

  #state: WebSocketState = "initial";

  #pingID: NodeJS.Timeout | null = null;

  #refreshID: NodeJS.Timeout | null = null;

  #setting: WsSetting;

  #token: string;

  #pendingReq: WsPendingReq = new Map();

  constructor(token: string, setting: WsSetting) {
    super();

    this.#setting = setting;
    this.#token = token;

    this.#ws = new WebSocket(setting.endpoint);

    this.#ws.addEventListener("message", this.#onMessage);
    this.#ws.addEventListener("error", this.#onError);
    this.#ws.addEventListener("close", this.#onClose);
  }

  #scheduleRefresh = (): void => {
    // refresh websocket every 90 min
    this.#refreshID = setTimeout(() => {
      this.refresh().catch(console.error);
    }, REFRESH_INTERVAL_MINUTES * 60_000);
  };

  getState(): WebSocketState {
    return this.#state;
  }

  setState(state: WebSocketState): void {
    this.#state = state;
    this.dispatchEvent(new WsEvent("state:change", this.getState()));
  }

  async refresh(): Promise<void> {
    const ws = new WebSocket(this.#setting.endpoint);

    try {
      // Load the new WebSocket
      const conn = await new Promise((resolve, reject) => {
        ws.addEventListener("open", async () => {
          ws.removeEventListener("error", reject);
          ws.removeEventListener("close", reject);
          this.send("/connect", {
            token: this.#token,
            spaceId: this.#setting.spaceId,
          })
            .then(resolve)
            .catch(reject);
        });
        ws.addEventListener("error", reject);
        ws.addEventListener("close", reject);
      });
      if (!conn) {
        this.destroy();
      }
    } catch (e) {
      console.error("Ws.refresh: fail to reconnect", e);
      captureException(e);
      this.destroy();
      return;
    }

    // Be sure to handle properly any new messages from now on
    ws.addEventListener("message", this.#onMessage);
    ws.addEventListener("error", this.#onError);
    ws.addEventListener("close", this.#onClose);

    const oldWs = this.#ws;
    this.#ws = ws;

    // Make sure we complete all pending requests on old connection
    setTimeout(() => {
      // We do not want to trigger onClose event
      oldWs.removeEventListener("message", this.#onMessage);
      oldWs.removeEventListener("error", this.#onError);
      oldWs.removeEventListener("close", this.#onClose);
      oldWs.close();
    }, RESPONSE_TIMEOUT + 1_000);

    this.#scheduleRefresh();
  }

  destroy(): void {
    if (this.#pingID !== null) {
      clearTimeout(this.#pingID);
    }
    if (this.#refreshID !== null) {
      clearTimeout(this.#refreshID);
    }
    this.#pendingReq.forEach((pendingReq) => {
      pendingReq.reject(new Error("Ws.onError: websocket is closing"));
    });
    this.dispatchEvent(new WsEvent("state:change", "closed"));
    this.#ws.close();
  }

  async load(): Promise<boolean> {
    if (this.#ws.readyState === WebSocket.OPEN) {
      const conn = await this.send("/connect", {
        token: this.#token,
        spaceId: this.#setting.spaceId,
      });

      if (conn === null) {
        this.destroy();
        return false;
      }

      this.setState("connected");
      this.#scheduleRefresh();

      return true;
    }

    if (this.#ws.readyState !== WebSocket.CONNECTING) {
      this.setState("disconnected");
      this.destroy();
      return false;
    }

    this.setState("connecting");

    const conn = await new Promise((resolve, reject) => {
      this.#ws.addEventListener("open", () => {
        this.send("/connect", {
          token: this.#token,
          spaceId: this.#setting.spaceId,
        })
          .then(resolve)
          .catch(reject);
        this.#ws.removeEventListener("error", reject);
        this.#ws.removeEventListener("close", reject);
        this.#scheduleRefresh();
      });
      this.#ws.addEventListener("error", reject);
      this.#ws.addEventListener("close", reject);
    });

    if (conn === null) {
      this.destroy();
      return false;
    }

    this.setState("connected");

    return true;
  }

  async send<P extends keyof WsRoutes>(
    action: P,
    data: WsRoutes[P]["in"],
  ): Promise<WsRoutes[P]["out"]> {
    return sendToWs(this.#ws, this.#pendingReq, action, data);
  }

  #onMessage = (event: MessageEvent): void => {
    const msg = JSON.parse(event.data);

    if (msg.type === "response") {
      const pending = this.#pendingReq.get(msg.msgId);
      if (pending) {
        if (msg.success) {
          pending.resolve(msg.payload);
        } else {
          pending.reject(msg.error);
        }
      } else {
        captureMessage(
          "onWsMessage: Received response for unknown or expired message",
          { level: Severity.Error, extra: msg },
        );
      }
    }

    if (msg.type === "event") {
      const e = new WsEvent<"server", WsServerEvents>("server", msg.payload);
      this.dispatchEvent(e);
    }

    if (msg.type === "cmd") {
      if (msg.payload.fn === "reload") {
        // Last resort command to trigger a reload
        window.location.reload();
      }
    }
  };

  #onClose = (event: CloseEvent): void => {
    console.warn("Ws.onClose:", {
      code: event.code,
      wasClean: event.wasClean,
      reason: event.reason,
    });
    this.destroy();
  };

  #onError = (event: Event): void => {
    console.warn("Ws.onError:", event);
    captureMessage("Ws.onError", { extra: { event } });
  };
}
