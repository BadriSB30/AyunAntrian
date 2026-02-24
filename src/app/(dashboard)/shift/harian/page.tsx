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

/* =========================
   DEFAULT FORM
========================= */
const emptyForm: CreateWeeklyShiftTemplateDTO = {
	hari: Hari.SENIN,
	counter_id: 0,
	admin_id: 0,
	shift_id: 0,
};

export default function WeeklyShiftTemplatePage() {
	const { data: session } = useSession();
	const role = session?.user?.role;

	/* =========================
	   MASTER DATA
	========================= */
	const { list: counters } = useCounters();
	const { list: admins } = useUser();
	const { list: shifts } = useShiftTemplate();

	/* =========================
	   CRUD
	========================= */
	const { list, loading, refresh } = useWeeklyShiftTemplate();
	const { submit: createData, loading: creating } = useCreateWeeklyShiftTemplate(refresh);
	const { submit: updateData, loading: updating } = useUpdateWeeklyShiftTemplate(refresh);
	const { remove: deleteData, loading: deleting } = useDeleteWeeklyShiftTemplate(refresh);

	const { data: detail, open: openDetail, close: closeDetail } = useWeeklyShiftTemplateDetail();

	/* =========================
	   MODAL STATE
	========================= */
	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selected, setSelected] = useState<WeeklyShiftTemplateEntity | null>(null);

	/* =========================
	   FORM STATE
	========================= */
	const [form, setForm] = useState<CreateWeeklyShiftTemplateDTO>(emptyForm);

	/* =========================
	   TABLE COLUMNS
	========================= */
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
									setForm({
										hari: row.original.hari,
										counter_id: row.original.counter_id,
										admin_id: row.original.admin_id,
										shift_id: row.original.shift_id,
									});
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
										text: `Template hari ${row.original.hari} akan dihapus.`,
									});
									if (!confirmed) return;
									await deleteData(row.original.id);
								}}
								className='rounded-lg p-2 text-red-600 hover:bg-red-50 transition disabled:opacity-50'
								title='Hapus'
							>
								<FiTrash2 size={18} />
							</button>
						)}
					</div>
				),
			},
		],
		[role, deleting, openDetail, deleteData],
	);

	if (loading) {
		return <p className='p-6'>Memuat data template shift...</p>;
	}

	return (
		<TVOnlyGuard>
			<div className='space-y-6 p-8'>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold'>Manajemen Template Shift Harian</h1>

					{role === 'superadmin' && (
						<button
							onClick={() => {
								setForm(emptyForm);
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
					emptyText='Belum ada template'
				/>

				{/* =========================
			   MODAL CREATE
			========================= */}
				<Modal
					isOpen={openCreate}
					onClose={() => setOpenCreate(false)}
				>
					<Modal.Header title='Tambah Weekly Shift Template' />
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

				{/* =========================
			   MODAL EDIT
			========================= */}
				<Modal
					isOpen={openEdit}
					onClose={() => setOpenEdit(false)}
				>
					<Modal.Header title='Edit Weekly Shift Template' />
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
		</TVOnlyGuard>
	);
}

/* =========================
   FORM
========================= */

interface FormWeeklyShiftProps {
	form: CreateWeeklyShiftTemplateDTO;
	setForm: React.Dispatch<React.SetStateAction<CreateWeeklyShiftTemplateDTO>>;
	counters: { id: number; nama_loket: string }[];
	admins: { id: number; nama: string }[];
	shifts: { id: number; nama_shift: string }[];
}

function FormWeeklyShift({ form, setForm, counters, admins, shifts }: FormWeeklyShiftProps) {
	return (
		<div className='space-y-4'>
			<select
				className='w-full rounded border px-3 py-2'
				value={form.hari}
				onChange={(e) => setForm((f) => ({ ...f, hari: e.target.value as Hari }))}
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
				className='w-full rounded border px-3 py-2'
				value={form.counter_id}
				onChange={(e) => setForm((f) => ({ ...f, counter_id: +e.target.value }))}
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
				className='w-full rounded border px-3 py-2'
				value={form.admin_id}
				onChange={(e) => setForm((f) => ({ ...f, admin_id: +e.target.value }))}
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
				className='w-full rounded border px-3 py-2'
				value={form.shift_id}
				onChange={(e) => setForm((f) => ({ ...f, shift_id: +e.target.value }))}
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
