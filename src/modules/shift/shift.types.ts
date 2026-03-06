export interface CreateShiftDTO {
	nama_shift: string;
	jam_mulai: string;
	jam_selesai: string;
}

export interface UpdateShiftDTO {
	nama_shift?: string;
	jam_mulai?: string;
	jam_selesai?: string;
}

export interface ShiftResponse {
	id: number;
	nama_shift: string;
	kode_shift: string; // ← ditambahkan
	jam_mulai: string;
	jam_selesai: string;
}

export type ShiftListResponse = ShiftResponse[];
