import type { ReactNode } from 'react';

interface PublicLayoutProps {
	children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
	return (
		<main className='min-h-screen flex items-center justify-center flex-1 overflow-y-auto'>
			{children}
		</main>
	);
}
