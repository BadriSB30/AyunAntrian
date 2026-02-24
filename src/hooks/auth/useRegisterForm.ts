'use client';

import { useState, type ChangeEvent } from 'react';

export interface RegisterForm {
	nama: string;
	username: string;
	email: string;
	password: string;
}

export function useRegisterForm() {
	const [form, setForm] = useState<RegisterForm>({
		nama: '',
		username: '',
		email: '',
		password: '',
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setForm((prev) => ({
			...prev,
			[name]: name === 'username' || name === 'email' ? value.toLowerCase() : value,
		}));
	};

	const reset = () =>
		setForm({
			nama: '',
			username: '',
			email: '',
			password: '',
		});

	return {
		form,
		handleChange,
		reset,
	};
}
