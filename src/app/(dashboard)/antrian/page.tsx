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
// Tambahkan di bagian atas file, setelah import
import { QUEUE_BROADCAST_CHANNEL } from '@/hooks/queue/useQueueStatus';

import type { QueueEntity } from '@/modules/queue/queue.entity';
import type { UpdateQueueDTO } from '@/modules/queue/queue.types';

import { QueueStatus } from '@/types/enums';
import { formatDate } from '@/utils/date';
import { speakQueue } from '@/modules/queue/queue.speak';
import { TVOnlyGuard } from '@/components/layout/TVOnlyGuard';

/* ================= STATUS BADGE ================= */

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

// Fungsi helper untuk broadcast ke tab TV
function broadcastQueueUpdate() {
	try {
		const bc = new BroadcastChannel(QUEUE_BROADCAST_CHANNEL);
		bc.postMessage({ type: 'QUEUE_UPDATED' });
		bc.close();
	} catch {
		// diabaikan jika tidak tersedia
	}
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
										await updateQueue(q.id, { status: QueueStatus.DIPANGGIL });
										broadcastQueueUpdate(); // ✅ Kirim sinyal ke tab TV
									} else {
										broadcastQueueUpdate(); // ✅ Tetap broadcast meski status sudah DIPANGGIL
									}
								}}
								className='rounded-md p-2 text-slate-600 transition hover:bg-slate-100'
							>
								<FiVolume2 size={18} />
							</button>

							{/* DETAIL */}
							<button
								onClick={() => openDetail(q.id)}
								className='rounded-md p-2 text-blue-600 transition hover:bg-blue-100'
							>
								<FiEye size={18} />
							</button>

							{/* EDIT */}
							<button
								onClick={() => {
									setSelected(q);
									setForm({
										status: q.status,
									});
									setOpenEdit(true);
								}}
								className='rounded-md p-2 text-green-600 transition hover:bg-green-100'
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
								className='rounded-md p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50'
							>
								<FiTrash2 size={18} />
							</button>
						</div>
					);
				},
			},
		];
	}, [deleteQueue, deleting, openDetail, updateQueue]);

	/* =========================
	LOADING ANTRIAN
	========================== */
	if (loading) {
		return (
			<div className='flex items-center justify-center p-10'>
				<div className='flex flex-col items-center gap-3'>
					<div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600' />
					<p className='text-sm text-gray-500'>Memuat data antrian...</p>
				</div>
			</div>
		);
	}

	/* ================= RENDER ================= */

	return (
		<TVOnlyGuard>
			<div className='min-h-screen bg-slate-50 p-6 md:p-10'>
				<div className='mx-auto max-w-7xl space-y-8'>
					{/* HEADER */}
					<div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
						<div>
							<h1 className='text-3xl font-bold tracking-tight text-slate-800'>
								Manajemen Antrian
							</h1>
							<p className='text-sm text-slate-500'>Kelola dan pantau antrian secara realtime</p>
						</div>

						<div className='flex items-center gap-3'>
							<Link
								href='/ambil-antrian'
								className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]'
							>
								Ambil Antrian
							</Link>

							<Link
								href='/status-antrian'
								className='inline-flex items-center gap-2 rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 active:scale-[0.98]'
							>
								Status Antrian
							</Link>
						</div>
					</div>

					{/* TABLE CARD */}
					<div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
						<DataTable
							data={list}
							columns={columns}
							searchable
							pageSize={10}
							emptyText='Belum ada data antrian'
						/>
					</div>

					{/* MODAL EDIT */}
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

								await updateQueue(selected.id, {
									status: form.status,
								});
								setOpenEdit(false);
							}}
						/>
					</Modal>

					{/* MODAL DETAIL */}
					<Modal
						isOpen={!!detail}
						onClose={closeDetail}
						size='sm'
					>
						<Modal.Header title='Detail Antrian' />
						<Modal.Body>
							{detail && (
								<div className='space-y-3 text-sm text-slate-700'>
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
			className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
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
