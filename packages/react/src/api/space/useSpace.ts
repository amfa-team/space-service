import type { ISpace } from "@amfa-team/space-service-types";
import { useToken as useJwtToken } from "@amfa-team/user-service";
import isEqual from "lodash.isequal";
import { useEffect, useState } from "react";
import { apiPost } from "../api";
import { useApiSettings } from "../settings/useApiSettings";

export function useSpace(slug: string) {
  const [space, setSpace] = useState<ISpace | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);
  const token = useJwtToken();
  const settings = useApiSettings();

  useEffect(() => {
    setRetryCount(0);
  }, [slug]);

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    if (settings) {
      setLoading(true);
      setIsPrivate(false);
      apiPost<"get">(settings, "get", { slug, token }, abortController.signal)
        .then((result) => {
          if (!abortController.signal.aborted) {
            setSpace((currentSpace) => {
              // do not update reference when equal to prevent re-render
              return isEqual(result.space, currentSpace)
                ? currentSpace
                : result.space;
            });
            setIsPrivate(result.private);
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
        })
        .finally(() => {
          if (!abortController.signal.aborted) {
            setLoading(false);
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, [settings, slug, token, retryCount]);

  if (error) {
    throw error;
  }

  return {
    space,
    loading,
    isPrivate,
  };
}
