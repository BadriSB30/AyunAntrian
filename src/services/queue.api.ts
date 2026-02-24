// src/services/queue.api.ts
import { apiFetch } from '@/lib/fetcher';
import type {
	QueueResponse,
	QueueListResponse,
	CreateQueueDTO,
	UpdateQueueDTO,
} from '@/modules/queue/queue.types';
import type { QueueCountResult } from '@/modules/queue/queue.repository';

/**
 * =====================================================
 * QUEUE LIST
 * =====================================================
 */

/**
 * GET /api/queues (SUPERADMIN)
 */
export async function getQueues(): Promise<QueueListResponse> {
	const res = await apiFetch<QueueListResponse>('/api/queues', { method: 'GET', showToast: false });
	if (!res.ok) throw new Error(res.message);
	return res.data;
}

/**
 * GET /api/queues/status (GLOBAL)
 */
export async function getQueueStatus(): Promise<QueueListResponse> {
	const res = await apiFetch<QueueListResponse>('/api/queues/status', {
		method: 'GET',
		showToast: false,
	});
	if (!res.ok) throw new Error(res.message);
	return res.data;
}

/**
 * GET /api/queues/admin (ADMIN)
 */
export async function getQueuesByAdmin(): Promise<QueueListResponse> {
	const res = await apiFetch<QueueListResponse>('/api/queues/admin', {
		method: 'GET',
		showToast: false,
	});
	if (!res.ok) throw new Error(res.message);
	return res.data;
}

/**
 * =====================================================
 * QUEUE CRUD
 * =====================================================
 */

/**
 * POST /api/queues
 * (ambil antrian / create queue)
 */
export async function createQueue(payload: CreateQueueDTO): Promise<QueueResponse> {
	const res = await apiFetch<QueueResponse>('/api/queues', {
		method: 'POST',
		body: JSON.stringify(payload),
		showToast: false, // UI handle sendiri
	});
	if (!res.ok) throw new Error(res.message);
	return res.data;
}

/**
 * GET /api/queues/:id
 */
export async function getQueueById(id: number): Promise<QueueResponse> {
	const res = await apiFetch<QueueResponse>(`/api/queues/${id}`, { method: 'GET' });
	if (!res.ok) throw new Error(res.message);
	return res.data;
}

/**
 * PUT /api/queues/:id
 */
export async function updateQueue(id: number, data: UpdateQueueDTO): Promise<void> {
	const res = await apiFetch<void>(`/api/queues/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
		successMessage: 'Queue berhasil diperbarui',
	});
	if (!res.ok) throw new Error(res.message);
}

/**
 * DELETE /api/queues/:id (HARD DELETE)
 */
export async function deleteQueue(id: number): Promise<void> {
	const res = await apiFetch<void>(`/api/queues/${id}`, {
		method: 'DELETE',
		successMessage: 'Queue berhasil dihapus permanen',
	});
	if (!res.ok) throw new Error(res.message);
}

/**
 * =====================================================
 * QUEUE COUNT / STATISTIC
 * =====================================================
 */

/**
 * GET /api/queues/count (SUPERADMIN)
 */
export async function getQueueCount(): Promise<QueueCountResult> {
	const res = await apiFetch<QueueCountResult>('/api/queues/count', {
		method: 'GET',
		showToast: false,
	});
	if (!res.ok) throw new Error(res.message);
	return res.data;
}

/**
 * GET /api/queues/admin/count (ADMIN)
 */
export async function getQueueCountAdmin(): Promise<QueueCountResult> {
	const res = await apiFetch<QueueCountResult>('/api/queues/admin/count', {
		method: 'GET',
		showToast: false,
	});
	if (!res.ok) throw new Error(res.message);
	return res.data;
}
