'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Role } from '@/types/enums';
import type { IconType } from 'react-icons';
import { FiGrid, FiMonitor, FiClock, FiList, FiChevronDown, FiUser } from 'react-icons/fi';

/* =========================
TYPES
========================= */
interface MenuItem {
	name: string;
	path?: string;
	icon: IconType;
	roles: Role[];
	children?: {
		name: string;
		path: string;
	}[];
}

/* =========================
MENU CONFIG
========================= */
const menuItems: MenuItem[] = [
	{
		name: 'Dashboard',
		path: '/dashboard',
		icon: FiGrid,
		roles: [Role.ADMIN, Role.SUPERADMIN],
	},
	{
		name: 'Loket',
		path: '/loket',
		icon: FiMonitor,
		roles: [Role.SUPERADMIN],
	},
	{
		name: 'Shift',
		icon: FiClock,
		roles: [Role.SUPERADMIN],
		children: [
			{ name: 'Harian', path: '/shift/harian' },
			{ name: 'Template', path: '/shift/template' },
		],
	},
	{
		name: 'Antrian',
		path: '/antrian',
		icon: FiList,
		roles: [Role.ADMIN, Role.SUPERADMIN],
	},
	{
		name: 'Users',
		path: '/users',
		icon: FiUser,
		roles: [Role.SUPERADMIN],
	},
];

/* =========================
PROPS
========================= */
interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	navbarHeight?: number;
}

/* =========================
COMPONENT
========================= */
export default function Sidebar({ isOpen, onClose, navbarHeight = 60 }: SidebarProps) {
	const { data: session, status } = useSession();
	const pathname = usePathname();
	const role = session?.user?.role;

	const [openShift, setOpenShift] = useState(pathname.startsWith('/shift'));

	if (status === 'loading') return null;

	return (
		<>
			{/* OVERLAY (MOBILE) */}
			{isOpen && (
				<div
					onClick={onClose}
					className='fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden'
				/>
			)}

			<motion.aside
				initial={false}
				animate={{ x: isOpen ? 0 : -224 }}
				transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
				style={{
					top: navbarHeight,
					height: `calc(100vh - ${navbarHeight}px)`,
				}}
				className='fixed left-0 z-40 flex w-56 flex-col border-r border-slate-200 bg-white shadow-sm'
			>
				<nav className='flex-1 space-y-1 overflow-y-auto px-3 py-4'>
					{menuItems.map((item) => {
						if (!role || !item.roles.includes(role)) return null;

						/* ===== DROPDOWN SHIFT ===== */
						if (item.children) {
							const Icon = item.icon;
							const active = pathname.startsWith('/shift');

							return (
								<div key={item.name}>
									<button
										type='button'
										onClick={() => setOpenShift((v) => !v)}
										className={`
											w-full flex items-center justify-between
											px-3 py-2.5 rounded-xl text-sm font-medium transition
											${active ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}
										`}
									>
										<div className='flex items-center gap-3'>
											<div
												className={`
													w-9 h-9 rounded-lg flex items-center justify-center transition
													${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}
												`}
											>
												<Icon className='text-[18px]' />
											</div>
											<span>{item.name}</span>
										</div>

										<FiChevronDown
											className={`transition-transform ${openShift ? 'rotate-180' : ''}`}
										/>
									</button>

									<AnimatePresence>
										{openShift && (
											<motion.div
												initial={{
													height: 0,
													opacity: 0,
												}}
												animate={{
													height: 'auto',
													opacity: 1,
												}}
												exit={{
													height: 0,
													opacity: 0,
												}}
												className='ml-12 mt-1 space-y-1 overflow-hidden'
											>
												{item.children.map((child) => {
													const activeChild = pathname === child.path;

													return (
														<Link
															key={child.path}
															href={child.path}
															onClick={onClose}
															className={`
																	block px-3 py-2 rounded-lg text-sm transition
																	${activeChild ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}
																`}
														>
															{child.name}
														</Link>
													);
												})}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							);
						}

						/* ===== NORMAL MENU ===== */
						const Icon = item.icon;
						const active = pathname === item.path;

						return (
							<Link
								key={item.path}
								href={item.path!}
								onClick={onClose}
								className={`
									group flex items-center gap-3
									px-3 py-2.5 rounded-xl text-sm font-medium transition
									${active ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}
								`}
							>
								<div
									className={`
										w-9 h-9 rounded-lg flex items-center justify-center transition
										${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50'}
									`}
								>
									<Icon className='text-[18px]' />
								</div>
								<span className='truncate'>{item.name}</span>
							</Link>
						);
					})}
				</nav>
			</motion.aside>
		</>
	);
}
