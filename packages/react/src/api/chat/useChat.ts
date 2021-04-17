import { useToken as useJwtToken } from "@amfa-team/user-service";
import isEqual from "lodash.isequal";
import { useEffect, useState } from "react";
import { apiPost } from "../api";
import { useApiSettings } from "../settings/useApiSettings";

export function useChat(slug: string) {
  const [chatToken, setChatToken] = useState<string | null>(null);
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
      apiPost<"getChatToken">(
        settings,
        "getChatToken",
        { slug, token },
        abortController.signal,
      )
        .then((result) => {
          if (!abortController.signal.aborted) {
            setChatToken((currentChatToken) => {
              // do not update reference when equal to prevent re-render
              return isEqual(result.chatToken, currentChatToken)
                ? currentChatToken
                : result.chatToken;
            });
            setIsPrivate(!!result.chatToken);
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
    chatToken,
    // Do not show loading on reload (would re-render subtree)
    loading,
    isPrivate,
  };
}
