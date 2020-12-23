import type { ISpace } from "@amfa-team/space-service-types";
import { useEffect, useState } from "react";
import { apiPost } from "../api";
import { useApiSettings } from "../settings/useApiSettings";

export function useSpace(slug: string) {
  const [space, setSpace] = useState<ISpace | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const settings = useApiSettings();

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    if (settings) {
      apiPost<"get">(settings, "get", { slug }, abortController.signal)
        .then((result) => {
          if (!abortController.signal.aborted) {
            setSpace(result);
          }
        })
        .catch((e) => {
          if (!abortController.signal.aborted) {
            setError(e);
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, [settings, slug]);

  if (error) {
    throw error;
  }

  return {
    space,
  };
}
