// src/hooks/queue/count/useQueueCount.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getQueueCount } from '@/services/queue.api';
import type { QueueCountResult } from '@/modules/queue/queue.repository';

export function useQueueCount({ enabled = true }: { enabled?: boolean } = {}) {
	const [data, setData] = useState<QueueCountResult | null>(null);
	const [loading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		if (!enabled) return;

		try {
			setLoading(true);
			const res = await getQueueCount();
			setData(res);
		} catch (err) {
			console.error('[useQueueCount]', err);
			toast.error('Gagal memuat statistik antrian');
		} finally {
			setLoading(false);
		}
	}, [enabled]);

	useEffect(() => {
		if (enabled) refresh();
	}, [enabled, refresh]);

	return { data, loading, refresh };
}
