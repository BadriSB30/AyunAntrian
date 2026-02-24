// src/lib/fetcher.ts
import { toast } from 'sonner';

export type ApiSuccess<T> = {
	ok: true;
	data: T;
};

export type ApiFailure = {
	ok: false;
	message: string;
	status: number;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

type FetcherOptions = RequestInit & {
	showToast?: boolean;
	successMessage?: string;
	errorMessage?: string;
	redirectOnAuthError?: boolean;
};

export async function apiFetch<T>(
	url: string,
	options?: FetcherOptions,
): Promise<ApiResult<T>> {
	const {
		showToast = true,
		successMessage,
		errorMessage,
		redirectOnAuthError = true,
		...fetchOptions
	} = options || {};

	try {
		const res = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				...(fetchOptions.headers || {}),
			},
			credentials: 'include',
			...fetchOptions,
		});

		// =========================
		// AUTH ERROR → FORCE LOGOUT
		// =========================
		if (res.status === 401 || res.status === 403) {
			if (typeof window !== 'undefined') {
				// simpan pesan untuk halaman login
				sessionStorage.setItem(
					'auth:logout-message',
					'Sesi Anda telah berakhir. Silakan login kembali.',
				);

				if (redirectOnAuthError) {
					window.location.replace('/login');
				}
			}

			return {
				ok: false,
				message: 'Unauthorized',
				status: res.status,
			};
		}

		// =========================
		// PARSE JSON
		// =========================
		const json = await res.json().catch(() => null);

		if (!res.ok || !json?.success) {
			const message = errorMessage ?? json?.message ?? 'Request gagal';
			if (showToast) toast.error(message);

			return {
				ok: false,
				message,
				status: res.status,
			};
		}

		// =========================
		// SUCCESS
		// =========================
		if (showToast && successMessage) {
			toast.success(successMessage);
		}

		return {
			ok: true,
			data: json.data as T,
		};
	} catch {
		if (showToast) {
			toast.error('Gagal terhubung ke server');
		}

		return {
			ok: false,
			message: 'Network error',
			status: 0,
		};
	}
}
