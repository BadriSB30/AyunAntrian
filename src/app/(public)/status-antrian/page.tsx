'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueueStatus } from '@/hooks/queue/useQueueStatus';
import { formatDate } from '@/utils/date';
import { Badge } from '@/components/ui/Badge';
import { queueStatusBadge } from '@/utils/queueStatus';
import { TVOnlyGuard } from '@/components/layout/TVOnlyGuard';
import { QueueStatus } from '@/types/enums';

interface CounterOption {
	id: number;
	nama: string;
}

export default function StatusAntrianTV() {
	const { list, loading } = useQueueStatus({ enabled: true });
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const [selectedCounterId, setSelectedCounterId] = useState<number | null>(null);

	/* ================= FULLSCREEN ================= */
	const [isFullscreen, setIsFullscreen] = useState(false);
	useEffect(() => {
		const onChange = () => setIsFullscreen(!!document.fullscreenElement);
		document.addEventListener('fullscreenchange', onChange);
		return () => document.removeEventListener('fullscreenchange', onChange);
	}, []);

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	};

	/* ================= COUNTER LIST ================= */
	const counters: CounterOption[] = useMemo(() => {
		const map = new Map<number, string>();
		list.forEach((q) => {
			if (q.counter_id && q.nama_loket) {
				map.set(q.counter_id, q.nama_loket);
			}
		});
		return Array.from(map.entries()).map(([id, nama]) => ({ id, nama }));
	}, [list]);

	const activeCounterId = selectedCounterId ?? counters[0]?.id ?? null;
	const activeCounterName = counters.find((c) => c.id === activeCounterId)?.nama ?? '';

	/* ================= FILTER ================= */
	const filteredQueues = useMemo(() => {
		if (!activeCounterId) return [];
		return list.filter((q) => q.counter_id === activeCounterId);
	}, [list, activeCounterId]);

	/* ================= CURRENTLY CALLED QUEUE ================= */
	// Gunakan QueueStatus.DIPANGGIL (enum) agar cocok dengan nilai yang diset
	// di halaman antrian saat tombol panggil ditekan
	const calledQueue = useMemo(() => {
		const called = filteredQueues
			.filter((q) => q.status === QueueStatus.DIPANGGIL)
			.sort((a, b) => {
				const aTime = new Date(a.waktu_panggil ?? a.waktu_ambil).getTime();
				const bTime = new Date(b.waktu_panggil ?? b.waktu_ambil).getTime();
				return bTime - aTime; // ambil yang paling baru
			});

		return called[0] ?? null;
	}, [filteredQueues]);

	/* ================= AUTO SCROLL ================= */
	useEffect(() => {
		const el = scrollRef.current;
		if (!el || filteredQueues.length === 0) return;
		let rafId: number;
		let direction: 'down' | 'up' = 'down';
		const step = () => {
			el.scrollTop += direction === 'down' ? 0.6 : -0.6;
			if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) direction = 'up';
			if (el.scrollTop <= 0) direction = 'down';
			rafId = requestAnimationFrame(step);
		};
		rafId = requestAnimationFrame(step);
		return () => cancelAnimationFrame(rafId);
	}, [filteredQueues, isFullscreen]);

	const isEmptyToday = !loading && list.length === 0;
	const isEmptyCounter = !loading && activeCounterId !== null && filteredQueues.length === 0;

	return (
		<TVOnlyGuard>
			<div
				className={`
					bg-gray-100 flex flex-col
					${isFullscreen ? 'fixed inset-0 w-screen h-screen overflow-hidden' : 'min-h-screen'}
				`}
			>
				{/* HEADER */}
				<div className='flex items-center justify-between px-10 py-5 bg-white shadow-sm border-b border-gray-200'>
					<div className='flex items-center gap-4'>
						<span className='text-4xl'>📺</span>
						<h1 className='text-3xl font-extrabold text-gray-800'>Status Antrian</h1>
					</div>
					<div className='flex items-center gap-6'>
						{counters.length > 0 && (
							<div className='flex items-center gap-3'>
								<label className='text-lg font-semibold text-gray-600'>Loket:</label>
								<select
									value={activeCounterId ?? ''}
									onChange={(e) => setSelectedCounterId(Number(e.target.value))}
									className='rounded-xl border border-gray-300 px-4 py-2 text-lg font-bold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
								>
									{counters.map((c) => (
										<option
											key={c.id}
											value={c.id}
										>
											{c.nama}
										</option>
									))}
								</select>
							</div>
						)}
						<button
							onClick={toggleFullscreen}
							className='rounded-xl bg-gray-800 text-white px-5 py-2 text-lg font-semibold hover:bg-gray-700 transition-colors'
						>
							{isFullscreen ? '⛶ Keluar' : '⛶ Fullscreen'}
						</button>
					</div>
				</div>

				{/* MAIN CONTENT */}
				<div className='flex flex-1 overflow-hidden'>
					{/* ===== LEFT PANEL: CURRENTLY CALLED ===== */}
					<div className='w-2/5 flex flex-col items-center justify-center bg-linear-to-br from-blue-600 to-blue-800 p-10 relative overflow-hidden'>
						<div className='absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5' />
						<div className='absolute -bottom-15 -right-15 w-56 h-56 rounded-full bg-white/5' />

						<p className='text-white/70 text-2xl font-semibold uppercase tracking-widest mb-4'>
							Sedang Dipanggil
						</p>

						{!calledQueue ? (
							<div className='text-center'>
								<p className='text-white/50 text-5xl font-bold'>—</p>
								<p className='text-white/40 text-xl mt-4'>
									{isEmptyToday ? 'Belum ada antrian hari ini' : 'Belum ada yang dipanggil'}
								</p>
							</div>
						) : (
							<AnimatePresence mode='wait'>
								<motion.div
									key={`${calledQueue.id}-${calledQueue.status}`} // ✅ bukan hanya calledQueue.id
									initial={{ scale: 0.7, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ scale: 1.1, opacity: 0 }}
									transition={{ type: 'spring', stiffness: 200, damping: 18 }}
									className='text-center'
								>
									<div className='bg-white rounded-3xl px-14 py-10 shadow-2xl mb-6 min-w-65'>
										<p className='text-8xl font-black text-blue-700 tracking-tight leading-none'>
											{calledQueue.nomor_antrian}
										</p>
									</div>

									<p className='text-white text-2xl font-bold mb-2'>{activeCounterName}</p>

									{(() => {
										const status = queueStatusBadge[calledQueue.status];
										return (
											<Badge
												variant={status.variant}
												size='lg'
												className='text-xl px-6 py-2 bg-white/20 text-white border-white/30'
											>
												{status.label}
											</Badge>
										);
									})()}

									<p className='text-white/50 text-lg mt-4'>
										{formatDate(calledQueue.waktu_ambil, true)}
									</p>
								</motion.div>
							</AnimatePresence>
						)}
					</div>

					{/* ===== RIGHT PANEL: QUEUE LIST ===== */}
					<div className='w-3/5 flex flex-col'>
						<div className='px-8 py-5 bg-white border-b border-gray-200'>
							<h2 className='text-2xl font-bold text-gray-700'>
								Daftar Antrian
								{activeCounterName && (
									<span className='text-blue-600 ml-2'>— {activeCounterName}</span>
								)}
							</h2>
						</div>

						<div
							ref={scrollRef}
							className='flex-1 overflow-hidden px-8 py-6'
						>
							{isEmptyToday && (
								<div className='h-full flex items-center justify-center'>
									<p className='text-3xl font-semibold text-gray-400'>Belum ada antrian hari ini</p>
								</div>
							)}

							{!isEmptyToday && isEmptyCounter && (
								<div className='h-full flex items-center justify-center'>
									<p className='text-3xl font-semibold text-gray-400 text-center'>
										Tidak ada antrian di{' '}
										<strong className='text-gray-600'>{activeCounterName}</strong>
									</p>
								</div>
							)}

							<AnimatePresence>
								{filteredQueues.map((q) => {
									const status = queueStatusBadge[q.status];
									const isActive = calledQueue?.id === q.id;

									return (
										<motion.div
											key={q.id}
											initial={{ opacity: 0, x: 30 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0 }}
											className={`
				rounded-2xl p-6 mb-4 shadow-md flex justify-between items-center border-2 transition-all
				${isActive ? 'bg-blue-50 border-blue-400 shadow-blue-100' : 'bg-white border-transparent'}
			`}
										>
											<div className='flex items-center gap-5'>
												<div
													className={`w-3 h-3 rounded-full shrink-0 ${
														isActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'
													}`}
												/>

												<div>
													<p
														className={`text-3xl font-extrabold ${
															isActive ? 'text-blue-700' : 'text-gray-800'
														}`}
													>
														Antrian {q.nomor_antrian}
													</p>

													<p className='text-base text-gray-400 mt-1'>
														{formatDate(q.waktu_ambil, true)}
													</p>
												</div>
											</div>

											<Badge
												variant={status.variant}
												size='lg'
												className='text-xl px-6 py-2'
											>
												{status.label}
											</Badge>
										</motion.div>
									);
								})}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>
		</TVOnlyGuard>
	);
}
