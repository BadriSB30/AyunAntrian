import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import Providers from './providers';
import ClientLayout from '@/components/layout/ClientLayout';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Ayun Antrian',
	description: 'Sistem Antrian By Ayun',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='id'>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Providers>
					<ClientLayout>{children}</ClientLayout>
				</Providers>
			</body>
		</html>
	);
}
