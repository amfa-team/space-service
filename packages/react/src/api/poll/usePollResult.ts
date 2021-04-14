import type { IPoll, WsServerEvents } from "@amfa-team/space-service-types";
import { useToken } from "@amfa-team/user-service";
import { useCallback, useEffect, useState } from "react";
import type { Ws } from "../../websocket/Ws";
import type { WsEvent } from "../../websocket/WsEvent";
import type { ApiSettings } from "../api";
import { apiPost } from "../api";
import { useApiSettings } from "../settings/useApiSettings";

async function getPollResult(
  settings: ApiSettings | null | void,
  token: string | null,
  poll: IPoll,
  signal?: AbortSignal,
): Promise<[string, number][]> {
  if (!token || !settings) {
    return [];
  }

  const result = await apiPost<"polls/result">(
    settings,
    "polls/result",
    {
      token,
      pollId: poll._id,
    },
    signal,
  );

  const choices = Object.keys(result.result);

  const data: [string, number][] = choices.map((choice) => [
    choice,
    result.result[choice],
  ]);
  data.sort((a, b) => b[1] - a[1]);

  return data;
}

export function usePollResult(poll: IPoll, websocket: Ws | null) {
  const token = useToken();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const settings = useApiSettings();
  const [pollResult, setPollResult] = useState<[string, number][]>([]);

  const updatePollResult = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        const result = await getPollResult(settings, token, poll, signal);
        if (!signal?.aborted) {
          setPollResult(result);
        }
      } catch (err) {
        if (!signal?.aborted) {
          setError(err);
        }
      } finally {
        if (!signal?.aborted) {
          setIsLoading(!(settings && token));
        }
      }
    },
    [settings, token, poll],
  );

  useEffect(() => {
    const abortController = new AbortController();

    updatePollResult(abortController.signal).catch((err) => {
      setError(err);
    });

    const listener = (event: WsEvent<"server", WsServerEvents>) => {
      if (event.data.name === "polls/vote" && event.data.pollId === poll._id) {
        updatePollResult(abortController.signal).catch((err) => {
          setError(err);
        });
      }
    };
    // @ts-ignore
    websocket?.addEventListener("server", listener);

    return () => {
      websocket?.removeEventListener("server", listener);
      abortController.abort();
    };
  }, [poll._id, websocket, updatePollResult]);

  if (error) {
    throw error;
  }

  return {
    updatePollResult,
    pollResult,
    isLoading,
  };
}
