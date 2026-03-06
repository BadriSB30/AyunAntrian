'use client';

import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';

import { useWeeklyShiftAssignment } from '@/hooks/weeklyShiftTemplate/useWeeklyShiftAssigntment';
import { useCreateQueue } from '@/hooks/queue/useCreateQueue';

export default function Page() {
	const { list, loading: loadingShift } = useWeeklyShiftAssignment();
	const { submit, loading } = useCreateQueue();

	/* =========================================================
	   Loading State
	========================================================= */
	if (loadingShift) {
		return (
			<div className='flex min-h-[60vh] items-center justify-center'>
				<div className='flex flex-col items-center gap-4 text-gray-500'>
					<div className='flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50'>
						<FiLoader className='h-6 w-6 animate-spin text-emerald-600' />
					</div>
					<p className='text-sm font-medium'>Memuat data loket antrian...</p>
				</div>
			</div>
		);
	}

	/* =========================================================
	   Empty State
	========================================================= */
	if (!list || list.length === 0) {
		return (
			<div className='flex min-h-[60vh] flex-col items-center justify-center px-6 text-center'>
				<div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
					<FiAlertCircle className='h-8 w-8 text-gray-400' />
				</div>

				<h2 className='text-xl font-semibold text-gray-700'>Tidak ada loket antrian tersedia</h2>

				<p className='mt-2 max-w-sm text-sm text-gray-500'>
					Saat ini belum ada loket aktif untuk mengambil nomor antrian. Silakan hubungi petugas atau
					coba kembali beberapa saat lagi.
				</p>
			</div>
		);
	}

	/* =========================================================
	   Render
	========================================================= */
	return (
		<div className='mx-auto max-w-7xl p-6 lg:p-10'>
			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
				{list.map((item) => {
					const isLoading = loading === item.counter_id;

					return (
						<motion.button
							key={item.id}
							whileHover={{ y: -6, scale: 1.03 }}
							whileTap={{ scale: 0.96 }}
							disabled={isLoading}
							onClick={async () => {
								const q = await submit({
									counter_id: item.counter_id,
									admin_id: item.admin_id,
									shift_id: item.shift_id,
								});

								if (!q) {
									toast.error('Gagal mengambil nomor antrian');
									return;
								}

								toast.success(
									<div className='flex flex-col gap-1'>
										<span className='text-sm font-medium'>Nomor Antrian Anda</span>

										<span className='text-3xl font-bold tracking-widest text-emerald-600'>
											{q.nomor_antrian}
										</span>

										<span className='text-xs text-gray-500'>
											{item.counter.nama_loket} · Shift {item.shift.nama_shift}
										</span>
									</div>,
									{ duration: 6000 },
								);
							}}
							className={`
                group relative flex flex-col justify-between
                rounded-2xl
                bg-linear-to-br from-emerald-500 to-emerald-700
                p-7 text-white
                shadow-lg
                transition-all duration-300
                hover:shadow-2xl
                disabled:cursor-not-allowed
                disabled:opacity-60
              `}
						>
							{/* Header */}
							<div className='flex flex-col gap-3'>
								<span className='text-2xl font-bold tracking-wide'>{item.counter.nama_loket}</span>

								<div className='flex flex-wrap gap-2'>
									<span className='rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide backdrop-blur'>
										Shift {item.shift.nama_shift}
									</span>

									<span className='rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide backdrop-blur'>
										{item.admin.nama}
									</span>
								</div>
							</div>

							{/* Footer */}
							<div className='mt-6 flex items-center justify-between'>
								<span className='text-sm text-white/80'>Ambil Antrian</span>

								{isLoading && <FiLoader className='h-5 w-5 animate-spin text-white' />}
							</div>

							{/* Glow Effect */}
							<div className='pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100'>
								<div className='absolute inset-0 rounded-2xl bg-white/10 blur-xl' />
							</div>
						</motion.button>
					);
				})}
			</div>
		</div>
	);
}
