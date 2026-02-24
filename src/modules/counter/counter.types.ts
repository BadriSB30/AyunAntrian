// src/modules/counter/counter.types.ts

import { CounterStatus } from '@/types/enums';

// =========================
// CREATE
// =========================
export interface CreateCounterDTO {
	kode_loket: string;
	nama_loket: string;
	status?: CounterStatus; // optional, default AKTIF
}

// =========================
// UPDATE
// =========================
export interface UpdateCounterDTO {
	kode_loket?: string;
	nama_loket?: string;
	status?: CounterStatus;
}

// =========================
// RESPONSE (API SAFE)
// =========================
export interface CounterResponse {
	id: number;
	kode_loket: string;
	nama_loket: string;
	status: CounterStatus;
	created_at: Date;
}

// =========================
// LIST RESPONSE
// =========================
export type CounterListResponse = CounterResponse[];
