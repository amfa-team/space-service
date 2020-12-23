import { useCallback } from "react";
import { apiPost } from "../../api";
import { useApiSettings } from "../../settings/useApiSettings";

export function useAdminPermissionRemove() {
  const settings = useApiSettings();

  const remove = useCallback(
    async (spaceId: string, userId: string) => {
      if (settings) {
        return apiPost(settings, "admin/permission/remove", {
          secret: settings.secret ?? "",
          spaceId,
          userId,
        });
      }

      return null;
    },
    [settings],
  );

  return {
    remove,
  };
}
