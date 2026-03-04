'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { ColumnDef } from '@tanstack/react-table';
import { FiEye, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { confirmDelete, confirmEdit } from '@/lib/swal';

import { useWeeklyShiftTemplate } from '@/hooks/weeklyShiftTemplate/useWeeklyShiftTemplate';
import { useWeeklyShiftTemplateDetail } from '@/hooks/weeklyShiftTemplate/useWeeklyShiftTemplateDetail';
import { useCreateWeeklyShiftTemplate } from '@/hooks/weeklyShiftTemplate/useCreateWeeklyShiftTemplate';
import { useUpdateWeeklyShiftTemplate } from '@/hooks/weeklyShiftTemplate/useUpdateWeeklyShiftTemplate';
import { useDeleteWeeklyShiftTemplate } from '@/hooks/weeklyShiftTemplate/useDeleteWeeklyShiftTemplate';

import { useCounters } from '@/hooks/counter/useCounters';
import { useUser } from '@/hooks/user/useUser';
import { useShiftTemplate } from '@/hooks/shiftTemplate/useShiftTemplate';

import type { WeeklyShiftTemplateEntity } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.entity';
import type { CreateWeeklyShiftTemplateDTO } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.types';
import { Hari } from '@/types/enums';
import { TVOnlyGuard } from '@/components/layout/TVOnlyGuard';

/* ================= DEFAULT ================= */

const emptyForm: CreateWeeklyShiftTemplateDTO = {
	hari: Hari.SENIN,
	counter_id: 0,
	admin_id: 0,
	shift_id: 0,
};

export default function WeeklyShiftTemplatePage() {
	const { data: session } = useSession();
	const role = session?.user?.role;

	const { list, loading, refresh } = useWeeklyShiftTemplate();
	const { submit: createData, loading: creating } = useCreateWeeklyShiftTemplate(refresh);
	const { submit: updateData, loading: updating } = useUpdateWeeklyShiftTemplate(refresh);
	const { remove: deleteData, loading: deleting } = useDeleteWeeklyShiftTemplate(refresh);

	const { list: counters } = useCounters();
	const { list: admins } = useUser();
	const { list: shifts } = useShiftTemplate();

	const { data: detail, open: openDetail, close: closeDetail } = useWeeklyShiftTemplateDetail();

	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selected, setSelected] = useState<WeeklyShiftTemplateEntity | null>(null);

	const [form, setForm] = useState<CreateWeeklyShiftTemplateDTO>(emptyForm);

	/* ================= TABLE ================= */

	const columns = useMemo<ColumnDef<WeeklyShiftTemplateEntity>[]>(
		() => [
			{ accessorKey: 'hari', header: 'Hari' },
			{ accessorKey: 'counter.nama_loket', header: 'Loket' },
			{ accessorKey: 'admin.nama', header: 'Admin' },
			{ accessorKey: 'shift.nama_shift', header: 'Shift' },
			{
				header: 'Aksi',
				cell: ({ row }) => (
					<div className='flex items-center justify-center gap-2'>
						<button
							onClick={() => openDetail(row.original.id)}
							className='rounded-md p-2 text-blue-600 transition hover:bg-slate-100'
							title='Detail'
						>
							<FiEye size={18} />
						</button>

						{role === 'superadmin' && (
							<>
								<button
									onClick={() => {
										setSelected(row.original);
										setForm({
											hari: row.original.hari,
											counter_id: row.original.counter_id,
											admin_id: row.original.admin_id,
											shift_id: row.original.shift_id,
										});
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
										const confirmed = await confirmDelete({
											text: `Template hari "${row.original.hari}" akan dihapus.`,
										});
										if (!confirmed) return;
										await deleteData(row.original.id);
									}}
									className='rounded-md p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50'
									title='Hapus'
								>
									<FiTrash2 size={18} />
								</button>
							</>
						)}
					</div>
				),
			},
		],
		[role, deleting, openDetail, deleteData],
	);

	/* =========================
	LOADING SHIFT HARIAN
	========================== */
	if (loading) {
		return (
			<div className='flex items-center justify-center p-10'>
				<div className='flex flex-col items-center gap-3'>
					<div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600' />
					<p className='text-sm text-gray-500'>Memuat data shift harian...</p>
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
							<h1 className='text-3xl font-bold tracking-tight text-slate-800'>
								Manajemen Template Shift
							</h1>
							<p className='text-sm text-slate-500'>Kelola template jadwal shift mingguan</p>
						</div>

						{role === 'superadmin' && (
							<button
								onClick={() => {
									setForm(emptyForm);
									setOpenCreate(true);
								}}
								className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]'
							>
								<FiPlus />
								Tambah Template
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
							emptyText='Belum ada template'
						/>
					</div>

					{/* CREATE */}
					<Modal
						isOpen={openCreate}
						onClose={() => setOpenCreate(false)}
					>
						<Modal.Header title='Tambah Template Shift' />
						<Modal.Body>
							<FormWeeklyShift
								form={form}
								setForm={setForm}
								counters={counters}
								admins={admins}
								shifts={shifts}
							/>
						</Modal.Body>
						<Modal.Footer
							submitText={creating ? 'Menyimpan...' : 'Simpan'}
							onSubmit={() => createData(form).then(() => setOpenCreate(false))}
						/>
					</Modal>

					{/* EDIT */}
					<Modal
						isOpen={openEdit}
						onClose={() => setOpenEdit(false)}
					>
						<Modal.Header title='Edit Template Shift' />
						<Modal.Body>
							<FormWeeklyShift
								form={form}
								setForm={setForm}
								counters={counters}
								admins={admins}
								shifts={shifts}
							/>
						</Modal.Body>
						<Modal.Footer
							submitText={updating ? 'Memperbarui...' : 'Perbarui'}
							onSubmit={async () => {
								if (!selected) return;

								const confirmed = await confirmEdit({
									title: 'Simpan Perubahan?',
									text: 'Perubahan template akan disimpan.',
								});

								if (!confirmed) return;

								await updateData(selected.id, form);
								setOpenEdit(false);
							}}
						/>
					</Modal>

					{/* DETAIL */}
					<Modal
						isOpen={!!detail}
						onClose={closeDetail}
						size='sm'
					>
						<Modal.Header title='Detail Template Shift' />
						<Modal.Body>
							{detail && (
								<div className='space-y-3 text-sm text-slate-700'>
									<p>
										<b>Hari :</b> {detail.hari}
									</p>
									<p>
										<b>Loket :</b> {detail.counter.nama_loket}
									</p>
									<p>
										<b>Admin :</b> {detail.admin.nama}
									</p>
									<p>
										<b>Shift :</b> {detail.shift.nama_shift}
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

interface FormWeeklyShiftProps {
	form: CreateWeeklyShiftTemplateDTO;
	setForm: (
		form:
			| CreateWeeklyShiftTemplateDTO
			| ((prev: CreateWeeklyShiftTemplateDTO) => CreateWeeklyShiftTemplateDTO),
	) => void;
	counters: { id: number; nama_loket: string }[];
	admins: { id: number; nama: string }[];
	shifts: { id: number; nama_shift: string }[];
}

function FormWeeklyShift({ form, setForm, counters, admins, shifts }: FormWeeklyShiftProps) {
	const base =
		'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

	return (
		<div className='space-y-4'>
			<select
				className={base}
				value={form.hari}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					setForm((f) => ({ ...f, hari: e.target.value as (typeof Hari)[keyof typeof Hari] }))
				}
			>
				{Object.values(Hari).map((h) => (
					<option
						key={h}
						value={h}
					>
						{h}
					</option>
				))}
			</select>

			<select
				className={base}
				value={form.counter_id}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					setForm((f) => ({ ...f, counter_id: +e.target.value }))
				}
			>
				<option value={0}>Pilih Loket</option>
				{counters.map((c) => (
					<option
						key={c.id}
						value={c.id}
					>
						{c.nama_loket}
					</option>
				))}
			</select>

			<select
				className={base}
				value={form.admin_id}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					setForm((f) => ({ ...f, admin_id: +e.target.value }))
				}
			>
				<option value={0}>Pilih Admin</option>
				{admins.map((a) => (
					<option
						key={a.id}
						value={a.id}
					>
						{a.nama}
					</option>
				))}
			</select>

			<select
				className={base}
				value={form.shift_id}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					setForm((f) => ({ ...f, shift_id: +e.target.value }))
				}
			>
				<option value={0}>Pilih Shift</option>
				{shifts.map((s) => (
					<option
						key={s.id}
						value={s.id}
					>
						{s.nama_shift}
					</option>
				))}
			</select>
		</div>
	);
}
