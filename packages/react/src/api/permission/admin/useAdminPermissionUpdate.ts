import type { PermissionUpdateData } from "@amfa-team/space-service-types";
import { useCallback } from "react";
import { apiPost } from "../../api";
import { useApiSettings } from "../../settings/useApiSettings";

export function useAdminPermissionUpdate() {
  const settings = useApiSettings();

  const validate = useCallback((permission: PermissionUpdateData | null) => {
    return (
      Boolean(permission?.userId && permission.spaceId) &&
      permission?.role === "admin"
    );
  }, []);

  const update = useCallback(
    async (permission: PermissionUpdateData | null) => {
      if (settings && permission && validate(permission)) {
        return apiPost(settings, "admin/permission/update", {
          secret: settings.secret ?? "",
          permission,
        });
      }

      return null;
    },
    [settings, validate],
  );

  return {
    update,
    validate,
  };
}
