'use client';

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { FiTrash, FiEdit } from 'react-icons/fi';

const AntrianDesktop = ({ data, onDelete, onEdit }) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = [
    {
      header: 'No.',
      cell: ({ row }) => row.index + 1,
    },
    {
      header: 'Nomor Antrian',
      accessorKey: 'nomor',
    },
    {
      header: 'Ruangan',
      accessorKey: 'ruangan',
    },
    {
      header: 'Waktu',
      accessorKey: 'waktu',
    },
    {
      header: 'Aksi',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-center gap-2">
            <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800">
              <FiTrash />
            </button>
            <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-800">
              <FiEdit />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="hidden sm:block p-4 bg-white rounded-md shadow-lg">
      {/* Filter Global */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Cari antrian..."
          className="border rounded px-3 py-1 text-sm w-1/3"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-gray-300 text-sm">
          <thead className="bg-gray-200 text-center">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border px-2 py-1 cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc'
                      ? ' 🔼'
                      : header.column.getIsSorted() === 'desc'
                      ? ' 🔽'
                      : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-center hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-2 py-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kontrol Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          Menampilkan {table.getRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} data
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AntrianDesktop;
