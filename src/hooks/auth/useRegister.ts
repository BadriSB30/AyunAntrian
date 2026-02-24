'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { apiFetch } from '@/lib/fetcher';
import type { RegisterForm } from './useRegisterForm';

type RegisterResponse = {
	id: number;
	nama: string;
	username: string;
	email: string;
	role: 'superadmin';
};

export function useRegister() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const submit = async (form: RegisterForm) => {
		setLoading(true);

		try {
			await apiFetch<RegisterResponse>('/api/auth/register', {
				method: 'POST',
				body: JSON.stringify(form),
			});

			toast.success('Akun berhasil dibuat');
			router.push('/login');
		} catch {
			// 🔥 SATU-SATUNYA TOAST ERROR
			toast.error('Registrasi ditutup. Silakan hubungi admin untuk pembuatan akun');
		} finally {
			setLoading(false);
		}
	};

	return {
		submit,
		loading,
	};
}
