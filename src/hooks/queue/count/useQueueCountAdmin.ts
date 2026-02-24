// src/hooks/queue/count/useQueueCountAdmin.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getQueueCountAdmin } from '@/services/queue.api';
import type { QueueCountResult } from '@/modules/queue/queue.repository';

export function useQueueCountAdmin({ enabled = true }: { enabled?: boolean } = {}) {
	const [data, setData] = useState<QueueCountResult | null>(null);
	const [loading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		if (!enabled) return;

		try {
			setLoading(true);
			const res = await getQueueCountAdmin();
			setData(res);
		} catch (err) {
			console.error('[useQueueCountAdmin]', err);
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
