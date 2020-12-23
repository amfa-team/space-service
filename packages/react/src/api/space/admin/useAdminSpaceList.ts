import type { ISpace, PaginationData } from "@amfa-team/space-service-types";
import { useCallback, useEffect, useState } from "react";
import { apiPost } from "../../api";
import { useApiSettings } from "../../settings/useApiSettings";

export function useAdminSpaceList() {
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

  const refresh = useCallback(() => {
    fetchData(paginationSettings);
  }, [fetchData, paginationSettings]);

  return {
    refresh,
    currentPage,
    fetchData,
    isLoading,
    pageCount,
    count,
    error,
  };
}
