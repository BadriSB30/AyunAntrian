'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const SIDEBAR_WIDTH = 224;
const NAVBAR_HEIGHT = 60;
const MOBILE_BREAKPOINT = 768;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const { status } = useSession();
	const pathname = usePathname();

	const [mounted, setMounted] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	/* ================= MOUNT GUARD ================= */
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	/* ================= RESPONSIVE HANDLER ================= */
	useEffect(() => {
		if (!mounted) return;

		const handleResize = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [mounted]);

	const hideLayout = pathname.startsWith('/login') || pathname.startsWith('/register');

	const canAccessSidebar = status === 'authenticated' && !hideLayout;
	const sidebarActive = !isMobile && isSidebarOpen && canAccessSidebar;

	/* ================= PREVENT HYDRATION ================= */
	if (!mounted) {
		return (
			<div className='min-h-screen bg-gray-100'>
				<main>{children}</main>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-linear-to-br from-gray-100 via-gray-200 to-gray-300'>
			{!hideLayout && (
				<Navbar
					onLogoClick={() => canAccessSidebar && setIsSidebarOpen((v) => !v)}
					isMobileNavOpen={isMobileNavOpen}
					onToggleMobileNav={() => setIsMobileNavOpen((v) => !v)}
				/>
			)}

			<div className='relative flex'>
				{canAccessSidebar && (
					<Sidebar
						isOpen={isSidebarOpen}
						onClose={() => setIsSidebarOpen(false)}
						navbarHeight={NAVBAR_HEIGHT}
					/>
				)}

				<motion.div
					animate={{
						marginLeft: sidebarActive ? `${SIDEBAR_WIDTH}px` : '0px',
						width: sidebarActive ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
					}}
					transition={{ duration: 0.25, ease: 'easeOut' }}
					className='flex min-h-[calc(100vh-60px)] flex-col'
				>
					<main className='flex-1 overflow-x-hidden'>{children}</main>

					{!hideLayout && <Footer />}
				</motion.div>
			</div>
		</div>
	);
}
