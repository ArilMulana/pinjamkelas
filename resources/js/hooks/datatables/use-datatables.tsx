import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
};

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [search, setSearch] = useState('');

  const { pageIndex, pageSize } = pagination;

  // Filter data berdasarkan search input
  const filteredData = React.useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  // Tambahkan kolom nomor urut yang berlanjut antar halaman
  const numberedColumns: ColumnDef<T>[] = React.useMemo(() => [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.index + 1 ,
    },
    ...columns,
  ], [columns]);

  const table = useReactTable({
    data: filteredData,
    columns: numberedColumns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: false,
    manualPagination: false,
    pageCount: Math.ceil(filteredData.length / pageSize),
  });

  // Reset pageIndex saat search atau pageSize berubah
  useEffect(() => {
    setPagination((old) => ({ ...old, pageIndex: 0 }));
  }, [search, pageSize]);

  return (
    <div className="w-full p-4 bg-white text-black">
      {/* Search dan page size selector */}
      <div className="flex justify-between mb-4 items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={pageSize}
          onChange={(e) => {
            setPagination((old) => ({
              ...old,
              pageSize: Number(e.target.value),
              pageIndex: 0, // reset pageIndex saat pageSize berubah
            }));
          }}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-2 text-left font-semibold cursor-pointer select-none"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span>
                      {header.column.getIsSorted() === 'asc' ? ' 🔼' : ''}
                      {header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={numberedColumns.length} className="px-4 py-6 text-center text-gray-500">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setPagination((old) => ({ ...old, pageIndex: Math.max(old.pageIndex - 1, 0) }))}
          disabled={pageIndex === 0}
          className={`px-3 py-1 border rounded text-sm ${
            pageIndex === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'
          }`}
        >
          Previous
        </button>

        <span className="text-sm">
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>

        <button
          onClick={() =>
            setPagination((old) => ({
              ...old,
              pageIndex: old.pageIndex + 1 < table.getPageCount() ? old.pageIndex + 1 : old.pageIndex,
            }))
          }
          disabled={pageIndex + 1 >= table.getPageCount()}
          className={`px-3 py-1 border rounded text-sm ${
            pageIndex + 1 >= table.getPageCount()
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-gray-100'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
