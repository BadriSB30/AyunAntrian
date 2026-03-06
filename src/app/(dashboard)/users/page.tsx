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

const PROTECTED_EMAIL = 'adminayun30@gmail.com';

export default function UserPage() {
	const { data: session } = useSession();
	const role = session?.user?.role;
	const sessionEmail = session?.user?.email;

	const { list, loading, refresh } = useUser();
	const { submit: createUser, loading: creating } = useCreateUser(refresh);
	const { submit: updateUser, loading: updating } = useUpdateUser(refresh);
	const { remove: deleteUser, loading: deleting } = useDeleteUser(refresh);

	const { data: detail, open: openDetail, close: closeDetail } = useUserDetail();
	const { toggleStatus } = useUpdateUserStatus(refresh);

	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selected, setSelected] = useState<UserResponse | null>(null);

	const [form, setForm] = useState<CreateUserDTO>({
		nama: '',
		username: '',
		email: '',
		password: '',
		role: Role.ADMIN,
	});

	const columns = useMemo<ColumnDef<UserResponse>[]>(
		() => [
			{ accessorKey: 'nama', header: 'Nama' },
			{ accessorKey: 'email', header: 'Email' },
			{ accessorKey: 'role', header: 'Role' },

			{
				header: 'Status',
				cell: ({ row }) => {
					const isActive = row.original.status === UserStatus.AKTIF;

					const isProtected =
						row.original.email === PROTECTED_EMAIL || row.original.email === sessionEmail;

					return (
						<div className='flex items-center justify-center gap-3'>
							<StatusToggle
								checked={isActive}
								disabled={role !== Role.SUPERADMIN || isProtected}
								onChange={(value) =>
									toggleStatus(row.original.id, value ? UserStatus.AKTIF : UserStatus.NONAKTIF)
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
				cell: ({ row }) => {
					const isProtected =
						row.original.email === PROTECTED_EMAIL || row.original.email === sessionEmail;

					return (
						<div className='flex items-center justify-center gap-2'>
							<button
								onClick={() => openDetail(row.original.id)}
								className='rounded-lg p-2 text-blue-600 hover:bg-blue-100 transition'
							>
								<FiEye size={18} />
							</button>

							{role === Role.SUPERADMIN && (
								<button
									disabled={isProtected}
									onClick={() => {
										if (isProtected) return;

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
									className='rounded-lg p-2 text-green-600 hover:bg-green-100 transition disabled:opacity-40 disabled:cursor-not-allowed'
								>
									<FiEdit2 size={18} />
								</button>
							)}

							{role === Role.SUPERADMIN && (
								<button
									disabled={deleting || isProtected}
									onClick={async () => {
										if (isProtected) {
											showError('User utama sistem tidak dapat dihapus.', 'Aksi Ditolak');
											return;
										}

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
									className='rounded-lg p-2 text-red-600 hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed'
								>
									<FiTrash2 size={18} />
								</button>
							)}
						</div>
					);
				},
			},
		],
		[role, toggleStatus, openDetail, deleteUser, deleting, sessionEmail],
	);

	if (loading) {
		return (
			<div className='flex items-center justify-center p-10'>
				<div className='flex flex-col items-center gap-3'>
					<div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600' />
					<p className='text-sm text-gray-500'>Memuat data user...</p>
				</div>
			</div>
		);
	}

	return (
		<TVOnlyGuard>
			<div className='min-h-screen bg-slate-50 p-8 space-y-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-2xl font-bold text-slate-800'>Manajemen User</h1>
						<p className='text-sm text-slate-500'>Kelola akun pengguna sistem secara profesional</p>
					</div>

					{role === Role.SUPERADMIN && (
						<button
							onClick={() => {
								setForm({
									nama: '',
									username: '',
									email: '',
									password: '',
									role: Role.ADMIN,
								});
								setOpenCreate(true);
							}}
							className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 transition'
						>
							<FiPlus /> Tambah User
						</button>
					)}
				</div>

				<div className='rounded-xl bg-white shadow-sm border border-slate-200 p-6'>
					<DataTable
						data={list}
						columns={columns}
						searchable
						pageSize={10}
						emptyText='Belum ada data user'
					/>
				</div>

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
							<div className='space-y-3 text-sm text-slate-700'>
								<div className='flex justify-between'>
									<span className='font-medium'>Nama</span>
									<span>{detail.nama}</span>
								</div>

								<div className='flex justify-between'>
									<span className='font-medium'>Username</span>
									<span>{detail.username}</span>
								</div>

								<div className='flex justify-between'>
									<span className='font-medium'>Email</span>
									<span>{detail.email}</span>
								</div>

								<div className='flex justify-between'>
									<span className='font-medium'>Role</span>
									<span>{detail.role}</span>
								</div>

								<div className='flex justify-between'>
									<span className='font-medium'>Status</span>
									<span>{detail.status}</span>
								</div>
							</div>
						)}
					</Modal.Body>
				</Modal>
			</div>
		</TVOnlyGuard>
	);
}

/* ================= FORM ================= */

function FormUser({
	form,
	setForm,
	isEdit = false,
}: {
	form: CreateUserDTO;
	setForm: React.Dispatch<React.SetStateAction<CreateUserDTO>>;
	isEdit?: boolean;
}) {
	const base =
		'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition';

	return (
		<div className='space-y-4'>
			<input
				className={base}
				placeholder='Nama'
				value={form.nama}
				onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
			/>

			<input
				className={base}
				placeholder='Username'
				value={form.username}
				onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
			/>

			<input
				className={base}
				placeholder='Email'
				value={form.email}
				onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
			/>

			<input
				type='password'
				className={base}
				placeholder={isEdit ? 'Password (opsional)' : 'Password'}
				value={form.password}
				onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
			/>

			<select
				className={base}
				value={form.role}
				onChange={(e) =>
					setForm((f) => ({
						...f,
						role: e.target.value as Role,
					}))
				}
			>
				<option value={Role.ADMIN}>Admin</option>
				<option value={Role.SUPERADMIN}>Superadmin</option>
			</select>
		</div>
	);
}

/* ================= TOGGLE ================= */

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
				${checked ? 'bg-blue-600' : 'bg-slate-300'}
				${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
		>
			<span
				className={`inline-block h-4 w-4 transform rounded-full bg-white transition
					${checked ? 'translate-x-6' : 'translate-x-1'}`}
			/>
		</button>
	);
}
