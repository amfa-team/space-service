import type {
  IPoll,
  ISpace,
  PollStatus,
  WsServerEvents,
} from "@amfa-team/space-service-types";
import { useToken } from "@amfa-team/user-service";
import isEqual from "lodash.isequal";
import { useEffect, useState } from "react";
import type { Ws } from "../../websocket/Ws";
import type { WsEvent } from "../../websocket/WsEvent";
import type { ApiSettings } from "../api";
import { apiPost } from "../api";
import { useApiSettings } from "../settings/useApiSettings";

export async function getPolls(
  settings: ApiSettings | null | void,
  token: string | null,
  spaceSlug: string,
  signal?: AbortSignal,
): Promise<IPoll[]> {
  if (!token || !settings) {
    return [];
  }

  const result = await apiPost<"polls/list">(
    settings,
    "polls/list",
    {
      token,
      spaceSlug,
    },
    signal,
  );

  return result.polls;
}

export function usePollList(space: ISpace, websocket: Ws | null) {
  const token = useToken();
  const [polls, setPolls] = useState<IPoll[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const settings = useApiSettings();

  useEffect(() => {
    setPolls([]);
    setIsLoading(true);
  }, [space]);

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);

    let timeoutID: NodeJS.Timeout | null = null;

    const updatePolls = (signal: AbortSignal) => {
      getPolls(settings, token, space._id, signal)
        .then((result) => {
          if (!signal.aborted) {
            setPolls((prev) => {
              return isEqual(prev, result) ? prev : result;
            });
            setError(null);
          }
        })
        .catch((e) => {
          if (!signal.aborted) {
            setError(e);
          }
        })
        .finally(() => {
          if (!signal.aborted) {
            setIsLoading(!(settings && token));
            if (websocket === null) {
              // If Websocket is not connected
              timeoutID = setTimeout(() => {
                updatePolls(signal);
              }, 10_000);
            }
          }
        });
    };

    setIsLoading(true);
    updatePolls(abortController.signal);

    const listener = (event: WsEvent<"server", WsServerEvents>) => {
      if (event.data.name === "polls/updated") {
        updatePolls(abortController.signal);
      }
    };
    // @ts-ignore
    websocket?.addEventListener("server", listener);

    return () => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      websocket?.removeEventListener("server", listener);
      abortController.abort();
    };
  }, [settings, space._id, token, websocket]);

  if (error) {
    throw error;
  }

  return {
    isLoading,
    polls,
  };
}

export function usePollListWithFilter(
  space: ISpace,
  websocket: Ws | null,
  statuses: PollStatus[],
) {
  const { polls, isLoading } = usePollList(space, websocket);
  const [result, setResult] = useState(polls);

  useEffect(() => {
    if (!isLoading) {
      const r = polls.filter((p) => statuses.includes(p.status));
      setResult((prev) => (isEqual(prev, r) ? prev : r));
    }
  }, [polls, isLoading, statuses]);

  return {
    polls: result,
    isLoading,
  };
}
