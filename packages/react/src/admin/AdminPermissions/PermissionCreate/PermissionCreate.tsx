import type {
  IPermission,
  PermissionUpdateData,
} from "@amfa-team/space-service-types";
import type { SyntheticEvent } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { useAdminPermissionUpdate } from "../../../api/permission/admin/useAdminPermissionUpdate";

interface PermissionCreateProps {
  permission: Partial<IPermission>;
  onChanged: () => void;
}

export function PermissionCreate(props: PermissionCreateProps) {
  const { permission, onChanged } = props;
  const [data, setData] = useState<PermissionUpdateData>({
    spaceId: permission.spaceId ?? "",
    userEmail: permission.userEmail ?? "",
    role: permission.role ?? "admin",
  });
  const { update, validate } = useAdminPermissionUpdate();

  const reset = useCallback(() => {
    setData({
      spaceId: permission.spaceId ?? "",
      userEmail: permission.userEmail ?? "",
      role: permission.role ?? "admin",
    });
  }, [permission]);

  useEffect(() => {
    reset();
  }, [reset]);

  const onSpaceIdChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const spaceId = e.target.value;
      setData((d) => ({ ...d, spaceId }));
    },
    [],
  );
  const onUserEmailChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const userEmail = e.target.value;
      setData((d) => ({ ...d, userEmail }));
    },
    [],
  );
  const onRoleChanged = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const role: any = e.target.value;
      setData((d) => ({ ...d, role }));
    },
    [],
  );

  const submit = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      update(data)
        .then(onChanged)
        // eslint-disable-next-line no-console
        .catch(console.error);
    },
    [update, data, onChanged],
  );

  return (
    <div>
      <p>Create/Update Permission</p>
      <form onSubmit={submit}>
        <div>
          <label>
            SpaceId:
            <input
              type="text"
              value={data.spaceId}
              size={50}
              onChange={onSpaceIdChanged}
              required
              minLength={3}
            />
          </label>
        </div>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={data.userEmail}
              size={50}
              onChange={onUserEmailChanged}
              required
              minLength={3}
            />
          </label>
        </div>
        <div>
          <label>
            Role:
            <select onChange={onRoleChanged}>
              <option value="admin" selected={data.role === "admin"}>
                admin
              </option>
              <option value="user" selected={data.role === "user"}>
                user
              </option>
            </select>
          </label>
        </div>
        <button type="submit" disabled={!validate(data)}>
          Submit
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </form>
    </div>
  );
}
