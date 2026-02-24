// src/services/weekly.api.ts
import { apiFetch } from '@/lib/fetcher';
import type {
	WeeklyShiftTemplateResponse,
	WeeklyShiftTemplateListResponse,
	CreateWeeklyShiftTemplateDTO,
	UpdateWeeklyShiftTemplateDTO,
} from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.types';

/**
 * GET /api/weeklyShift-templates
 */
export async function getWeeklyShiftTemplates(): Promise<WeeklyShiftTemplateListResponse> {
	const res = await apiFetch<WeeklyShiftTemplateListResponse>('/api/weeklyShift-templates', {
		method: 'GET',
		showToast: false,
	});

	if (!res.ok) throw new Error(res.message);

	return res.data;
}

/**
 * GET /api/weeklyShift-templates/antrian
 */
export async function getWeeklyShiftAssignments(): Promise<WeeklyShiftTemplateListResponse> {
	const res = await apiFetch<WeeklyShiftTemplateListResponse>(
		'/api/weeklyShift-templates/antrian',
		{ method: 'GET', showToast: false },
	);

	if (!res.ok) throw new Error(res.message);

	return res.data;
}

/**
 * GET /api/weeklyShift-templates/<admin_id>
 */
export async function getWeeklyShiftTemplatesByAdmin(
	admin_id: number,
): Promise<WeeklyShiftTemplateListResponse> {
	const res = await apiFetch<WeeklyShiftTemplateListResponse>(
		`/api/weeklyShift-templates/${admin_id}`,
		{ method: 'GET', showToast: false },
	);

	if (!res.ok) throw new Error(res.message);

	return res.data;
}

/**
 * POST /api/weeklyShift-templates (superadmin)
 */
export async function createWeeklyShiftTemplate(
	payload: CreateWeeklyShiftTemplateDTO,
): Promise<WeeklyShiftTemplateResponse> {
	const res = await apiFetch<WeeklyShiftTemplateResponse>('/api/weeklyShift-templates', {
		method: 'POST',
		body: JSON.stringify(payload),
		successMessage: 'Weekly Shift Template berhasil ditambahkan',
	});

	if (!res.ok) throw new Error(res.message);

	return res.data;
}

/**
 * GET /api/weeklyShift-templates/:id
 */
export async function getWeeklyShiftTemplateById(id: number): Promise<WeeklyShiftTemplateResponse> {
	const res = await apiFetch<WeeklyShiftTemplateResponse>(`/api/weeklyShift-templates/${id}`, {
		method: 'GET',
	});

	if (!res.ok) throw new Error(res.message);

	return res.data;
}

/**
 * PUT /api/weeklyShift-templates/:id
 */
export async function updateWeeklyShiftTemplate(
	id: number,
	data: UpdateWeeklyShiftTemplateDTO,
): Promise<void> {
	const res = await apiFetch<void>(`/api/weeklyShift-templates/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
		successMessage: 'Weekly Shift Template berhasil diperbarui',
	});

	if (!res.ok) throw new Error(res.message);
}

/**
 * DELETE /api/weeklyShift-templates/:id
 */
export async function deleteWeeklyShiftTemplate(id: number): Promise<void> {
	const res = await apiFetch<void>(`/api/weeklyShift-templates/${id}`, {
		method: 'DELETE',
		successMessage: 'Weekly Shift Template berhasil dihapus permanen',
	});

	if (!res.ok) throw new Error(res.message);
}
