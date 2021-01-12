import { useCallback } from "react";
import { apiPost } from "../../api";
import { useApiSettings } from "../../settings/useApiSettings";

export function useAdminSpaceRemove() {
  const settings = useApiSettings();

  const remove = useCallback(
    async (slug: string) => {
      if (settings) {
        return apiPost(settings, "admin/space/remove", {
          secret: settings.secret ?? "",
          slug,
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
