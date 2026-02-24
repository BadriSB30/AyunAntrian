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

	const chartData = stat
		? [
				{ label: 'Menunggu', value: stat.menunggu, color: '#facc15' },
				{ label: 'Dipanggil', value: stat.dipanggil, color: '#3b82f6' },
				{ label: 'Selesai', value: stat.selesai, color: '#10b981' },
				{ label: 'Batal', value: stat.batal, color: '#ef4444' },
			]
		: [];

	return (
		<motion.div
			initial={false}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8'
		>
			<header>
				<h1 className='text-2xl font-bold text-gray-800'>Dashboard</h1>
			</header>

			{loading && <p className='text-gray-500'>Memuat statistik...</p>}

			{!loading && stat && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
					<StatCard
						label='Total Antrian'
						value={stat.total}
						badge={{ text: 'ALL', variant: 'info' }}
					/>
					<StatCard
						label='Menunggu'
						value={stat.menunggu}
						badge={{ text: 'WAITING', variant: 'warning' }}
					/>
					<StatCard
						label='Dipanggil'
						value={stat.dipanggil}
						badge={{ text: 'CALLING', variant: 'primary' }}
					/>
					<StatCard
						label='Selesai'
						value={stat.selesai}
						badge={{ text: 'DONE', variant: 'success' }}
					/>
					<StatCard
						label='Batal'
						value={stat.batal}
						badge={{ text: 'CANCEL', variant: 'danger' }}
					/>
				</div>
			)}

			{!loading && stat && (
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* PIE CHART */}
					<div className='rounded-xl border bg-white p-5 shadow-sm'>
						<h2 className='mb-4 text-base font-semibold text-gray-800'>Komposisi Antrian</h2>
						<PieChart data={chartData} />
					</div>

					{/* BAR CHART */}
					<div className='lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm'>
						<h2 className='mb-4 text-base font-semibold text-gray-800'>
							Distribusi Status Antrian
						</h2>
						<BarChart data={chartData} />
					</div>
				</div>
			)}

			{!loading && !stat && <p className='text-gray-500'>Tidak ada data statistik</p>}
		</motion.div>
	);
}
