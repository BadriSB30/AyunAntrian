// src/services/user.api.ts
import { apiFetch } from '@/lib/fetcher';
import type {
	UserResponse,
	UserListResponse,
	CreateUserDTO,
	UpdateUserDTO,
} from '@/modules/user/user.types';

/**
 * GET /api/users
 */
export async function getUser(): Promise<UserListResponse> {
	const res = await apiFetch<UserListResponse>('/api/users', {
		method: 'GET',
		showToast: false,
	});

	if (!res.ok) {
		throw new Error(res.message);
	}

	return res.data;
}

/**
 * POST /api/users
 */
export async function createUser(payload: CreateUserDTO): Promise<UserResponse> {
	const res = await apiFetch<UserResponse>('/api/users', {
		method: 'POST',
		body: JSON.stringify(payload),
		successMessage: 'User berhasil ditambahkan',
	});

	if (!res.ok) {
		throw new Error(res.message);
	}

	return res.data;
}

/**
 * GET /api/users/:id
 */
export async function getUserById(id: number): Promise<UserResponse> {
	const res = await apiFetch<UserResponse>(`/api/users/${id}`, {
		method: 'GET',
	});

	if (!res.ok) {
		throw new Error(res.message);
	}

	return res.data;
}

/**
 * PUT /api/users/:id
 */
export async function updateUser(id: number, data: UpdateUserDTO): Promise<void> {
	const res = await apiFetch<void>(`/api/users/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
		successMessage: 'User berhasil diperbarui',
	});

	if (!res.ok) {
		throw new Error(res.message);
	}
}

/**
 * PATCH /api/users/:id/status
 */
export async function updateUserStatus(id: number, status: 'aktif' | 'nonaktif'): Promise<void> {
	const res = await apiFetch<void>(`/api/users/${id}/status`, {
		method: 'PATCH',
		body: JSON.stringify({ status }),
		successMessage: 'Status User berhasil diperbarui',
	});

	if (!res.ok) {
		throw new Error(res.message);
	}
}

/**
 * DELETE /api/users/:id
 */
export async function deleteUser(id: number): Promise<void> {
	const res = await apiFetch<void>(`/api/users/${id}`, {
		method: 'DELETE',
		successMessage: 'User berhasil dihapus permanen',
	});

	if (!res.ok) {
		throw new Error(res.message);
	}
}
