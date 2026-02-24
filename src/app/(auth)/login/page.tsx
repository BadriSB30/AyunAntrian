'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { useLoginForm } from '@/hooks/auth/useLoginForm';

export default function LoginPage() {
	const { form, showPassword, loading, error, handleChange, handleSubmit, togglePassword } =
		useLoginForm();

	return (
		<section className='min-h-screen flex items-center justify-center px-4'>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 space-y-6'
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

				<h2 className='text-3xl font-bold text-center text-blue-700'>Selamat Datang</h2>
				<p className='text-center text-gray-500 text-sm -mt-3'>Silakan masuk untuk melanjutkan</p>

				<form
					onSubmit={handleSubmit}
					className='space-y-4'
				>
					{/* Username */}
					<div className='space-y-1'>
						<label className='text-sm font-medium text-gray-600'>Username</label>
						<input
							type='text'
							value={form.username}
							onChange={(e) => handleChange('username', e.target.value)}
							className='w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white/60 focus:ring-blue-500 focus:ring-2 focus:border-blue-500 transition-all'
							placeholder='Masukkan username'
							autoComplete='username'
						/>
					</div>

					{/* Password */}
					<div className='space-y-1'>
						<label className='text-sm font-medium text-gray-600'>Password</label>
						<div className='relative'>
							<input
								type={showPassword ? 'text' : 'password'}
								value={form.password}
								onChange={(e) => handleChange('password', e.target.value)}
								className='w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white/60 focus:ring-blue-500 focus:ring-2 focus:border-blue-500 transition-all'
								placeholder='Masukkan password'
								autoComplete='current-password'
							/>

							<button
								type='button'
								onClick={togglePassword}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
								aria-label='Toggle password visibility'
							>
								{showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
							</button>
						</div>
					</div>

					{/* Error */}
					{error && <p className='text-sm text-red-500 text-center'>{error}</p>}

					<motion.button
						whileTap={{ scale: 0.97 }}
						type='submit'
						disabled={loading}
						className='w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-60'
					>
						{loading ? 'Memproses...' : 'Masuk'}
					</motion.button>
				</form>

				<p className='text-sm text-center text-gray-600'>
					Belum punya akun?{' '}
					<Link
						href='/register'
						className='text-blue-600 font-medium hover:underline'
					>
						Daftar di sini
					</Link>
				</p>
			</motion.div>
		</section>
	);
}
