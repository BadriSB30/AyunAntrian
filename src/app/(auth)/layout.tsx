import type { ReactNode } from 'react';

interface AuthLayoutProps {
	children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<main className='min-h-screen flex items-center justify-center flex-1 overflow-y-auto p-6'>
			{children}
		</main>
	);
}
