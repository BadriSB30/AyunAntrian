'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { FiEye, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { confirmDelete, confirmEdit, showError } from '@/lib/swal';

import { useUser } from '@/hooks/user/useUser';
import { useCreateUser } from '@/hooks/user/useCreateUser';
import { useUpdateUser } from '@/hooks/user/useUpdateUser';
import { useDeleteUser } from '@/hooks/user/useDeleteUser';
import { useUserDetail } from '@/hooks/user/useUserDetail';
import { useUpdateUserStatus } from '@/hooks/user/useUpdateUserStatus';

import type { UserResponse } from '@/modules/user/user.types';
import type { CreateUserDTO, UpdateUserDTO } from '@/modules/user/user.types';
import { Role, UserStatus } from '@/types/enums';
import { TVOnlyGuard } from '@/components/layout/TVOnlyGuard';

export default function UserPage() {
	const { data: session } = useSession();
	const role = session?.user?.role;

	const { list, loading, refresh } = useUser();
	const { submit: createUser, loading: creating } = useCreateUser(refresh);
	const { submit: updateUser, loading: updating } = useUpdateUser(refresh);
	const { remove: deleteUser, loading: deleting } = useDeleteUser(refresh);

	const { data: detail, open: openDetail, close: closeDetail } = useUserDetail();
	const { toggleStatus } = useUpdateUserStatus(refresh);

	/* =========================
	   MODAL STATE
	========================= */
	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selected, setSelected] = useState<UserResponse | null>(null);

	/* =========================
	   FORM STATE
	========================= */
	const [form, setForm] = useState<CreateUserDTO>({
		nama: '',
		username: '',
		email: '',
		password: '',
		role: Role.ADMIN,
	});

	/* =========================
	   TABLE COLUMNS
	========================= */
	const columns = useMemo<ColumnDef<UserResponse>[]>(
		() => [
			{ accessorKey: 'nama', header: 'Nama' },
			{ accessorKey: 'email', header: 'Email' },
			{ accessorKey: 'role', header: 'Role' },
			{
				header: 'Status',
				cell: ({ row }) => {
					const isActive = row.original.status === UserStatus.AKTIF;

					return (
						<div className='flex items-center justify-center gap-3'>
							<StatusToggle
								checked={isActive}
								disabled={role !== Role.SUPERADMIN}
								onChange={(value) =>
									toggleStatus(row.original.id, value ? UserStatus.AKTIF : UserStatus.NONAKTIF)
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
						>
							<FiEye size={18} />
						</button>

						{/* EDIT */}
						{role === Role.SUPERADMIN && (
							<button
								onClick={() => {
									setSelected(row.original);
									setForm({
										nama: row.original.nama,
										username: row.original.username,
										email: row.original.email,
										password: '',
										role: row.original.role,
									});
									setOpenEdit(true);
								}}
								className='rounded p-2 text-emerald-600 hover:bg-emerald-50'
							>
								<FiEdit2 size={18} />
							</button>
						)}

						{/* DELETE */}
						{role === Role.SUPERADMIN && (
							<button
								disabled={deleting}
								onClick={async () => {
									if (row.original.status === UserStatus.AKTIF) {
										showError(
											'Nonaktifkan user terlebih dahulu sebelum menghapus.',
											'Tidak Bisa Dihapus',
										);
										return;
									}

									const confirmed = await confirmDelete({
										text: `User "${row.original.nama}" akan dihapus permanen.`,
									});

									if (!confirmed) return;
									await deleteUser(row.original.id);
								}}
								className='rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-50'
							>
								<FiTrash2 size={18} />
							</button>
						)}
					</div>
				),
			},
		],
		[role, toggleStatus, openDetail, deleteUser, deleting],
	);

	if (loading) return <p className='p-6'>Memuat data user...</p>;

	return (
		<TVOnlyGuard>
			<div className='space-y-6 p-8'>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold'>Manajemen User</h1>

					{role === Role.SUPERADMIN && (
						<button
							onClick={() => {
								setForm({ nama: '', username: '', email: '', password: '', role: Role.ADMIN });
								setOpenCreate(true);
							}}
							className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700'
						>
							<FiPlus /> Tambah User
						</button>
					)}
				</div>

				<DataTable
					data={list}
					columns={columns}
					searchable
					pageSize={10}
					emptyText='Belum ada data user'
				/>

				{/* CREATE */}
				<Modal
					isOpen={openCreate}
					onClose={() => setOpenCreate(false)}
				>
					<Modal.Header title='Tambah User' />
					<Modal.Body>
						<FormUser
							form={form}
							setForm={setForm}
						/>
					</Modal.Body>
					<Modal.Footer
						submitText={creating ? 'Menyimpan...' : 'Simpan'}
						onSubmit={() => createUser(form).then(() => setOpenCreate(false))}
					/>
				</Modal>

				{/* EDIT */}
				<Modal
					isOpen={openEdit}
					onClose={() => setOpenEdit(false)}
				>
					<Modal.Header title='Edit User' />
					<Modal.Body>
						<FormUser
							form={form}
							setForm={setForm}
							isEdit
						/>
					</Modal.Body>
					<Modal.Footer
						submitText={updating ? 'Memperbarui...' : 'Perbarui'}
						onSubmit={async () => {
							if (!selected) return;
							const confirmed = await confirmEdit();
							if (!confirmed) return;
							await updateUser(selected.id, form as UpdateUserDTO);
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
					<Modal.Header title='Detail User' />
					<Modal.Body>
						{detail && (
							<div className='space-y-2 text-sm'>
								<p>
									<b>Nama:</b> {detail.nama}
								</p>
								<p>
									<b>Username:</b> {detail.username}
								</p>
								<p>
									<b>Email:</b> {detail.email}
								</p>
								<p>
									<b>Role:</b> {detail.role}
								</p>
								<p>
									<b>Status:</b> {detail.status}
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
function FormUser({
	form,
	setForm,
	isEdit = false,
}: {
	form: CreateUserDTO;
	setForm: React.Dispatch<React.SetStateAction<CreateUserDTO>>;
	isEdit?: boolean;
}) {
	return (
		<div className='space-y-4'>
			<input
				className='w-full rounded border px-3 py-2'
				placeholder='Nama'
				value={form.nama}
				onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
			/>
			<input
				className='w-full rounded border px-3 py-2'
				placeholder='Username'
				value={form.username}
				onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
			/>

			<input
				className='w-full rounded border px-3 py-2'
				placeholder='Email'
				value={form.email}
				onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
			/>

			<input
				type='password'
				className='w-full rounded border px-3 py-2'
				placeholder={isEdit ? 'Password (opsional)' : 'Password'}
				value={form.password}
				onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
			/>
		</div>
	);
}

/* =========================
   TOGGLE
========================= */
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
