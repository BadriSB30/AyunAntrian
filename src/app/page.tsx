'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUsers, FiMonitor, FiClock, FiBell, FiCheckCircle, FiZap } from 'react-icons/fi';

const fadeUp = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.6 },
	viewport: { once: true },
};

export default function LandingPage() {
	return (
		<div className='scroll-smooth overflow-x-hidden bg-[#F8FBFA] text-[#1F2D2B]'>
			{/* ================= HERO ================= */}
			<section
				id='Beranda'
				className='scroll-mt-24 relative min-h-screen flex items-center justify-center px-6 py-28 bg-linear-to-br from-emerald-600/10 via-white to-emerald-600/10'
			>
				<div className='max-w-5xl mx-auto text-center space-y-8'>
					<motion.h1
						{...fadeUp}
						className='text-4xl md:text-6xl font-extrabold tracking-tight'
					>
						Sistem Antrian
						<span className='block text-emerald-600'>Loket Pendaftaran Digital</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						viewport={{ once: true }}
						className='text-lg md:text-xl max-w-3xl mx-auto text-gray-600'
					>
						Kelola antrian pendaftaran secara realtime, tertib, dan efisien. Mengurangi kerumunan,
						meningkatkan pelayanan, dan transparan bagi pengguna.
					</motion.p>

					<div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
						<Link
							href='/login'
							className='px-8 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-500 transition'
						>
							Masuk Sistem
						</Link>

						<Link
							href='/ambil-antrian'
							className='px-8 py-3 rounded-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition'
						>
							Ambil Antrian
						</Link>
					</div>
				</div>
			</section>

			{/* ================= TENTANG ================= */}
			<section
				id='Tentang'
				className='scroll-mt-24 py-24 px-6 bg-white'
			>
				<div className='max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center'>
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
					>
						<h2 className='text-3xl md:text-4xl font-bold mb-4'>Masalah Antrian Konvensional</h2>
						<p className='text-gray-600 leading-relaxed'>
							Antrian manual menyebabkan ketidakteraturan, waktu tunggu panjang, serta kurangnya
							transparansi bagi pengunjung dan petugas loket.
						</p>
					</motion.div>

					<div className='grid sm:grid-cols-2 gap-4'>
						{[
							'Penumpukan antrian',
							'Tidak ada estimasi waktu',
							'Panggilan manual',
							'Kurang transparan',
						].map((item) => (
							<motion.div
								key={item}
								{...fadeUp}
								className='p-5 rounded-xl border bg-gray-50 hover:shadow transition'
							>
								{item}
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ================= FITUR ================= */}
			<section
				id='Fitur'
				className='scroll-mt-24 py-24 px-6 bg-[#F8FBFA]'
			>
				<div className='max-w-7xl mx-auto text-center'>
					<h2 className='text-3xl md:text-4xl font-bold mb-12'>Fitur Unggulan Sistem</h2>

					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
						{[
							{
								icon: <FiUsers />,
								title: 'Manajemen Antrian',
								desc: 'Pengambilan nomor antrian otomatis.',
							},
							{
								icon: <FiMonitor />,
								title: 'Display Antrian',
								desc: 'Tampilan nomor antrian realtime.',
							},
							{
								icon: <FiClock />,
								title: 'Estimasi Waktu',
								desc: 'Perkiraan waktu tunggu akurat.',
							},
							{
								icon: <FiBell />,
								title: 'Panggilan Otomatis',
								desc: 'Suara & visual pemanggilan loket.',
							},
							{
								icon: <FiCheckCircle />,
								title: 'Status Layanan',
								desc: 'Pantau antrian berjalan & selesai.',
							},
							{ icon: <FiZap />, title: 'Pelayanan Cepat', desc: 'Efisien & minim kesalahan.' },
						].map((item) => (
							<motion.div
								key={item.title}
								{...fadeUp}
								whileHover={{ y: -6 }}
								className='p-6 rounded-2xl bg-white border shadow-sm hover:shadow-md transition text-left'
							>
								<div className='text-emerald-600 text-3xl mb-4'>{item.icon}</div>
								<h3 className='text-lg font-semibold mb-2'>{item.title}</h3>
								<p className='text-gray-600 text-sm'>{item.desc}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ================= ALUR ================= */}
			<section
				id='Alur'
				className='scroll-mt-24 py-24 px-6 bg-white'
			>
				<div className='max-w-6xl mx-auto'>
					<h2 className='text-3xl md:text-4xl font-bold mb-12 text-center'>Alur Sistem Antrian</h2>

					<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
						{[
							'Ambil Nomor Antrian',
							'Tunggu Panggilan',
							'Dipanggil ke Loket',
							'Pelayanan Selesai',
						].map((step, i) => (
							<motion.div
								key={step}
								{...fadeUp}
								className='p-6 rounded-xl border bg-gray-50'
							>
								<p className='text-emerald-600 font-semibold mb-1'>Step {i + 1}</p>
								<p className='font-medium'>{step}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ================= CTA ================= */}
			<section className='py-28 px-6 bg-linear-to-br from-emerald-600 to-emerald-700 text-white text-center'>
				<h2 className='text-3xl md:text-4xl font-extrabold mb-4'>
					Siap Tingkatkan Pelayanan Loket?
				</h2>
				<p className='max-w-2xl mx-auto mb-8 text-emerald-100'>
					Gunakan sistem antrian digital untuk pelayanan lebih cepat, tertib, dan profesional.
				</p>

				<Link
					href='/register'
					className='inline-block px-10 py-4 rounded-full bg-white text-emerald-700 font-bold shadow hover:scale-105 transition'
				>
					Mulai Sekarang
				</Link>
			</section>
		</div>
	);
}
