'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { FiEye, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { confirmDelete, confirmEdit } from '@/lib/swal';

import { useDeleteShiftTemplate } from '@/hooks/shiftTemplate/useDeleteShiftTemplate';
import { useShiftTemplate } from '@/hooks/shiftTemplate/useShiftTemplate';
import { useCreateShiftTemplate } from '@/hooks/shiftTemplate/useCreateShiftTemplate';
import { useUpdateShiftTemplate } from '@/hooks/shiftTemplate/useUpdateShiftTemplate';
import { useShiftDetailTemplate } from '@/hooks/shiftTemplate/useShiftTemplateDetail';

import type { ShiftEntity } from '@/modules/shift/shift.entity';

import type { CreateShiftDTO, UpdateShiftDTO } from '@/modules/shift/shift.types';
import { TVOnlyGuard } from '@/components/layout/TVOnlyGuard';

export default function ShiftPage() {
	const { data: session } = useSession();
	const role = session?.user?.role;

	const { list, loading, refresh } = useShiftTemplate();
	const { submit: createShift, loading: creating } = useCreateShiftTemplate(refresh);
	const { submit: updateShift, loading: updating } = useUpdateShiftTemplate(refresh);
	const { remove: deleteShift, loading: deleting } = useDeleteShiftTemplate(refresh);

	const { data: detail, open: openDetail, close: closeDetail } = useShiftDetailTemplate();

	/* =========================
	   MODAL STATE
	========================= */
	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selected, setSelected] = useState<ShiftEntity | null>(null);

	/* =========================
	   FORM STATE
	========================= */
	const [form, setForm] = useState<CreateShiftDTO>({
		nama_shift: '',
		jam_mulai: '',
		jam_selesai: '',
	});

	/* =========================
	   TABLE COLUMNS
	========================= */
	const columns = useMemo<ColumnDef<ShiftEntity>[]>(
		() => [
			{
				accessorKey: 'nama_shift',
				header: 'Nama Shift',
			},
			{
				accessorKey: 'jam_mulai',
				header: 'Jam Mulai',
			},
			{
				accessorKey: 'jam_selesai',
				header: 'Jam Selesai',
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
									const confirmed = await confirmDelete({
										text: `Shift "${row.original.nama_shift}" akan dihapus permanen.`,
									});

									if (!confirmed) return;

									await deleteShift(row.original.id);
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
		[role, openDetail, deleteShift, deleting],
	);

	if (loading) {
		return <p className='p-6'>Memuat data shift...</p>;
	}

	return (
		<TVOnlyGuard>
			<div className='space-y-6 p-8'>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold'>Manajemen Template Shift</h1>

					{role === 'superadmin' && (
						<button
							onClick={() => {
								setForm({ nama_shift: '', jam_mulai: '', jam_selesai: '' });
								setOpenCreate(true);
							}}
							className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700'
						>
							<FiPlus /> Tambah Template
						</button>
					)}
				</div>

				<DataTable
					data={list}
					columns={columns}
					searchable
					pageSize={10}
					emptyText='Belum ada data shift'
				/>

				{/* =========================
			   MODAL CREATE
			========================= */}
				<Modal
					isOpen={openCreate}
					onClose={() => setOpenCreate(false)}
				>
					<Modal.Header title='Tambah Template Shift' />
					<Modal.Body>
						<FormShift
							form={form}
							setForm={setForm}
						/>
					</Modal.Body>
					<Modal.Footer
						submitText={creating ? 'Menyimpan...' : 'Simpan'}
						onSubmit={() => createShift(form).then(() => setOpenCreate(false))}
					/>
				</Modal>

				{/* =========================
			   MODAL EDIT
			========================= */}
				<Modal
					isOpen={openEdit}
					onClose={() => setOpenEdit(false)}
				>
					<Modal.Header title='Edit Template Shift' />
					<Modal.Body>
						<FormShift
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
								text: `Perubahan pada template shift "${selected.nama_shift}" akan disimpan.`,
							});

							if (!confirmed) return;

							await updateShift(selected.id, form as UpdateShiftDTO);
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
					<Modal.Header title='Detail Template Shift' />
					<Modal.Body>
						{detail && (
							<div className='space-y-2 text-sm'>
								<p>
									<b>Nama Shift :</b> {detail.nama_shift}
								</p>
								<p>
									<b>Jam Mulai :</b> {detail.jam_mulai}
								</p>
								<p>
									<b>Jam Selesai :</b> {detail.jam_selesai}
								</p>
							</div>
						)}
					</Modal.Body>
				</Modal>
			</div>
		</TVOnlyGuard>
	);
}

interface FormShiftProps {
	form: CreateShiftDTO;
	setForm: React.Dispatch<React.SetStateAction<CreateShiftDTO>>;
}

function FormShift({ form, setForm }: FormShiftProps) {
	const toTimeInput = (value: string) => value?.slice(0, 5) ?? '';
	const toDBTime = (value: string) => (value ? `${value}:00` : '');

	return (
		<div className='space-y-4'>
			<input
				className='w-full rounded border px-3 py-2'
				placeholder='Nama Shift'
				value={form.nama_shift}
				onChange={(e) => setForm((f) => ({ ...f, nama_shift: e.target.value }))}
			/>

			{/* JAM MULAI */}
			<input
				type='time'
				className='w-full rounded border px-3 py-2'
				value={toTimeInput(form.jam_mulai)}
				onChange={(e) =>
					setForm((f) => ({
						...f,
						jam_mulai: toDBTime(e.target.value),
					}))
				}
			/>

			{/* JAM SELESAI */}
			<input
				type='time'
				className='w-full rounded border px-3 py-2'
				value={toTimeInput(form.jam_selesai)}
				onChange={(e) =>
					setForm((f) => ({
						...f,
						jam_selesai: toDBTime(e.target.value),
					}))
				}
			/>
		</div>
	);
}
