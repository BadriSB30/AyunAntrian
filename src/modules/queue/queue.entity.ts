// src/modules/queue/queue.entity.ts

import { QueueStatus } from '@/types/enums';

export interface QueueEntity {
	id: number;
	tanggal: Date;
	nomor_antrian: number;
	counter_id: number;
	admin_id: number;
	shift_id: number;
	status: QueueStatus;

	waktu_ambil: Date;
	waktu_panggil: Date | null;
	waktu_selesai: Date | null;

	nama_loket?: string;
	nama_admin?: string;
	nama_shift?: string;
}
