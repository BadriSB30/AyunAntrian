'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { StatusToggle } from '@/components/ui/Toogle';
import { FiEye, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

import { confirmDelete, confirmEdit, showError } from '@/lib/swal';

import { useDeleteCounter } from '@/hooks/counter/useDeleteCounter';
import { useCounters } from '@/hooks/counter/useCounters';
import { useCreateCounter } from '@/hooks/counter/useCreateCounter';
import { useUpdateCounter } from '@/hooks/counter/useUpdateCounter';
import { useCounterDetail } from '@/hooks/counter/useCounterDetail';
import { useUpdateCounterStatus } from '@/hooks/counter/useUpdateCounterStatus';

import type { CounterEntity } from '@/modules/counter/counter.entity';
import type { CreateCounterDTO, UpdateCounterDTO } from '@/modules/counter/counter.types';

import { CounterStatus } from '@/types/enums';
import { TVOnlyGuard } from '@/components/layout/TVOnlyGuard';

export default function CounterPage() {
	const { data: session } = useSession();
	const role = session?.user?.role;

	const { list, loading, refresh } = useCounters();
	const { submit: createCounter, loading: creating } = useCreateCounter(refresh);
	const { submit: updateCounter, loading: updating } = useUpdateCounter(refresh);
	const { remove: deleteCounter, loading: deleting } = useDeleteCounter(refresh);

	const { data: detail, open: openDetail, close: closeDetail } = useCounterDetail();
	const { toggleStatus } = useUpdateCounterStatus(refresh);

	/* ================= STATE ================= */

	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selected, setSelected] = useState<CounterEntity | null>(null);

	const [form, setForm] = useState<CreateCounterDTO>({
		kode_loket: '',
		nama_loket: '',
		status: CounterStatus.AKTIF,
	});

	/* ================= TABLE ================= */

	const columns = useMemo<ColumnDef<CounterEntity>[]>(
		() => [
			{
				accessorKey: 'kode_loket',
				header: 'Kode Loket',
			},
			{
				accessorKey: 'nama_loket',
				header: 'Nama Loket',
			},
			{
				header: 'Status',
				cell: ({ row }) => {
					const isActive = row.original.status === 'aktif';

					return (
						<div className='flex items-center justify-center gap-3'>
							<StatusToggle
								checked={isActive}
								disabled={role !== 'superadmin'}
								onChange={(value: boolean) =>
									toggleStatus(row.original.id, value ? 'aktif' : 'nonaktif')
								}
							/>

							<span
								className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
							>
								{isActive ? 'Aktif' : 'Nonaktif'}
							</span>
						</div>
					);
				},
			},
			{
				header: 'Aksi',
				cell: ({ row }) => (
					<div className='flex items-center justify-center gap-2'>
						<button
							onClick={() => openDetail(row.original.id)}
							className='rounded-md p-2 text-blue-600 transition hover:bg-blue-100'
							title='Detail'
						>
							<FiEye size={18} />
						</button>

						{role === 'superadmin' && (
							<>
								<button
									onClick={() => {
										setSelected(row.original);
										setForm(row.original);
										setOpenEdit(true);
									}}
									className='rounded-md p-2 text-green-600 transition hover:bg-green-100'
									title='Edit'
								>
									<FiEdit2 size={18} />
								</button>

								<button
									disabled={deleting}
									onClick={async () => {
										if (row.original.status === 'aktif') {
											showError(
												'Nonaktifkan loket terlebih dahulu sebelum menghapus.',
												'Tidak Bisa Dihapus',
											);
											return;
										}

										const confirmed = await confirmDelete({
											text: `Loket "${row.original.nama_loket}" akan dihapus permanen.`,
										});

										if (!confirmed) return;

										await deleteCounter(row.original.id);
									}}
									className='rounded-md p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50'
									title='Hapus Permanen'
								>
									<FiTrash2 size={18} />
								</button>
							</>
						)}
					</div>
				),
			},
		],
		[role, toggleStatus, openDetail, deleteCounter, deleting],
	);

	/* =========================
	LOADING LOKET
	========================== */
	if (loading) {
		return (
			<div className='flex items-center justify-center p-10'>
				<div className='flex flex-col items-center gap-3'>
					<div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600' />
					<p className='text-sm text-gray-500'>Memuat data loket...</p>
				</div>
			</div>
		);
	}

	return (
		<TVOnlyGuard>
			<div className='min-h-screen bg-slate-50 p-6 md:p-10'>
				<div className='mx-auto max-w-7xl space-y-8'>
					{/* HEADER */}
					<div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
						<div>
							<h1 className='text-3xl font-bold tracking-tight text-slate-800'>Manajemen Loket</h1>
							<p className='text-sm text-slate-500'>Kelola dan atur status loket</p>
						</div>

						{role === 'superadmin' && (
							<button
								onClick={() => {
									setForm({
										kode_loket: '',
										nama_loket: '',
										status: CounterStatus.AKTIF,
									});
									setOpenCreate(true);
								}}
								className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]'
							>
								<FiPlus />
								Tambah Loket
							</button>
						)}
					</div>

					{/* TABLE CARD */}
					<div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
						<DataTable
							data={list}
							columns={columns}
							searchable
							pageSize={10}
							emptyText='Belum ada data loket'
						/>
					</div>

					{/* CREATE MODAL */}
					<Modal
						isOpen={openCreate}
						onClose={() => setOpenCreate(false)}
					>
						<Modal.Header title='Tambah Loket' />
						<Modal.Body>
							<FormCounter
								form={form}
								setForm={setForm}
							/>
						</Modal.Body>
						<Modal.Footer
							submitText={creating ? 'Menyimpan...' : 'Simpan'}
							onSubmit={() => createCounter(form).then(() => setOpenCreate(false))}
						/>
					</Modal>

					{/* EDIT MODAL */}
					<Modal
						isOpen={openEdit}
						onClose={() => setOpenEdit(false)}
					>
						<Modal.Header title='Edit Loket' />
						<Modal.Body>
							<FormCounter
								form={form}
								setForm={setForm}
							/>
						</Modal.Body>
						<Modal.Footer
							submitText={updating ? 'Memperbarui...' : 'Perbarui'}
							onSubmit={async () => {
								if (!selected) return;

								const confirmed = await confirmEdit({
									title: 'Simpan Perubahan?',
									text: `Perubahan pada loket "${selected.nama_loket}" akan disimpan.`,
								});

								if (!confirmed) return;

								await updateCounter(selected.id, form as UpdateCounterDTO);

								setOpenEdit(false);
							}}
						/>
					</Modal>

					{/* DETAIL MODAL */}
					<Modal
						isOpen={!!detail}
						onClose={closeDetail}
						size='sm'
					>
						<Modal.Header title='Detail Loket' />
						<Modal.Body>
							{detail && (
								<div className='space-y-3 text-sm text-slate-700'>
									<p>
										<b>Kode :</b> {detail.kode_loket}
									</p>
									<p>
										<b>Nama :</b> {detail.nama_loket}
									</p>
									<p>
										<b>Status :</b> {detail.status}
									</p>
								</div>
							)}
						</Modal.Body>
					</Modal>
				</div>
			</div>
		</TVOnlyGuard>
	);
}

/* ================= FORM ================= */

function FormCounter({
	form,
	setForm,
}: {
	form: CreateCounterDTO;
	setForm: React.Dispatch<React.SetStateAction<CreateCounterDTO>>;
}) {
	return (
		<div className='space-y-4'>
			<input
				className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
				placeholder='Kode Loket'
				value={form.kode_loket}
				onChange={(e) =>
					setForm((f) => ({
						...f,
						kode_loket: e.target.value,
					}))
				}
			/>

			<input
				className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
				placeholder='Nama Loket'
				value={form.nama_loket}
				onChange={(e) =>
					setForm((f) => ({
						...f,
						nama_loket: e.target.value,
					}))
				}
			/>
		</div>
	);
}
