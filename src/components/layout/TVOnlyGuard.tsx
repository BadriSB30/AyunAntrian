'use client';

import { useEffect, useState } from 'react';

interface TVOnlyGuardProps {
	children: React.ReactNode;
	minWidth?: number; // default 768 (tablet ke atas)
	fallback?: React.ReactNode;
}

export function TVOnlyGuard({ children, minWidth = 768, fallback }: TVOnlyGuardProps) {
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
				<div className='fixed inset-0 flex items-center justify-center bg-black text-white text-3xl font-bold'>
					Mode TV Only
				</div>
			)
		);
	}

	return <>{children}</>;
}
