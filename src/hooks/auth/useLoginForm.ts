'use client';

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LoginFormState {
	username: string;
	password: string;
}

export function useLoginForm() {
	const router = useRouter();

	const [form, setForm] = useState<LoginFormState>({
		username: '',
		password: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (field: keyof LoginFormState, value: string) => {
		setForm((prev) => ({
			...prev,
			[field]: field === 'username' ? value.toLowerCase().trimStart() : value,
		}));
	};

	const togglePassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const username = form.username.trim();
		const password = form.password.trim();

		if (!username || !password) {
			const msg = 'Username dan password wajib diisi';
			setError(msg);
			toast.error(msg);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await signIn('credentials', {
				redirect: false,
				username,
				password,
			});

			if (res?.ok) {
				toast.success('Login berhasil');
				router.replace('/dashboard');
				return;
			}

			const msg = res?.error ?? 'Username atau password salah';
			setError(msg);
			toast.error(msg);
		} catch {
			const msg = 'Terjadi kesalahan saat login';
			setError(msg);
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	};

	return {
		form,
		showPassword,
		loading,
		error,

		handleChange,
		handleSubmit,
		togglePassword,
	};
}
