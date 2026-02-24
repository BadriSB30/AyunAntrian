// src/hooks/queue/useQueueAdmin.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getQueuesByAdmin } from '@/services/queue.api';
import type { QueueListResponse } from '@/modules/queue/queue.types';

export function useQueuesAdmin({ enabled = true }: { enabled?: boolean }) {
	const [list, setList] = useState<QueueListResponse>([]);
	const [loading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		if (!enabled) return;

		try {
			setLoading(true);
			const data = await getQueuesByAdmin();
			setList(data);
		} catch (err) {
			console.error('[useQueuesAdmin]', err);
			toast.error('Gagal memuat daftar antrian');
		} finally {
			setLoading(false);
		}
	}, [enabled]);

	useEffect(() => {
		if (enabled) refresh();
	}, [enabled, refresh]);

	return { list, loading, refresh };
}
