import React from "react";
import { usePagination, useTable } from "react-table";
import type {
  Column,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
} from "react-table";
import classes from "./table.module.css";

// eslint-disable-next-line @typescript-eslint/ban-types
interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  fetchData: (params: { pageIndex: number; pageSize: number }) => void;
  loading: boolean;
  pageCount: number;
  count: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default function Table<T extends object>({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  count,
}: TableProps<T>) {
  const paginationOptions: UsePaginationOptions<T> = {
    manualPagination: true,
    pageCount: controlledPageCount,
  };

  const initialPaginationState: UsePaginationState<T> = {
    pageIndex: 0,
    pageSize: 50,
  };

  const instanceProps = useTable(
    {
      columns,
      data,
      // @ts-ignore
      initialState: { ...initialPaginationState },
      ...paginationOptions,
    },
    usePagination,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
  } = instanceProps;

  const {
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = (instanceProps as any) as UsePaginationInstanceProps<T>;

  const {
    pageIndex,
    pageSize,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = (instanceProps.state as any) as UsePaginationState<T>;

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  return (
    <>
      <table className={classes.table} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            /* eslint-disable-next-line react/jsx-key */
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                /* eslint-disable-next-line react/jsx-key */
                <th className={classes.th} {...column.getHeaderProps()}>
                  {column.render("Header")}
                  {/* <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span> */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              /* eslint-disable-next-line react/jsx-key */
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    /* eslint-disable-next-line react/jsx-key */
                    <td className={classes.td} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            {loading ? (
              // Use our custom loading state to show a loading indicator
              <td colSpan={10000}>Loading...</td>
            ) : (
              <td colSpan={10000}>
                Showing {page.length} of {count} results
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <div className="pagination">
        <button
          type="button"
          onClick={() => {
            gotoPage(0);
          }}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button
          type="button"
          onClick={() => {
            previousPage();
          }}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>{" "}
        <button
          type="button"
          onClick={() => {
            nextPage();
          }}
          disabled={!canNextPage}
        >
          {">"}
        </button>{" "}
        <button
          type="button"
          onClick={() => {
            gotoPage(pageCount - 1);
          }}
          disabled={!canNextPage}
        >
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {Number(pageIndex) + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={Number(pageIndex) + 1}
            onChange={(e) => {
              gotoPage(e.target.value ? Number(e.target.value) - 1 : 0);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
