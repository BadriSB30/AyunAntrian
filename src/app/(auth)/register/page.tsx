'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from 'react-icons/fi';

import { useRegisterForm } from '@/hooks/auth/useRegisterForm';
import { useRegister } from '@/hooks/auth/useRegister';

export default function RegisterPage() {
	const { form, handleChange } = useRegisterForm();
	const { submit, loading } = useRegister();

	const [showPassword, setShowPassword] = useState(false);

	return (
		<section className='min-h-screen flex items-center justify-center px-4'>
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6'
			>
				<h2 className='text-3xl font-bold text-center'>Buat Akun Baru</h2>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						submit(form);
					}}
					className='space-y-4'
				>
					{/* NAME */}
					<div className='relative'>
						<FiUser className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<input
							type='text'
							name='nama' // 🔥 WAJIB
							value={form.nama}
							onChange={handleChange}
							placeholder='Nama lengkap'
							className='w-full pl-10 py-3 border rounded-xl'
						/>
					</div>

					{/* USERNAME */}
					<div className='relative'>
						<FiUser className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<input
							type='text'
							name='username' // 🔥 WAJIB
							value={form.username}
							onChange={handleChange}
							placeholder='Username'
							className='w-full pl-10 py-3 border rounded-xl'
						/>
					</div>

					{/* EMAIL */}
					<div className='relative'>
						<FiMail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<input
							type='email'
							name='email'
							value={form.email}
							onChange={handleChange}
							placeholder='Email'
							className='w-full pl-10 py-3 border rounded-xl'
						/>
					</div>

					{/* PASSWORD */}
					<div className='relative'>
						<FiLock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
						<input
							type={showPassword ? 'text' : 'password'}
							name='password'
							value={form.password}
							onChange={handleChange}
							placeholder='Password'
							className='w-full pl-10 pr-12 py-3 border rounded-xl'
						/>
						<button
							type='button'
							onClick={() => setShowPassword((v) => !v)}
							className='absolute right-3 top-1/2 -translate-y-1/2'
						>
							{showPassword ? <FiEyeOff /> : <FiEye />}
						</button>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50'
					>
						{loading ? 'Memproses...' : 'Daftar'}
					</button>
				</form>

				<p className='text-sm text-center'>
					Sudah punya akun?{' '}
					<Link
						href='/login'
						className='text-blue-600'
					>
						Login
					</Link>
				</p>
			</motion.div>
		</section>
	);
}
