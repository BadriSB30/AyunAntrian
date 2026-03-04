'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

import { StatCard } from '@/components/ui/StatCard';
import { BarChart } from '@/components/ui/Barchart';
import { PieChart } from '@/components/ui/Piechart';

import { Role } from '@/types/enums';

import { useQueueCount } from '@/hooks/queue/count/useQueueCount';
import { useQueueCountAdmin } from '@/hooks/queue/count/useQueueCountAdmin';

export default function DashboardPage() {
	const { data: session } = useSession();
	const role = session?.user?.role;

	const { data: superadminCount, loading: loadingSuperadmin } = useQueueCount({
		enabled: role === Role.SUPERADMIN,
	});

	const { data: adminCount, loading: loadingAdmin } = useQueueCountAdmin({
		enabled: role === Role.ADMIN,
	});

	const stat = role === Role.ADMIN ? adminCount : superadminCount;

	const loading = loadingSuperadmin || loadingAdmin;

	/* ================= CHART DATA ================= */

	const chartData = stat
		? [
				{
					label: 'Menunggu',
					value: stat.menunggu,
					color: '#fbbf24',
				},
				{
					label: 'Dipanggil',
					value: stat.dipanggil,
					color: '#2563eb',
				},
				{
					label: 'Selesai',
					value: stat.selesai,
					color: '#16a34a',
				},
				{
					label: 'Batal',
					value: stat.batal,
					color: '#dc2626',
				},
			]
		: [];

	return (
		<div className='min-h-screen bg-slate-50 p-6 md:p-10'>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className='mx-auto max-w-7xl space-y-8'
			>
				{/* ================= HEADER ================= */}
				<header>
					<h1 className='text-3xl font-bold tracking-tight text-slate-800'>Dashboard</h1>
					<p className='text-sm text-slate-500'>Ringkasan statistik antrian total seluruh waktu</p>
				</header>
				{/* ================= LOADING STATISTIK DASHBOARD ================= */}
				{loading && (
					<div className='flex items-center justify-center p-10'>
						<div className='flex flex-col items-center gap-3'>
							<div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600' />
							<p className='text-sm text-gray-500'>Memuat data statistik...</p>
						</div>
					</div>
				)}
				{/* ================= STAT CARDS ================= */}
				{!loading && stat && (
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
						<StatCard
							label='Total Antrian'
							value={stat.total}
							badge={{
								text: 'ALL',
								variant: 'primary',
							}}
						/>
						<StatCard
							label='Menunggu'
							value={stat.menunggu}
							badge={{
								text: 'WAITING',
								variant: 'warning',
							}}
						/>
						<StatCard
							label='Dipanggil'
							value={stat.dipanggil}
							badge={{
								text: 'CALLING',
								variant: 'primary',
							}}
						/>
						<StatCard
							label='Selesai'
							value={stat.selesai}
							badge={{
								text: 'DONE',
								variant: 'success',
							}}
						/>
						<StatCard
							label='Batal'
							value={stat.batal}
							badge={{
								text: 'CANCEL',
								variant: 'danger',
							}}
						/>
					</div>
				)}
				{/* ================= CHART SECTION ================= */}
				{!loading && stat && (
					<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
						{/* PIE CHART */}
						<div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
							<h2 className='mb-4 text-base font-semibold text-slate-800'>Komposisi Antrian</h2>
							<PieChart data={chartData} />
						</div>

						{/* BAR CHART */}
						<div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2'>
							<h2 className='mb-4 text-base font-semibold text-slate-800'>
								Distribusi Status Antrian
							</h2>
							<BarChart data={chartData} />
						</div>
					</div>
				)}
				{/* ================= EMPTY STATE ================= */}
				{!loading && !stat && (
					<div className='rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm'>
						<p className='text-slate-500'>Tidak ada data statistik</p>
					</div>
				)}
			</motion.div>
		</div>
	);
}
