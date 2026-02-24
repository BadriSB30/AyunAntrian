// src/services/counter.api.ts
import { apiFetch } from '@/lib/fetcher';
import type {
	CounterResponse,
	CounterListResponse,
	CreateCounterDTO,
	UpdateCounterDTO,
} from '@/modules/counter/counter.types';

/**
 * GET /api/counters
 */
export async function getCounters(): Promise<CounterListResponse> {
	const res = await apiFetch<CounterListResponse>('/api/counters', {
		method: 'GET',
		showToast: false,
	});
	if (!res.ok) throw new Error(res.message);
	return res.data;
}

/**
 * POST /api/counters (superadmin)
 */
export async function createCounter(payload: CreateCounterDTO): Promise<CounterResponse> {
	const res = await apiFetch<CounterResponse>('/api/counters', {
		method: 'POST',
		body: JSON.stringify(payload),
		successMessage: 'Loket berhasil ditambahkan',
	});
	if (!res.ok) throw new Error(res.message);
	return res.data;
}

/**
 * GET /api/counters/:id
 */
export async function getCounterById(id: number): Promise<CounterResponse> {
	const res = await apiFetch<CounterResponse>(`/api/counters/${id}`, { method: 'GET' });
	if (!res.ok) throw new Error(res.message);
	return res.data;
}

/**
 * PUT /api/counters/:id
 */
export async function updateCounter(id: number, data: UpdateCounterDTO): Promise<void> {
	const res = await apiFetch<void>(`/api/counters/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
		successMessage: 'Loket berhasil diperbarui',
	});
	if (!res.ok) throw new Error(res.message);
}

/**
 * PATCH /api/counters/:id/status
 */
export async function updateCounterStatus(id: number, status: 'aktif' | 'nonaktif'): Promise<void> {
	const res = await apiFetch<void>(`/api/counters/${id}/status`, {
		method: 'PATCH',
		body: JSON.stringify({ status }),
		successMessage: 'Status Loket berhasil diperbarui',
	});
	if (!res.ok) throw new Error(res.message);
}

/**
 * DELETE /api/counters/:id (HARD DELETE)
 */
export async function deleteCounter(id: number): Promise<void> {
	const res = await apiFetch<void>(`/api/counters/${id}`, {
		method: 'DELETE',
		successMessage: 'Loket berhasil dihapus permanen',
	});
	if (!res.ok) throw new Error(res.message);
}
