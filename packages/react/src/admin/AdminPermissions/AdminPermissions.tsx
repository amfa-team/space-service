import type { IPermission } from "@amfa-team/space-service-types";
import React, { useCallback, useState } from "react";
import { useAdminPermissionList } from "../../api/permission/admin/useAdminPermissionList";
import { useAdminPermissionRemove } from "../../api/permission/admin/useAdminPermissionRemove";
import Table from "../Table/Table";
import { PermissionCreate } from "./PermissionCreate/PermissionCreate";

const getColumns = (
  onUpdateClick: (permission: IPermission) => unknown,
  onRemoveClicked: (permission: IPermission) => unknown,
) => [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Space Slug",
    accessor: "spaceId",
  },
  {
    Header: "UserId",
    accessor: "userId",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Created At",
    accessor: (permission: IPermission & { createdAt: string }) =>
      permission.createdAt,
  },
  {
    Header: "Updated At",
    accessor: (permission: IPermission & { updatedAt: string }) =>
      permission.updatedAt,
  },
  {
    Header: "Update",
    accessor: (permission: IPermission) => (
      <button
        type="button"
        onClick={() => {
          onUpdateClick(permission);
        }}
      >
        Update
      </button>
    ),
  },
  {
    Header: "Remove",
    accessor: (permission: IPermission) => (
      <button
        type="button"
        onClick={() => {
          onRemoveClicked(permission);
        }}
      >
        Remove
      </button>
    ),
  },
];

export default function AdminPermissions() {
  const {
    refresh,
    currentPage,
    fetchData,
    isLoading,
    pageCount,
    count,
    error,
  } = useAdminPermissionList();
  const { remove } = useAdminPermissionRemove();
  const [permissionUpdate, setPermissionUpdate] = useState<
    Partial<IPermission>
  >({});

  const reset = useCallback(() => {
    refresh();
    setPermissionUpdate({});
  }, [refresh]);

  const onRemovedClicked = useCallback(
    async (permission: IPermission) => {
      return remove(permission.spaceId, permission.userId).then(() => reset());
    },
    [remove, reset],
  );

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <div>Oops an error occured</div>;
  }

  return (
    <>
      <PermissionCreate permission={permissionUpdate} onChanged={reset} />
      <Table
        // @ts-ignore
        columns={getColumns(setPermissionUpdate, onRemovedClicked)}
        // @ts-ignore
        data={currentPage}
        fetchData={fetchData}
        loading={isLoading}
        pageCount={pageCount}
        count={count}
      />
    </>
  );
}
