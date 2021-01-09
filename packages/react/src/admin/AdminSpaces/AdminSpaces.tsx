import type { ISpace } from "@amfa-team/space-service-types";
import React, { useCallback, useState } from "react";
import { useAdminSpaceList } from "../../api/space/admin/useAdminSpaceList";
import { useAdminSpaceRemove } from "../../api/space/admin/useAdminSpaceRemove";
import Table from "../Table/Table";
import { SpaceCreate } from "./SpaceCreate/SpaceCreate";

const getColumns = (
  onUpdateClick: (space: ISpace) => unknown,
  onRemoveClicked: (space: ISpace) => unknown,
) => [
  {
    Header: "Slug",
    accessor: "_id",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Enabled",
    accessor: (space: ISpace) => (space.enabled ? "TRUE" : "FALSE"),
  },
  {
    Header: "Random",
    accessor: (space: ISpace) => (space.random ? "TRUE" : "FALSE"),
  },
  {
    Header: "Home",
    accessor: (space: ISpace) => (space.home ? "TRUE" : "FALSE"),
  },
  {
    Header: "Public",
    accessor: (space: ISpace) => (space.public ? "TRUE" : "FALSE"),
  },
  {
    Header: "Order",
    accessor: "order",
  },
  {
    Header: "Image Url",
    accessor: "imageUrl",
  },
  {
    Header: "Created At",
    accessor: (space: ISpace & { createdAt: string }) => space.createdAt,
  },
  {
    Header: "Updated At",
    accessor: (space: ISpace & { updatedAt: string }) => space.updatedAt,
  },
  {
    Header: "Update",
    accessor: (space: ISpace) => (
      <button
        type="button"
        onClick={() => {
          onUpdateClick(space);
        }}
      >
        Update
      </button>
    ),
  },
  {
    Header: "Remove",
    accessor: (space: ISpace) => (
      <button
        type="button"
        onClick={() => {
          onRemoveClicked(space);
        }}
      >
        Remove
      </button>
    ),
  },
];

export default function AdminSpaces() {
  const {
    refresh,
    currentPage,
    fetchData,
    isLoading,
    pageCount,
    count,
    error,
  } = useAdminSpaceList();
  const { remove } = useAdminSpaceRemove();
  const [spaceUpdate, setSpaceUpdate] = useState<Partial<ISpace>>({});

  const reset = useCallback(() => {
    refresh();
    setSpaceUpdate({});
  }, [refresh]);

  const onRemovedClicked = useCallback(
    async (space: ISpace) => {
      return remove(space._id).then(() => reset());
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
      <SpaceCreate space={spaceUpdate} onChanged={reset} />
      <Table
        // @ts-ignore
        columns={getColumns(setSpaceUpdate, onRemovedClicked)}
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
