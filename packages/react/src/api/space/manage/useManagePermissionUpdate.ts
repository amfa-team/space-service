import type { PermissionUpdateData } from "@amfa-team/space-service-types";
import { useCallback, useState } from "react";
import { apiPost } from "../../api";
import { useApiSettings } from "../../settings/useApiSettings";

export function useManagePermissionUpdate(spaceId: string, userToken: string) {
  const [isSaving, setIsSaving] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const settings = useApiSettings();

  const update = useCallback(
    async (permission: Exclude<PermissionUpdateData, "spaceId">) => {
      setError(null);
      if (settings) {
        setIsSaving(true);
        await apiPost(settings, "manage/permission/update", {
          token: userToken,
          permission: { ...permission, spaceId },
        }).catch(setError);
        setIsSaving(false);
      }
    },
    [settings, userToken, spaceId],
  );

  return {
    error,
    update,
    isSaving,
  };
}
