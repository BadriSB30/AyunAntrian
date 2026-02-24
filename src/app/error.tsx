'use client';

import Image from 'next/image';
import { useEffect } from 'react';

interface GlobalErrorProps {
	error: Error;
	reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	useEffect(() => {
		console.error('Error terjadi:', error);
	}, [error]);

	return (
		<div className='min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 relative overflow-hidden'>
			{/* Background Image */}
			<div className='absolute inset-0 flex items-center justify-center pointer-events-none opacity-90'>
				<Image
					src='/images/500.png'
					alt='500 Illustration'
					width={600}
					height={600}
					className='object-contain drop-shadow-lg'
				/>
			</div>

			{/* Content Overlay */}
			<div className='relative z-10 mt-96 sm:mt-125 text-center'>
				<p className='text-lg text-gray-600 mt-3'>
					Terjadi kesalahan pada server. Coba muat ulang halaman 😵‍💫
				</p>

				<button
					onClick={reset}
					className='mt-6 inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md'
				>
					Coba Lagi
				</button>
			</div>
		</div>
	);
}
