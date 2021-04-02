import type { IPoll, ISpace, PollStatus } from "@amfa-team/space-service-types";
import { useToken } from "@amfa-team/user-service";
import isEqual from "lodash.isequal";
import { useEffect, useMemo, useState } from "react";
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

export function usePollList(space: ISpace) {
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
            timeoutID = setTimeout(() => {
              updatePolls(signal);
            }, 10_000);
          }
        });
    };

    setIsLoading(true);
    updatePolls(abortController.signal);

    return () => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      abortController.abort();
    };
  }, [settings, space._id, token]);

  if (error) {
    throw error;
  }

  return {
    isLoading,
    polls,
  };
}

export function usePollListWithFilter(space: ISpace, statuses: PollStatus[]) {
  const { polls, isLoading } = usePollList(space);

  const result = useMemo(
    () => polls.filter((p) => statuses.includes(p.status)),
    [polls, statuses],
  );

  return {
    polls: result,
    isLoading,
  };
}
