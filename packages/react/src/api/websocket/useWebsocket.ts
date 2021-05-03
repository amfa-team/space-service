import { useIsRegistered, useToken } from "@amfa-team/user-service";
import { captureException } from "@sentry/react";
import { useEffect, useState } from "react";
import { Ws } from "../../websocket/Ws";
import { useApiSettings } from "../settings/useApiSettings";

export function useWebsocket(spaceId: string) {
  const wsEndpoint = useApiSettings()?.wsEndpoint ?? null;
  const [websocket, setWebsocket] = useState<Ws | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const token = useToken();
  const isRegistered = useIsRegistered();

  useEffect(() => {
    const abortController = new AbortController();
    const ws =
      token === null || wsEndpoint === null || !isRegistered
        ? null
        : new Ws(token, { endpoint: wsEndpoint, spaceId });

    setWebsocket(ws);
    setIsConnected(false);
    // @ts-ignore
    ws?.addEventListener("state:change", (event) => {
      if (!abortController.signal.aborted) {
        setIsConnected(event.data === "connected");
        // if (event.data === "closed") {
        //   setError(new Error("Websocket is closed"));
        // }
      }
    });
    ws?.load().catch((e) => {
      if (!abortController.signal.aborted) {
        setError(e);
        captureException(e);
      }
    });

    return () => {
      abortController.abort();
      ws?.removeEventListener("state:change");
      ws?.destroy();
    };
  }, [wsEndpoint, spaceId, isRegistered, token]);

  if (error) {
    throw error;
  }

  return {
    isConnected,
    websocket: isConnected ? websocket : null,
  };
}
