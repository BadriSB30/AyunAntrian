'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiUser, FiLock } from 'react-icons/fi';

import { useLoginForm } from '@/hooks/auth/useLoginForm';

export default function LoginPage() {
	const { form, showPassword, loading, error, handleChange, handleSubmit, togglePassword } =
		useLoginForm();

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
				{/* Logo */}
				<div className='flex justify-center'>
					<Image
						src='/favicon.png'
						alt='Logo'
						width={70}
						height={70}
						className='rounded-xl shadow-md'
						priority
					/>
				</div>

				{/* Heading */}
				<div className='text-center space-y-2'>
					<h2 className='text-3xl font-bold tracking-tight'>Selamat Datang</h2>
					<p className='text-sm text-gray-600'>Silakan masuk untuk melanjutkan</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className='space-y-5'
				>
					{/* Username */}
					<div className='relative group'>
						<FiUser className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black transition' />
						<input
							type='text'
							value={form.username}
							onChange={(e) => handleChange('username', e.target.value)}
							placeholder='Masukkan username'
							autoComplete='username'
							className='w-full pl-12 py-3 rounded-xl 
							bg-white/40 border border-white/50 
							focus:outline-none focus:ring-2 focus:ring-black/20 
							transition backdrop-blur-md'
						/>
					</div>

					{/* Password */}
					<div className='relative group'>
						<FiLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black transition' />
						<input
							type={showPassword ? 'text' : 'password'}
							value={form.password}
							onChange={(e) => handleChange('password', e.target.value)}
							placeholder='Masukkan password'
							autoComplete='current-password'
							className='w-full pl-12 pr-12 py-3 rounded-xl 
							bg-white/40 border border-white/50 
							focus:outline-none focus:ring-2 focus:ring-black/20 
							transition backdrop-blur-md'
						/>
						<button
							type='button'
							onClick={togglePassword}
							className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition'
							aria-label='Toggle password visibility'
						>
							{showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
						</button>
					</div>

					{/* Error */}
					{error && (
						<motion.p
							initial={{ opacity: 0, y: -5 }}
							animate={{ opacity: 1, y: 0 }}
							className='text-sm text-red-600 text-center bg-red-100/60 border border-red-200 py-2 rounded-lg'
						>
							{error}
						</motion.p>
					)}

					{/* Button */}
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
						{loading ? 'Memproses...' : 'Masuk'}
					</motion.button>
				</form>

				{/* Register */}
				<p className='text-sm text-center text-gray-700'>
					Belum punya akun?{' '}
					<Link
						href='/register'
						className='font-medium hover:underline'
					>
						Daftar di sini
					</Link>
				</p>
			</motion.div>
		</section>
	);
}
