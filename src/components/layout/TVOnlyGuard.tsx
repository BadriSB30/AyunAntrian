'use client';

import { useEffect, useState } from 'react';
import { FiMonitor } from 'react-icons/fi';

interface TVOnlyGuardProps {
	children: React.ReactNode;
	minWidth?: number; // default 1024 (desktop)
	fallback?: React.ReactNode;
}

export function TVOnlyGuard({ children, minWidth = 1024, fallback }: TVOnlyGuardProps) {
	const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

	useEffect(() => {
		const check = () => {
			setIsAllowed(window.innerWidth >= minWidth);
		};

		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, [minWidth]);

	if (isAllowed === null) return null;

	if (!isAllowed) {
		return (
			fallback ?? (
				<div className='fixed inset-0 flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-800 px-6'>
					<div className='w-full max-w-lg rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-10 text-center text-white'>
						<div className='flex justify-center mb-6'>
							<div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20'>
								<FiMonitor size={32} />
							</div>
						</div>

						<h1 className='text-2xl font-semibold tracking-tight'>Tampilan Khusus Mode TV</h1>

						<p className='mt-4 text-sm text-blue-100 leading-relaxed'>
							Halaman ini dirancang untuk layar besar seperti TV atau monitor display. Silakan akses
							menggunakan perangkat dengan resolusi lebih besar.
						</p>

						<div className='mt-6 text-xs text-blue-200'>Minimum lebar layar: {minWidth}px</div>
					</div>
				</div>
			)
		);
	}

	return <>{children}</>;
}
