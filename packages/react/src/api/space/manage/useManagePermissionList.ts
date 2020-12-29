import type { IPermission } from "@amfa-team/space-service-types";
import { useEffect, useState } from "react";
import { apiPost } from "../../api";
import { useApiSettings } from "../../settings/useApiSettings";

export function useManagePermissionList(spaceId: string, userToken: string) {
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const settings = useApiSettings();

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);

    if (settings) {
      apiPost(
        settings,
        "manage/permission/list",
        { token: userToken, spaceId },
        abortController.signal,
      )
        .then((data) => {
          setPermissions(data.permissions);
        })
        .catch(setError)
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      abortController.abort();
    };
  }, [settings, userToken, spaceId]);

  return {
    permissions,
    isLoading,
    error,
  };
}
