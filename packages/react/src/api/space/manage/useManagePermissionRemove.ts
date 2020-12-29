import { useCallback, useState } from "react";
import { apiPost } from "../../api";
import { useApiSettings } from "../../settings/useApiSettings";

export function useManagePermissionRemove(spaceId: string, userToken: string) {
  const [isSaving, setIsSaving] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const settings = useApiSettings();

  const update = useCallback(
    async (userEmail: string) => {
      setError(null);
      if (settings) {
        setIsSaving(true);
        await apiPost(settings, "manage/permission/remove", {
          token: userToken,
          userEmail,
          spaceId,
        }).catch(setError);
        setIsSaving(false);
      }
    },
    [settings, spaceId, userToken],
  );

  return {
    error,
    update,
    isSaving,
  };
}
