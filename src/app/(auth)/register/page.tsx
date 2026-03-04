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
		<section className='min-h-screen flex items-center justify-center px-4 relative overflow-hidden'>
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='relative w-full max-w-md
				bg-white/30 backdrop-blur-2xl
				border border-white/40
				shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
				rounded-3xl p-8 space-y-6 text-gray-800'
			>
				{/* Heading */}
				<div className='text-center space-y-2'>
					<h2 className='text-3xl font-bold tracking-tight'>Buat Akun Baru</h2>
					<p className='text-sm text-gray-600'>Daftar untuk mulai menggunakan sistem</p>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						submit(form);
					}}
					className='space-y-5'
				>
					{/* NAME */}
					<div className='relative group'>
						<FiUser className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black transition' />
						<input
							type='text'
							name='nama'
							value={form.nama}
							onChange={handleChange}
							placeholder='Nama lengkap'
							className='w-full pl-12 py-3 rounded-xl
							bg-white/40 border border-white/50
							focus:outline-none focus:ring-2 focus:ring-black/20
							transition backdrop-blur-md'
						/>
					</div>

					{/* USERNAME */}
					<div className='relative group'>
						<FiUser className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black transition' />
						<input
							type='text'
							name='username'
							value={form.username}
							onChange={handleChange}
							placeholder='Username'
							className='w-full pl-12 py-3 rounded-xl
							bg-white/40 border border-white/50
							focus:outline-none focus:ring-2 focus:ring-black/20
							transition backdrop-blur-md'
						/>
					</div>

					{/* EMAIL */}
					<div className='relative group'>
						<FiMail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black transition' />
						<input
							type='email'
							name='email'
							value={form.email}
							onChange={handleChange}
							placeholder='Email'
							className='w-full pl-12 py-3 rounded-xl
							bg-white/40 border border-white/50
							focus:outline-none focus:ring-2 focus:ring-black/20
							transition backdrop-blur-md'
						/>
					</div>

					{/* PASSWORD */}
					<div className='relative group'>
						<FiLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black transition' />
						<input
							type={showPassword ? 'text' : 'password'}
							name='password'
							value={form.password}
							onChange={handleChange}
							placeholder='Password'
							className='w-full pl-12 pr-12 py-3 rounded-xl
							bg-white/40 border border-white/50
							focus:outline-none focus:ring-2 focus:ring-black/20
							transition backdrop-blur-md'
						/>
						<button
							type='button'
							onClick={() => setShowPassword((v) => !v)}
							className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition'
						>
							{showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
						</button>
					</div>

					{/* BUTTON */}
					<motion.button
						whileTap={{ scale: 0.97 }}
						whileHover={{ scale: 1.02 }}
						type='submit'
						disabled={loading}
						className='w-full bg-black text-white py-3 rounded-xl
						font-semibold shadow-md
						hover:bg-gray-900 transition
						disabled:opacity-50'
					>
						{loading ? 'Memproses...' : 'Daftar Sekarang'}
					</motion.button>
				</form>

				{/* LOGIN LINK */}
				<p className='text-sm text-center text-gray-700'>
					Sudah punya akun?{' '}
					<Link
						href='/login'
						className='font-medium hover:underline'
					>
						Login
					</Link>
				</p>
			</motion.div>
		</section>
	);
}
