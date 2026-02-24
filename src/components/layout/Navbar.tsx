// src/components/Navbar.tsx
'use client';

import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export interface NavbarProps {
	onLogoClick?: () => void;
	isMobileNavOpen: boolean;
	onToggleMobileNav: () => void;
}

const navItems = [
	{ label: 'Beranda', href: 'Beranda' },
	{ label: 'Tentang', href: 'Tentang' },
	{ label: 'Fitur', href: 'Fitur' },
	{ label: 'Alur', href: 'Alur' },
];

export default function Navbar({ onLogoClick, isMobileNavOpen, onToggleMobileNav }: NavbarProps) {
	const { data: session, status } = useSession();
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const router = useRouter();
	const pathname = usePathname();

	/* ================= SCROLL HANDLER ================= */
	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (!element) return;

		const yOffset = -80; // tinggi navbar
		const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

		window.scrollTo({ top: y, behavior: 'smooth' });
	};

	const handleNavClick = (id: string) => {
		if (pathname !== '/') {
			router.push(`/#${id}`);
		} else {
			scrollToSection(id);
		}

		// tutup menu mobile & profile
		if (isMobileNavOpen) onToggleMobileNav();
		setIsProfileOpen(false);
	};

	/* ================= RENDER ================= */
	return (
		<nav className='sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm'>
			{/* ================= TOP BAR ================= */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-around'>
				{/* LOGO */}
				<button
					onClick={onLogoClick}
					disabled={!onLogoClick}
					className={`flex items-center gap-2 ${
						!onLogoClick ? 'cursor-not-allowed opacity-50' : ''
					}`}
				>
					<Image
						src='/favicon.ico'
						alt='Logo'
						width={36}
						height={36}
					/>
					<span className='text-lg font-bold text-gray-800'>
						<span className='text-emerald-600'>Ayun</span> Antrian
					</span>
				</button>

				{/* DESKTOP NAV */}
				<ul className='hidden md:flex items-center gap-2'>
					{navItems.map((item) => (
						<li key={item.label}>
							<button
								onClick={() => handleNavClick(item.href)}
								className='px-4 py-2 text-sm font-medium text-gray-700 rounded-full hover:bg-emerald-50 transition'
							>
								{item.label}
							</button>
						</li>
					))}
				</ul>

				{/* PROFILE + MOBILE TOGGLE */}
				<div className='flex items-center gap-3'>
					{/* PROFILE */}
					{status === 'authenticated' && (
						<div className='relative hidden md:block'>
							<button
								onClick={() => setIsProfileOpen((prev) => !prev)}
								className='flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 transition'
							>
								<span className='text-sm font-medium text-gray-700'>{session?.user?.nama}</span>
								<HiChevronDown
									size={20}
									className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
								/>
							</button>

							<AnimatePresence>
								{isProfileOpen && (
									<motion.div
										initial={{
											opacity: 0,
											y: -8,
										}}
										animate={{
											opacity: 1,
											y: 0,
										}}
										exit={{
											opacity: 0,
											y: -8,
										}}
										className='absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50'
									>
										<button
											onClick={() => signOut()}
											className='w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition'
										>
											Logout
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					)}

					{/* MOBILE TOGGLE */}
					<button
						onClick={onToggleMobileNav}
						className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition'
						aria-label='Toggle Menu'
					>
						{isMobileNavOpen ? <HiX size={24} /> : <HiMenu size={24} />}
					</button>
				</div>
			</div>

			{/* ================= MOBILE MENU OVERLAY ================= */}
			<AnimatePresence>
				{isMobileNavOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className='md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg z-40'
					>
						<ul className='p-4 space-y-2'>
							{navItems.map((item) => (
								<li key={item.label}>
									<button
										onClick={() => handleNavClick(item.href)}
										className='block w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 transition'
									>
										{item.label}
									</button>
								</li>
							))}

							{status === 'authenticated' && (
								<li>
									<button
										onClick={() => signOut()}
										className='block w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 transition'
									>
										Logout
									</button>
								</li>
							)}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
