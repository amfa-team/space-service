import type { ISpace } from "@amfa-team/space-service-types";
import isEqual from "lodash.isequal";
import { useEffect, useState } from "react";
import type { ApiSettings } from "../api";
import { apiGet } from "../api";
import { useApiSettings } from "../settings/useApiSettings";

export async function getSpaces(
  settings: ApiSettings,
  signal?: AbortSignal,
): Promise<ISpace[]> {
  const result = await apiGet<"list">(settings, "list", signal);
  return result.spaces;
}

export function useSpaceList(initialSpaces: ISpace[]) {
  const [spaces, setSpaces] = useState<ISpace[]>(initialSpaces);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const settings = useApiSettings();

  useEffect(() => {
    setSpaces(initialSpaces);
    setRetryCount(0);
  }, [initialSpaces]);

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    if (settings) {
      getSpaces(settings, abortController.signal)
        .then((result) => {
          if (!abortController.signal.aborted) {
            setSpaces((prev) => {
              return isEqual(prev, result) ? prev : result;
            });
          }
        })
        .catch((e) => {
          if (!abortController.signal.aborted) {
            if (retryCount < 3) {
              setRetryCount(retryCount + 1);
            } else {
              setError(e);
            }
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, [settings, retryCount]);

  if (error) {
    throw error;
  }

  return {
    spaces,
  };
}
