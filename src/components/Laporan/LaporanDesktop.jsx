'use client';

import React, { useRef, useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

const LaporanDesktop = ({ data = [] }) => {
  const pdfRef = useRef();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const columns = useMemo(() => [
    {
      id: 'no',
      header: 'No.',
      cell: ({ row }) => row.index + 1,
    },
    {
      id: 'nomor',
      header: 'Nomor',
      accessorKey: 'nomor',
    },
    {
      id: 'ruangan',
      header: 'Ruangan',
      accessorKey: 'ruangan',
    },
    {
      id: 'waktu',
      header: 'Waktu',
      accessorKey: 'waktu',
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true); // Tampilkan judul

    // Tunggu update DOM
    await new Promise(resolve => setTimeout(resolve, 100));

    const input = pdfRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

    const margin = 40;
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', margin, 40, imgWidth, imgHeight);
    pdf.save('Laporan.pdf');

    setIsGeneratingPDF(false); // Sembunyikan kembali
  };

  if (!data.length) {
    return (
      <div className="hidden sm:block p-4 bg-white rounded-md shadow-lg text-center">
        <p className="text-gray-500">Tidak ada data tersedia.</p>
      </div>
    );
  }

  return (
    <div className="hidden sm:block p-4 bg-white rounded-md shadow-lg">
      {/* Filter dan Tombol PDF */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Cari data..."
          className="border rounded px-3 py-1 text-sm w-full sm:w-1/3"
        />
        <button
          onClick={handleDownloadPDF}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Download PDF
        </button>
      </div>

      {/* Tabel & Judul untuk PDF */}
      <div ref={pdfRef} className="overflow-x-auto">
        {isGeneratingPDF && (
          <h2 className="text-xl font-bold mb-4 text-blue-500 text-center">Antrian</h2>
        )}
        <table className="w-full border border-gray-300 border-collapse text-sm">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="border px-2 py-2 text-center cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {({
                      asc: ' 🔼',
                      desc: ' 🔽',
                    })[header.column.getIsSorted()] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="border px-2 py-2 text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Navigasi Halaman */}
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

export default LaporanDesktop;
