// src/hooks/queue/useQueueStatus.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { getQueueStatus } from '@/services/queue.api';
import type { QueueListResponse } from '@/modules/queue/queue.types';

const POLL_INTERVAL_MS = 3000;
export const QUEUE_BROADCAST_CHANNEL = 'queue_status_update';

export function useQueueStatus({ enabled = true }: { enabled?: boolean }) {
	const [list, setList] = useState<QueueListResponse>([]);
	const [loading, setLoading] = useState(false);
	const mountedRef = useRef(true);

	const refresh = useCallback(async () => {
		if (!enabled) return;
		setLoading(true);
		try {
			const data = await getQueueStatus();
			if (mountedRef.current && Array.isArray(data)) {
				setList(data);
			}
		} catch {
			// diabaikan
		} finally {
			if (mountedRef.current) setLoading(false);
		}
	}, [enabled]);

	useEffect(() => {
		mountedRef.current = true;
		if (!enabled) return;

		refresh();
		const intervalId = setInterval(refresh, POLL_INTERVAL_MS);

		// ✅ Dengarkan broadcast dari tab admin saat tombol panggil diklik
		let bc: BroadcastChannel | null = null;
		try {
			bc = new BroadcastChannel(QUEUE_BROADCAST_CHANNEL);
			bc.onmessage = () => {
				// Langsung refresh tanpa menunggu interval berikutnya
				refresh();
			};
		} catch {
			// BroadcastChannel tidak tersedia (SSR / browser lama)
		}

		return () => {
			mountedRef.current = false;
			clearInterval(intervalId);
			bc?.close();
		};
	}, [enabled, refresh]);

	return { list, loading, refresh };
}
