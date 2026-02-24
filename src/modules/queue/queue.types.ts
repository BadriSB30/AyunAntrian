// modules/queue/queue.types.ts
import { QueueStatus } from '@/types/enums';

// =========================
// CREATE
// =========================
// modules/queue/queue.types.ts
export interface CreateQueueDTO {
	counter_id: number;
	admin_id: number;
	shift_id: number;
}

// =========================
// UPDATE (SAFE)
// =========================
export interface UpdateQueueDTO {
	status?: QueueStatus;
}

// =========================
// RESPONSE (API SAFE)
// =========================
export interface QueueResponse {
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

// =========================
// LIST RESPONSE
// =========================
export type QueueListResponse = QueueResponse[];
