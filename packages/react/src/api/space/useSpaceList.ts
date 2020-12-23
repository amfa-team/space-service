import type { ISpace } from "@amfa-team/space-service-types";
import { useEffect, useState } from "react";
import { apiGet } from "../api";
import { useApiSettings } from "../settings/useApiSettings";

export function useSpaceList() {
  const [spaces, setSpaces] = useState<ISpace[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const settings = useApiSettings();

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    if (settings) {
      apiGet<"list">(settings, "list", abortController.signal)
        .then((result) => {
          if (!abortController.signal.aborted) {
            setSpaces(result.spaces);
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
  }, [settings]);

  if (error) {
    throw error;
  }

  return {
    spaces,
  };
}
