'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

import { FiEye, FiEdit2, FiTrash2, FiVolume2 } from 'react-icons/fi';

import { confirmDelete, confirmEdit } from '@/lib/swal';

import { useQueueByRole } from '@/hooks/queue/useQueueByRole';
import { useUpdateQueue } from '@/hooks/queue/useUpdateQueue';
import { useDeleteQueue } from '@/hooks/queue/useDeleteQueue';
import { useQueueDetail } from '@/hooks/queue/useQueueDetail';

import type { QueueEntity } from '@/modules/queue/queue.entity';
import type { UpdateQueueDTO } from '@/modules/queue/queue.types';

import { QueueStatus } from '@/types/enums';
import { formatDate } from '@/utils/date';
import { speakQueue } from '@/modules/queue/queue.speak';
import { TVOnlyGuard } from '@/components/layout/TVOnlyGuard';
/* ================= STATUS → BADGE VARIANT ================= */

const statusVariantMap: Record<QueueStatus, 'warning' | 'primary' | 'success' | 'danger'> = {
	[QueueStatus.MENUNGGU]: 'warning',
	[QueueStatus.DIPANGGIL]: 'primary',
	[QueueStatus.SELESAI]: 'success',
	[QueueStatus.BATAL]: 'danger',
};

function QueueStatusBadge({ status }: { status: QueueStatus }) {
	return (
		<Badge
			variant={statusVariantMap[status]}
			size='sm'
			className='capitalize'
		>
			{status.toLowerCase()}
		</Badge>
	);
}

/* ================= PAGE ================= */

export default function QueuePage() {
	/* ===== SESSION ===== */
	const { data: session } = useSession();
	const role = session?.user?.role;

	/* ===== DATA ===== */
	const { list, loading, refresh } = useQueueByRole(role);
	const { submit: updateQueue, loading: updating } = useUpdateQueue(refresh);
	const { remove: deleteQueue, loading: deleting } = useDeleteQueue(refresh);
	const { data: detail, open: openDetail, close: closeDetail } = useQueueDetail();

	/* ===== STATE ===== */
	const [openEdit, setOpenEdit] = useState(false);
	const [selected, setSelected] = useState<QueueEntity | null>(null);

	const [form, setForm] = useState<UpdateQueueDTO>({
		status: QueueStatus.MENUNGGU,
	});

	/* ================= TABLE COLUMNS ================= */

	const columns = useMemo<ColumnDef<QueueEntity>[]>(() => {
		return [
			{
				header: 'Tanggal',
				cell: ({ row }) => formatDate(row.original.tanggal, false),
			},
			{ accessorKey: 'nomor_antrian', header: 'Nomor' },
			{ accessorKey: 'nama_loket', header: 'Loket' },
			{ accessorKey: 'nama_admin', header: 'Admin' },
			{ accessorKey: 'nama_shift', header: 'Shift' },
			{
				header: 'Status',
				cell: ({ row }) => <QueueStatusBadge status={row.original.status} />,
			},
			{
				header: 'Waktu Ambil',
				cell: ({ row }) => formatDate(row.original.waktu_ambil),
			},
			{
				header: 'Waktu Panggil',
				cell: ({ row }) => formatDate(row.original.waktu_panggil),
			},
			{
				header: 'Waktu Selesai',
				cell: ({ row }) => formatDate(row.original.waktu_selesai),
			},
			{
				header: 'Aksi',
				cell: ({ row }) => {
					const q = row.original;

					return (
						<div className='flex items-center justify-center gap-2'>
							{/* PANGGIL */}
							<button
								onClick={async () => {
									if (!q.nama_loket) return;

									speakQueue(q.nomor_antrian, q.nama_loket);

									if (q.status !== QueueStatus.DIPANGGIL) {
										await updateQueue(q.id, {
											status: QueueStatus.DIPANGGIL,
										});
									}
								}}
								className='rounded p-2 text-indigo-600 hover:bg-indigo-50'
							>
								<FiVolume2 size={18} />
							</button>

							{/* DETAIL */}
							<button
								onClick={() => openDetail(q.id)}
								className='rounded p-2 text-blue-600 hover:bg-blue-50'
							>
								<FiEye size={18} />
							</button>

							{/* EDIT */}
							<button
								onClick={() => {
									setSelected(q);
									setForm({ status: q.status });
									setOpenEdit(true);
								}}
								className='rounded p-2 text-emerald-600 hover:bg-emerald-50'
							>
								<FiEdit2 size={18} />
							</button>

							{/* DELETE */}
							<button
								disabled={deleting}
								onClick={async () => {
									const ok = await confirmDelete({
										text: `Antrian "${q.nomor_antrian}" akan dihapus permanen.`,
									});
									if (ok) await deleteQueue(q.id);
								}}
								className='rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-50'
							>
								<FiTrash2 size={18} />
							</button>
						</div>
					);
				},
			},
		];
	}, [deleteQueue, deleting, openDetail, updateQueue]);

	/* ================= LOADING ================= */

	if (loading) {
		return <p className='p-8 text-center'>Memuat data antrian...</p>;
	}

	/* ================= RENDER ================= */

	return (
		<TVOnlyGuard>
			<div className='space-y-6 p-8'>
				<div className='flex flex-wrap items-center justify-between gap-4'>
					<h1 className='text-2xl font-bold'>Manajemen Antrian</h1>

					<div className='flex items-center gap-3'>
						<Link
							href='/ambil-antrian'
							className='inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]'
						>
							Ambil Antrian
						</Link>

						<Link
							href='/status-antrian'
							className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 hover:shadow-md active:scale-[0.98]'
						>
							Status Antrian
						</Link>
					</div>
				</div>

				<DataTable
					data={list}
					columns={columns}
					searchable
					pageSize={10}
					emptyText='Belum ada data antrian'
				/>

				{/* ================= MODAL EDIT ================= */}
				<Modal
					isOpen={openEdit}
					onClose={() => setOpenEdit(false)}
				>
					<Modal.Header title='Edit Status Antrian' />
					<Modal.Body>
						<FormQueue
							form={form}
							setForm={setForm}
						/>
					</Modal.Body>
					<Modal.Footer
						submitText={updating ? 'Menyimpan...' : 'Simpan'}
						onSubmit={async () => {
							if (!selected || updating) return;

							const ok = await confirmEdit({
								title: 'Simpan perubahan?',
								text: `Status antrian "${selected.nomor_antrian}" akan diperbarui.`,
							});
							if (!ok) return;

							await updateQueue(selected.id, { status: form.status });
							setOpenEdit(false);
						}}
					/>
				</Modal>

				{/* ================= MODAL DETAIL ================= */}
				<Modal
					isOpen={!!detail}
					onClose={closeDetail}
					size='sm'
				>
					<Modal.Header title='Detail Antrian' />
					<Modal.Body>
						{detail && (
							<div className='space-y-2 text-sm'>
								<p>
									<b>Tanggal:</b> {formatDate(detail.tanggal, false)}
								</p>
								<p>
									<b>Nomor:</b> {detail.nomor_antrian}
								</p>
								<p>
									<b>Loket:</b> {detail.nama_loket}
								</p>
								<p>
									<b>Admin:</b> {detail.nama_admin}
								</p>
								<p>
									<b>Shift:</b> {detail.nama_shift}
								</p>

								<p className='flex items-center gap-2'>
									<b>Status:</b>
									<QueueStatusBadge status={detail.status} />
								</p>

								<p>
									<b>Waktu Ambil:</b> {formatDate(detail.waktu_ambil)}
								</p>
								<p>
									<b>Waktu Panggil:</b> {formatDate(detail.waktu_panggil)}
								</p>
								<p>
									<b>Waktu Selesai:</b> {formatDate(detail.waktu_selesai)}
								</p>
							</div>
						)}
					</Modal.Body>
				</Modal>
			</div>
		</TVOnlyGuard>
	);
}

/* ================= FORM ================= */

function FormQueue({
	form,
	setForm,
}: {
	form: UpdateQueueDTO;
	setForm: React.Dispatch<React.SetStateAction<UpdateQueueDTO>>;
}) {
	return (
		<select
			className='w-full rounded border px-3 py-2'
			value={form.status}
			onChange={(e) =>
				setForm((prev) => ({
					...prev,
					status: e.target.value as QueueStatus,
				}))
			}
		>
			<option value={QueueStatus.MENUNGGU}>Menunggu</option>
			<option value={QueueStatus.DIPANGGIL}>Dipanggil</option>
			<option value={QueueStatus.SELESAI}>Selesai</option>
			<option value={QueueStatus.BATAL}>Batal</option>
		</select>
	);
}
