'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { FiUsers, FiMonitor, FiClock, FiBell, FiCheckCircle, FiZap } from 'react-icons/fi';

const fadeUp: Variants = {
	initial: { opacity: 0, y: 40 },
	whileInView: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

export default function LandingPage() {
	return (
		<div className='scroll-smooth overflow-x-hidden bg-slate-50 text-slate-800'>
			{/* ================= HERO ================= */}
			<section
				id='Beranda'
				className='relative min-h-screen flex items-center justify-center px-6 py-20 bg-linear-to-br from-slate-900 via-blue-900 to-slate-800 text-white'
			>
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_60%)]' />

				<div className='relative max-w-4xl mx-auto text-center space-y-8'>
					<motion.h1
						{...fadeUp}
						viewport={{ once: true }}
						className='text-4xl md:text-6xl font-bold leading-tight tracking-tight'
					>
						Sistem Antrian Digital
						<span className='block text-blue-400 mt-3'>Modern • Efisien • Profesional</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						viewport={{ once: true }}
						className='text-lg text-blue-100 max-w-2xl mx-auto'
					>
						Solusi manajemen antrian realtime untuk meningkatkan kualitas pelayanan dan pengalaman
						pelanggan secara modern.
					</motion.p>

					<div className='flex flex-col sm:flex-row gap-4 justify-center pt-6'>
						<Link
							href='/login'
							className='px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition'
						>
							Masuk Sistem
						</Link>

						<Link
							href='/ambil-antrian'
							className='px-8 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition'
						>
							Ambil Nomor
						</Link>
					</div>
				</div>
			</section>

			{/* ================= TENTANG ================= */}
			<section
				id='Tentang'
				className='py-28 px-6 bg-white'
			>
				<div className='max-w-4xl mx-auto text-center'>
					<motion.h2
						{...fadeUp}
						viewport={{ once: true }}
						className='text-3xl md:text-4xl font-bold mb-6'
					>
						Tentang Sistem
					</motion.h2>

					<p className='text-slate-600 leading-relaxed text-lg'>
						Sistem ini dirancang untuk menghadirkan pengalaman antrian yang tertib, transparan, dan
						efisien. Cocok untuk rumah sakit, klinik, kantor pemerintahan, hingga institusi
						pelayanan publik.
					</p>
				</div>
			</section>

			{/* ================= FITUR ================= */}
			<section
				id='Fitur'
				className='py-28 px-6 bg-slate-50'
			>
				<div className='max-w-6xl mx-auto text-center'>
					<h2 className='text-3xl md:text-4xl font-bold mb-4'>Fitur Unggulan</h2>
					<p className='text-slate-500 max-w-xl mx-auto mb-16'>
						Dirancang untuk memberikan performa optimal dan kemudahan penggunaan.
					</p>

					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
						{[
							{
								icon: <FiUsers />,
								title: 'Manajemen Antrian',
								desc: 'Nomor otomatis & terstruktur.',
							},
							{ icon: <FiMonitor />, title: 'Display Realtime', desc: 'Update langsung & akurat.' },
							{ icon: <FiClock />, title: 'Estimasi Waktu', desc: 'Perkiraan waktu tunggu jelas.' },
							{ icon: <FiBell />, title: 'Panggilan Otomatis', desc: 'Notifikasi suara & visual.' },
							{
								icon: <FiCheckCircle />,
								title: 'Status Layanan',
								desc: 'Pantau progres secara realtime.',
							},
							{
								icon: <FiZap />,
								title: 'Efisiensi Tinggi',
								desc: 'Proses cepat & minim kesalahan.',
							},
						].map((item) => (
							<motion.div
								key={item.title}
								{...fadeUp}
								viewport={{ once: true }}
								whileHover={{ y: -8 }}
								className='group p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 text-left'
							>
								<div className='w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition'>
									{item.icon}
								</div>

								<h3 className='font-semibold text-lg mb-2'>{item.title}</h3>
								<p className='text-sm text-slate-600 leading-relaxed'>{item.desc}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ================= ALUR ================= */}
			<section
				id='Alur'
				className='py-28 px-6 bg-white'
			>
				<div className='max-w-5xl mx-auto text-center'>
					<h2 className='text-3xl md:text-4xl font-bold mb-16'>Alur Sistem</h2>

					<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8'>
						{['Ambil Nomor', 'Tunggu Panggilan', 'Menuju Loket', 'Selesai'].map((step, i) => (
							<motion.div
								key={step}
								{...fadeUp}
								viewport={{ once: true }}
								className='relative p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition'
							>
								<div className='w-12 h-12 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-md'>
									{i + 1}
								</div>

								<p className='font-medium text-slate-700'>{step}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ================= CTA ================= */}
			<section className='py-28 px-6 bg-linear-to-r from-blue-600 to-blue-700 text-white text-center'>
				<h2 className='text-3xl md:text-4xl font-bold mb-6'>Siap Menggunakan Sistem Ini?</h2>

				<p className='max-w-xl mx-auto mb-10 text-blue-100 text-lg'>
					Tingkatkan kualitas pelayanan dengan sistem antrian digital yang modern dan profesional.
				</p>

				<Link
					href='/register'
					className='inline-block px-10 py-4 rounded-xl bg-white text-blue-600 font-semibold shadow-lg hover:scale-105 transition'
				>
					Mulai Sekarang
				</Link>
			</section>
		</div>
	);
}
