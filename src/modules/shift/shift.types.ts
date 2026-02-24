// modules/shift/shift.types.ts

// =========================
// CREATE
// =========================
export interface CreateShiftDTO {
	nama_shift: string;
	jam_mulai: string; // format: HH:mm:ss
	jam_selesai: string; // format: HH:mm:ss
}

// =========================
// UPDATE
// =========================
export interface UpdateShiftDTO {
	nama_shift?: string;
	jam_mulai?: string;
	jam_selesai?: string;
}

// =========================
// RESPONSE (SAFE)
// =========================
export interface ShiftResponse {
	id: number;
	nama_shift: string;
	jam_mulai: string;
	jam_selesai: string;
}

// =========================
// LIST RESPONSE
// =========================
export type ShiftListResponse = ShiftResponse[];
