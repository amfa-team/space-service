import type { ISpace } from "@amfa-team/space-service-types";
import { useEffect, useState } from "react";
import { apiPost } from "../../api";
import { useApiSettings } from "../../settings/useApiSettings";

export function useManageSpaceList(userToken: string | null) {
  const [spaces, setSpaces] = useState<ISpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const settings = useApiSettings();

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);

    if (settings && userToken) {
      apiPost(
        settings,
        "manage/space/list",
        { token: userToken },
        abortController.signal,
      )
        .then((data) => {
          setSpaces(data.spaces);
        })
        .catch(setError)
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSpaces([]);
    }

    return () => {
      abortController.abort();
    };
  }, [settings, userToken]);

  return {
    spaces,
    isLoading,
    error,
  };
}
