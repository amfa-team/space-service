import { useToken } from "@amfa-team/user-service";
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

  useEffect(() => {
    const ws =
      token === null || wsEndpoint === null
        ? null
        : new Ws(token, { endpoint: wsEndpoint, spaceId });

    setWebsocket(ws);
    setIsConnected(false);
    ws?.addEventListener("state:change", (event) => {
      setIsConnected(event.data === "connected");
      if (event.data === "closed") {
        setError(new Error("Websocket is closed"));
      }
    });
    ws?.load().catch(captureException);

    return () => {
      ws?.removeEventListener("state:change");
      ws?.destroy();
    };
  }, [wsEndpoint, spaceId, token]);

  if (error) {
    throw error;
  }

  return {
    isConnected,
    websocket: isConnected ? websocket : null,
  };
}
