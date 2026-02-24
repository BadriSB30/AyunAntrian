'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
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

	/* =========================
	   MODAL STATE
	========================= */
	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selected, setSelected] = useState<CounterEntity | null>(null);

	/* =========================
	   FORM STATE
	========================= */
	const [form, setForm] = useState<CreateCounterDTO>({
		kode_loket: '',
		nama_loket: '',
		status: CounterStatus.AKTIF,
	});

	/* =========================
	   TABLE COLUMNS
	========================= */
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
								className={`text-xs font-medium ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}
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
						{/* DETAIL */}
						<button
							onClick={() => openDetail(row.original.id)}
							className='rounded p-2 text-blue-600 hover:bg-blue-50'
							title='Detail'
						>
							<FiEye size={18} />
						</button>

						{/* EDIT */}
						{role === 'superadmin' && (
							<button
								onClick={() => {
									setSelected(row.original);
									setForm(row.original);
									setOpenEdit(true);
								}}
								className='rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 transition'
								title='Edit'
							>
								<FiEdit2 size={18} />
							</button>
						)}

						{/* DELETE */}
						{role === 'superadmin' && (
							<button
								disabled={deleting}
								onClick={async () => {
									// ⛔ BLOK JIKA MASIH AKTIF
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
								className='rounded-lg p-2 text-red-600 hover:bg-red-50 transition disabled:opacity-50'
								title='Hapus Permanen'
							>
								<FiTrash2 size={18} />
							</button>
						)}
					</div>
				),
			},
		],
		[role, toggleStatus, openDetail, deleteCounter, deleting],
	);

	if (loading) {
		return <p className='p-6'>Memuat data loket...</p>;
	}

	return (
		<TVOnlyGuard>
			<div className='space-y-6 p-8'>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold'>Manajemen Loket</h1>

					{role === 'superadmin' && (
						<button
							onClick={() => {
								setForm({ kode_loket: '', nama_loket: '', status: CounterStatus.AKTIF });
								setOpenCreate(true);
							}}
							className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700'
						>
							<FiPlus /> Tambah Loket
						</button>
					)}
				</div>

				<DataTable
					data={list}
					columns={columns}
					searchable
					pageSize={10}
					emptyText='Belum ada data loket'
				/>

				{/* =========================
			   MODAL CREATE
			========================= */}
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

				{/* =========================
			   MODAL EDIT
			========================= */}
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

				{/* =========================
			   MODAL DETAIL
			========================= */}
				<Modal
					isOpen={!!detail}
					onClose={closeDetail}
					size='sm'
				>
					<Modal.Header title='Detail Loket' />
					<Modal.Body>
						{detail && (
							<div className='space-y-2 text-sm'>
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
		</TVOnlyGuard>
	);
}

interface FormCounterProps {
	form: CreateCounterDTO;
	setForm: React.Dispatch<React.SetStateAction<CreateCounterDTO>>;
}

function FormCounter({ form, setForm }: FormCounterProps) {
	return (
		<div className='space-y-4'>
			<input
				className='w-full rounded border px-3 py-2'
				placeholder='Kode Loket'
				value={form.kode_loket}
				onChange={(e) => setForm((f) => ({ ...f, kode_loket: e.target.value }))}
			/>

			<input
				className='w-full rounded border px-3 py-2'
				placeholder='Nama Loket'
				value={form.nama_loket}
				onChange={(e) => setForm((f) => ({ ...f, nama_loket: e.target.value }))}
			/>
		</div>
	);
}

function StatusToggle({
	checked,
	onChange,
	disabled = false,
}: {
	checked: boolean;
	onChange: (value: boolean) => void;
	disabled?: boolean;
}) {
	return (
		<button
			type='button'
			disabled={disabled}
			onClick={() => onChange(!checked)}
			className={`relative inline-flex h-6 w-11 items-center rounded-full transition
				${checked ? 'bg-emerald-600' : 'bg-gray-300'}
				${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
		>
			<span
				className={`inline-block h-4 w-4 transform rounded-full bg-white transition
					${checked ? 'translate-x-6' : 'translate-x-1'}`}
			/>
		</button>
	);
}
