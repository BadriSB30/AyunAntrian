'use client';
/* @react-compiler disable */
/* eslint-disable react-hooks/incompatible-library */

import { useState } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	flexRender,
	type ColumnDef,
	type SortingState,
	type PaginationState,
} from '@tanstack/react-table';
import { FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';

interface DataTableProps<TData> {
	data: TData[];
	columns: ColumnDef<TData, unknown>[];
	searchable?: boolean;
	searchPlaceholder?: string;
	pageSize?: number;
	emptyText?: string;
	className?: string;
}

export function DataTable<TData>({
	data,
	columns,
	searchable = true,
	searchPlaceholder = 'Cari data...',
	pageSize = 10,
	emptyText = 'Tidak ada data',
	className = '',
}: DataTableProps<TData>) {
	/* =======================
	 * STATE
	 * ======================= */
	const [globalFilter, setGlobalFilter] = useState('');
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize,
	});

	/* =======================
	 * TABLE INSTANCE
	 * ======================= */
	const table = useReactTable({
		data,
		columns,
		state: {
			globalFilter,
			sorting,
			pagination,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,

		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	/* =======================
	 * RENDER
	 * ======================= */
	return (
		<div className={`hidden sm:block w-full rounded-xl border bg-white p-3 shadow-sm ${className}`}>
			{/* SEARCH */}
			{searchable && (
				<div className='mb-3'>
					<div className='relative max-w-sm'>
						<FiSearch className='absolute left-3 top-2.5 text-gray-400' />
						<input
							value={globalFilter}
							onChange={(e) => setGlobalFilter(e.target.value)}
							placeholder={searchPlaceholder}
							className='w-full rounded-lg border py-1.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500'
						/>
					</div>
				</div>
			)}

			{/* TABLE */}
			<div className='overflow-x-auto'>
				<table className='min-w-full border-collapse text-sm'>
					<thead className='sticky top-0 z-10 bg-gray-100'>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										onClick={header.column.getToggleSortingHandler()}
										className='cursor-pointer select-none border px-3 py-2 text-center font-semibold text-gray-700'
										style={{ width: header.getSize() }}
									>
										<div className='flex items-center justify-center gap-1'>
											{flexRender(header.column.columnDef.header, header.getContext())}
											{header.column.getIsSorted() === 'asc' && <FiChevronUp size={14} />}
											{header.column.getIsSorted() === 'desc' && <FiChevronDown size={14} />}
										</div>
									</th>
								))}
							</tr>
						))}
					</thead>

					<tbody>
						{table.getRowModel().rows.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className='border py-6 text-center text-gray-500'
								>
									{emptyText}
								</td>
							</tr>
						) : (
							table.getRowModel().rows.map((row, index) => (
								<tr
									key={row.id}
									className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50`}
								>
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className='whitespace-nowrap border px-3 py-2 text-center'
											style={{ width: cell.column.getSize() }}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* PAGINATION */}
			<div className='mt-3 flex items-center justify-between text-sm'>
				<p className='text-gray-600'>
					Menampilkan {table.getRowModel().rows.length} dari{' '}
					{table.getFilteredRowModel().rows.length} data
				</p>

				<div className='flex items-center gap-2'>
					<button
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className='rounded border px-3 py-1 disabled:opacity-40'
					>
						Prev
					</button>

					<span className='font-semibold'>
						{pagination.pageIndex + 1} / {table.getPageCount()}
					</span>

					<button
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className='rounded border px-3 py-1 disabled:opacity-40'
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
