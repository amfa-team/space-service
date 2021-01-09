import type { ISpace } from "@amfa-team/space-service-types";
import {
  useToken as useJwtToken,
  useSpaceAccess,
} from "@amfa-team/user-service";
import { useEffect, useState } from "react";
import { apiPost } from "../api";
import { useApiSettings } from "../settings/useApiSettings";

export function useSpace(slug: string) {
  const [space, setSpace] = useState<ISpace | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = useJwtToken();
  const settings = useApiSettings();

  useSpaceAccess(slug, isPrivate ? "user" : null);

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    if (settings) {
      setLoading(true);
      setIsPrivate(false);
      apiPost<"get">(settings, "get", { slug, token }, abortController.signal)
        .then((result) => {
          if (!abortController.signal.aborted) {
            setSpace(result.space);
            setIsPrivate(result.private);
          }
        })
        .catch((e) => {
          if (!abortController.signal.aborted) {
            setError(e);
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
  }, [settings, slug, token]);

  if (error) {
    throw error;
  }

  return {
    space,
    loading,
  };
}