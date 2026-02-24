'use client';

import { motion, Variants } from 'framer-motion';
import type { IconType } from 'react-icons';
import { FaYoutube, FaInstagram, FaTiktok, FaEnvelope } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';

/* ================= TYPES ================= */
interface SocialLink {
	icon: IconType;
	href: string;
	hover: string;
}

/* ================= DATA ================= */
const socialLinks: SocialLink[] = [
	{
		icon: FaYoutube,
		href: 'https://www.youtube.com/@a.y.u.n0o0',
		hover: 'hover:text-red-500 hover:border-red-200',
	},
	{
		icon: FaInstagram,
		href: 'https://instagram.com/ayun_0o0',
		hover: 'hover:text-pink-500 hover:border-pink-200',
	},
	{
		icon: FaTiktok,
		href: 'https://www.tiktok.com/@ayun_0o0',
		hover: 'hover:text-gray-900 hover:border-gray-300',
	},
	{
		icon: FaEnvelope,
		href: 'mailto:badrisyahrul01@gmail.com',
		hover: 'hover:text-emerald-600 hover:border-emerald-200',
	},
];

/* ================= ANIMATION ================= */
const fadeIn: Variants = {
	show: (delay = 0) => ({
		opacity: 1,
		transition: {
			duration: 0.4,
			delay,
			ease: [0.16, 1, 0.3, 1],
		},
	}),
};

export default function Footer() {
	const router = useRouter();
	const pathname = usePathname();

	/* ===== SCROLL WITH OFFSET (SAMA DENGAN NAVBAR) ===== */
	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (!element) return;

		const yOffset = -80; // tinggi navbar
		const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

		window.scrollTo({ top: y, behavior: 'smooth' });
	};

	const handleFooterNavClick = (id: string) => {
		if (pathname !== '/') {
			router.push(`/#${id}`);
		} else {
			scrollToSection(id);
		}
	};

	return (
		<footer className='min-h-105 border-t bg-linear-to-b from-[#F9FBFA] to-white'>
			<div className='mx-auto max-w-7xl px-6 py-20'>
				<div className='grid gap-12 md:grid-cols-4'>
					{/* BRAND */}
					<motion.div
						variants={fadeIn}
						animate='show'
						custom={0}
						className='opacity-0'
					>
						<h2 className='text-xl font-semibold tracking-tight'>
							<span className='text-emerald-600'>AYUN</span>{' '}
							<span className='text-gray-900'>ANTRIAN</span>
						</h2>
						<p className='mt-4 max-w-sm text-sm leading-relaxed text-gray-600'>
							Platform digital modern untuk pengelolaan antrian, pemanggilan otomatis, dan
							monitoring real-time.
						</p>
					</motion.div>

					{/* NAVIGASI */}
					<motion.div
						variants={fadeIn}
						animate='show'
						custom={0.05}
						className='opacity-0'
					>
						<h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900'>
							Navigasi
						</h3>
						<ul className='space-y-3 text-sm text-gray-600'>
							{[
								{ label: 'Beranda', id: 'Beranda' },
								{ label: 'Tentang', id: 'Tentang' },
								{ label: 'Fitur', id: 'Fitur' },
								{ label: 'Alur Sistem', id: 'Alur' },
							].map((item) => (
								<li key={item.id}>
									<button
										onClick={() => handleFooterNavClick(item.id)}
										className='transition hover:text-emerald-600'
									>
										{item.label}
									</button>
								</li>
							))}

							{/* PAGE NAVIGATION */}
							<li>
								<button
									onClick={() => router.push('/ambil-antrian')}
									className='transition hover:text-emerald-600'
								>
									Ambil Antrian
								</button>
							</li>
							<li>
								<button
									onClick={() => router.push('/status-antrian')}
									className='transition hover:text-emerald-600'
								>
									Status Antrian
								</button>
							</li>
						</ul>
					</motion.div>

					{/* LAYANAN */}
					<motion.div
						variants={fadeIn}
						animate='show'
						custom={0.1}
						className='opacity-0'
					>
						<h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900'>
							Layanan
						</h3>
						<ul className='space-y-3 text-sm text-gray-600'>
							<li>Antrian Digital</li>
							<li>Dashboard & Grafik</li>
							<li>Pemanggilan Otomatis</li>
							<li>Keamanan & Hak Akses</li>
						</ul>
					</motion.div>

					{/* SOCIAL */}
					<motion.div
						variants={fadeIn}
						animate='show'
						custom={0.15}
						className='opacity-0'
					>
						<h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900'>
							Terhubung
						</h3>
						<div className='flex gap-3'>
							{socialLinks.map(({ icon: Icon, href, hover }) => (
								<motion.a
									key={href}
									href={href}
									target='_blank'
									rel='noopener noreferrer'
									whileHover={{ scale: 1.08 }}
									whileTap={{ scale: 0.95 }}
									className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition ${hover}`}
								>
									<Icon size={18} />
								</motion.a>
							))}
						</div>
					</motion.div>
				</div>

				{/* FOOTER BOTTOM */}
				<div className='mt-16 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-gray-500 sm:flex-row'>
					<p>© {new Date().getFullYear()} AYUN ANTRIAN. All rights reserved.</p>
					<p className='tracking-wide'>v1.1.0</p>
				</div>
			</div>
		</footer>
	);
}
