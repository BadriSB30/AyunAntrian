//src/modules/queue/queue.types.ts

import { QueueStatus } from '@/types/enums';

export interface CreateQueueDTO {
	counter_id: number;
	admin_id: number;
	shift_id: number;
}

export interface UpdateQueueDTO {
	status?: QueueStatus;
}

export interface QueueResponse {
	id: number;
	tanggal: Date;
	nomor_antrian: string; // ← string, bukan number
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

export type QueueListResponse = QueueResponse[];
