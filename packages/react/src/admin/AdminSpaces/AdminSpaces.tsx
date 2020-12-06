import type { ISpace, PaginationData } from "@amfa-team/space-service-types";
import React, { useCallback, useEffect, useState } from "react";
import { apiPost } from "../../api/api";
import { useApiSettings } from "../../api/useApi";
import Table from "../Table/Table";
import { SpaceCreate } from "./SpaceCreate/SpaceCreate";

const getColumns = (onUpdateClick: (space: ISpace) => unknown) => [
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
];

export default function AdminSpaces() {
  const settings = useApiSettings();
  const [currentPage, setCurrentPage] = useState<ISpace[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [abortController, setAbortController] = useState(new AbortController());
  const [paginationSettings, setPaginationSettings] = useState<PaginationData>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [spaceUpdate, setSpaceUpdate] = useState<Partial<ISpace>>({});

  const fetchData = useCallback(
    (params: PaginationData) => {
      if (settings) {
        setIsLoading(true);
        setError(null);
        setPaginationSettings(params);
        apiPost(
          settings,
          "admin/space",
          {
            pagination: params,
            secret: settings.secret ?? "",
          },
          abortController.signal,
        )
          .then((data) => {
            setCurrentPage(data.page);
            setPageCount(data.pagination.pageCount);
            setCount(data.pagination.count);
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              setError(err);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
    [settings, abortController],
  );

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    setAbortController(controller);

    return () => {
      controller.abort();
    };
  }, [settings]);

  const onSpaceCreated = useCallback(() => {
    fetchData(paginationSettings);
    setSpaceUpdate({});
  }, [paginationSettings, fetchData]);

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <div>Oops an error occured</div>;
  }

  return (
    <>
      <SpaceCreate space={spaceUpdate} onChanged={onSpaceCreated} />
      <Table
        // @ts-ignore
        columns={getColumns(setSpaceUpdate)}
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
