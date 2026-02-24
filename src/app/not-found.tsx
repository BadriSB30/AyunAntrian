// src/app/not-found.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className='relative min-h-screen overflow-hidden bg-gray-50 flex items-center justify-center'>
			{/* Background Image */}
			<div className='absolute inset-0 pointer-events-none'>
				<Image
					src='/images/404.png'
					alt='404 Illustration'
					fill
					priority
					className='object-contain'
				/>
			</div>

			{/* Content Overlay */}
			<div className='relative z-10 text-center px-4 translate-y-32 sm:translate-y-40 mt-20'>
				<p className='text-lg text-gray-600'>Sepertinya kamu tersesat di galaksi yang salah 🚀</p>

				<Link
					href='/#Beranda'
					className='mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md'
				>
					Kembali ke Beranda
				</Link>
			</div>
		</div>
	);
}
