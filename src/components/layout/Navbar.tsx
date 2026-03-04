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

	/* ================= SCROLL ================= */

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (!element) return;

		const yOffset = -20;
		const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

		window.scrollTo({ top: y, behavior: 'smooth' });
	};

	const handleNavClick = (id: string) => {
		if (pathname !== '/') {
			router.push(`/#${id}`);
		} else {
			scrollToSection(id);
		}

		if (isMobileNavOpen) onToggleMobileNav();
		setIsProfileOpen(false);
	};

	return (
		<nav className='sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm'>
			{/* ================= TOP BAR ================= */}
			<div className='mx-auto flex max-w-7xl items-center justify-around px-4 py-3 sm:px-6 lg:px-8'>
				{/* LOGO */}
				<button
					onClick={onLogoClick}
					disabled={!onLogoClick}
					className={`flex items-center gap-2 ${
						!onLogoClick ? 'cursor-not-allowed opacity-50' : ''
					}`}
				>
					<Image
						src='/favicon.png'
						alt='Logo'
						width={36}
						height={36}
					/>
					<span className='text-lg font-bold text-slate-800'>
						<span className='text-blue-600'>Ayun</span> Antrian
					</span>
				</button>

				{/* DESKTOP NAV */}
				<ul className='hidden items-center gap-2 md:flex'>
					{navItems.map((item) => (
						<li key={item.label}>
							<button
								onClick={() => handleNavClick(item.href)}
								className='rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600'
							>
								{item.label}
							</button>
						</li>
					))}
				</ul>

				{/* PROFILE + MOBILE */}
				<div className='flex items-center gap-3'>
					{/* PROFILE */}
					{status === 'authenticated' && (
						<div className='relative hidden md:block'>
							<button
								onClick={() => setIsProfileOpen((prev) => !prev)}
								className='flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
							>
								{session?.user?.nama}
								<HiChevronDown
									size={18}
									className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
								/>
							</button>

							<AnimatePresence>
								{isProfileOpen && (
									<motion.div
										initial={{
											opacity: 0,
											y: -6,
										}}
										animate={{
											opacity: 1,
											y: 0,
										}}
										exit={{
											opacity: 0,
											y: -6,
										}}
										className='absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg'
									>
										<button
											onClick={() => signOut()}
											className='w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-600'
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
						className='rounded-lg p-2 transition hover:bg-slate-100 md:hidden'
						aria-label='Toggle Menu'
					>
						{isMobileNavOpen ? (
							<HiX
								size={24}
								className='text-slate-700'
							/>
						) : (
							<HiMenu
								size={24}
								className='text-slate-700'
							/>
						)}
					</button>
				</div>
			</div>

			{/* ================= MOBILE MENU ================= */}
			<AnimatePresence>
				{isMobileNavOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className='absolute left-0 right-0 top-full z-40 border-t border-slate-200 bg-white shadow-lg md:hidden'
					>
						<ul className='space-y-2 p-4'>
							{navItems.map((item) => (
								<li key={item.label}>
									<button
										onClick={() => handleNavClick(item.href)}
										className='block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600'
									>
										{item.label}
									</button>
								</li>
							))}

							{status === 'authenticated' && (
								<li>
									<button
										onClick={() => signOut()}
										className='block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600'
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
