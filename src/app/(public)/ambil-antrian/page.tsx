'use client';

import { toast } from 'sonner';
import { useWeeklyShiftAssignment } from '@/hooks/weeklyShiftTemplate/useWeeklyShiftAssigntment';
import { useCreateQueue } from '@/hooks/queue/useCreateQueue';
import { motion } from 'framer-motion';

export default function Page() {
	const { list, loading: loadingShift } = useWeeklyShiftAssignment();
	const { submit, loading } = useCreateQueue();

	/* ================= LOADING ================= */
	if (loadingShift) {
		return (
			<div className='flex min-h-[60vh] items-center justify-center'>
				<p className='text-center text-gray-500 text-lg animate-pulse'>Memuat loket...</p>
			</div>
		);
	}

	/* ================= EMPTY STATE ================= */
	if (!list || list.length === 0) {
		return (
			<div className='flex min-h-[60vh] flex-col items-center justify-center text-center px-6'>
				<h2 className='text-2xl font-semibold text-gray-700'>
					Tidak ada loket antrian yang tersedia
				</h2>
				<p className='mt-3 text-gray-500 text-sm max-w-xs'>
					Silakan hubungi petugas atau coba kembali nanti.
				</p>
			</div>
		);
	}

	/* ================= CONTENT ================= */
	return (
		<div className='p-6 lg:p-10'>
			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{list.map((item) => {
					const isLoading = loading === item.counter_id;

					return (
						<motion.button
							key={item.id}
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							onClick={async () => {
								const q = await submit({
									counter_id: item.counter_id,
									admin_id: item.admin_id,
									shift_id: item.shift_id,
								});

								if (!q) {
									toast.error('Gagal mengambil antrian');
									return;
								}

								toast.success(`Nomor antrian Anda: ${q.nomor_antrian}`);
							}}
							disabled={isLoading}
							className={`
                relative flex flex-col justify-between
                rounded-3xl bg-emerald-600 p-8
                text-white shadow-lg
                transition-all duration-200
                hover:shadow-xl hover:bg-emerald-700
                disabled:cursor-not-allowed disabled:opacity-60
              `}
						>
							<div className='flex flex-col gap-3'>
								<span className='text-2xl font-bold'>{item.counter.nama_loket}</span>
								<span className='inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider'>
									Shift: {item.shift.nama_shift}
								</span>
								<span className='inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider'>
									Admin: {item.admin.nama}
								</span>
							</div>

							{isLoading && (
								<span className='mt-4 text-sm text-white/80 animate-pulse'>
									Mengambil antrian...
								</span>
							)}
						</motion.button>
					);
				})}
			</div>
		</div>
	);
}
