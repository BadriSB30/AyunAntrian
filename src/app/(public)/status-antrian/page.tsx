'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useQueueStatus } from '@/hooks/queue/useQueueStatus';
import { formatDate } from '@/utils/date';
import { Badge } from '@/components/ui/Badge';
import { queueStatusBadge } from '@/utils/queueStatus';
import { TVOnlyGuard } from '@/components/layout/TVOnlyGuard';

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

	/* ================= AUTO SCROLL ================= */
	useEffect(() => {
		const el = scrollRef.current;
		if (!el || filteredQueues.length === 0) return;

		let rafId: number;
		let direction: 'down' | 'up' = 'down';

		const step = () => {
			el.scrollTop += direction === 'down' ? 0.6 : -0.6;

			if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
				direction = 'up';
			}
			if (el.scrollTop <= 0) {
				direction = 'down';
			}

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
					bg-gray-100
					${isFullscreen ? 'fixed inset-0 w-screen h-screen overflow-hidden' : 'min-h-screen px-12 py-8'}
				`}
			>
				{/* HEADER */}
				{!isFullscreen && (
					<div className='flex items-center justify-between mb-8'>
						<h1 className='text-5xl font-extrabold'>📺 Status Antrian</h1>

						<button
							onClick={toggleFullscreen}
							className='rounded-2xl bg-black text-white px-6 py-3 text-xl font-semibold'
						>
							Fullscreen
						</button>
					</div>
				)}

				{/* COUNTER SELECT */}
				{!isFullscreen && counters.length > 0 && (
					<div className='mb-10 flex items-center gap-6'>
						<label className='text-2xl font-semibold text-gray-700'>Pilih Loket</label>

						<select
							value={activeCounterId ?? ''}
							onChange={(e) => setSelectedCounterId(Number(e.target.value))}
							className='rounded-2xl border px-6 py-4 text-2xl font-bold'
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

				{/* EMPTY STATES */}
				{isEmptyToday && (
					<div className='h-full flex items-center justify-center'>
						<p className='text-4xl font-semibold text-gray-500'>Belum ada antrian hari ini</p>
					</div>
				)}

				{!isEmptyToday && isEmptyCounter && (
					<div className='h-full flex items-center justify-center'>
						<p className='text-4xl font-semibold text-gray-500'>
							Tidak ada antrian di <strong>{activeCounterName}</strong>
						</p>
					</div>
				)}

				{/* LIST */}
				{filteredQueues.length > 0 && (
					<div
						ref={scrollRef}
						className={`${isFullscreen ? 'h-screen px-16 pt-16' : 'h-[65vh]'} overflow-hidden`}
					>
						<AnimatePresence>
							{filteredQueues.map((q) => {
								const status = queueStatusBadge[q.status];

								return (
									<motion.div
										key={q.id}
										initial={{ opacity: 0, y: 30 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0 }}
										className='bg-white rounded-3xl p-10 mb-6 shadow-xl flex justify-between items-center'
									>
										<div>
											<p className='text-5xl font-extrabold'>Antrian {q.nomor_antrian}</p>
											<p className='text-2xl text-gray-500 mt-2'>
												{formatDate(q.waktu_ambil, true)}
											</p>
										</div>

										<Badge
											variant={status.variant}
											size='lg'
											className='text-3xl px-8 py-3'
										>
											{status.label}
										</Badge>
									</motion.div>
								);
							})}
						</AnimatePresence>
					</div>
				)}
			</div>
		</TVOnlyGuard>
	);
}
