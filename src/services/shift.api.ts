// src/services/shift.api.ts
import { apiFetch } from '@/lib/fetcher';
import type {
	ShiftResponse,
	ShiftListResponse,
	CreateShiftDTO,
	UpdateShiftDTO,
} from '@/modules/shift/shift.types';

/**
 * GET /api/shift-templates
 */
export async function getShifts(): Promise<ShiftListResponse> {
	const res = await apiFetch<ShiftListResponse>('/api/shift-templates', {
		method: 'GET',
		showToast: false,
	});

	if (!res.ok) throw new Error(res.message);

	return res.data;
}

/**
 * POST /api/shift-templates (superadmin)
 */
export async function createShift(payload: CreateShiftDTO): Promise<ShiftResponse> {
	const res = await apiFetch<ShiftResponse>('/api/shift-templates', {
		method: 'POST',
		body: JSON.stringify(payload),
		successMessage: 'Shift berhasil ditambahkan',
	});

	if (!res.ok) throw new Error(res.message);

	return res.data;
}

/**
 * GET /api/shift-templates/:id
 */
export async function getShiftById(id: number): Promise<ShiftResponse> {
	const res = await apiFetch<ShiftResponse>(`/api/shift-templates/${id}`, {
		method: 'GET',
	});

	if (!res.ok) throw new Error(res.message);

	return res.data;
}

/**
 * PUT /api/shift-templates/:id
 */
export async function updateShift(id: number, data: UpdateShiftDTO): Promise<void> {
	const res = await apiFetch<void>(`/api/shift-templates/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
		successMessage: 'Shift berhasil diperbarui',
	});

	if (!res.ok) throw new Error(res.message);
}

/**
 * DELETE /api/shift-templates/:id (HARD DELETE)
 */
export async function deleteShift(id: number): Promise<void> {
	const res = await apiFetch<void>(`/api/shift-templates/${id}`, {
		method: 'DELETE',
		successMessage: 'Shift berhasil dihapus permanen',
	});

	if (!res.ok) throw new Error(res.message);
}
