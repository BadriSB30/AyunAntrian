// src/hooks/useQueueDetail.ts
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { getQueueById } from '@/services/queue.api';
import type { QueueResponse } from '@/modules/queue/queue.types';

export function useQueueDetail() {
	const [data, setData] = useState<QueueResponse | null>(null);
	const [loading, setLoading] = useState(false);

	const open = useCallback(async (id: number) => {
		try {
			setLoading(true);
			const res = await getQueueById(id);
			setData(res);
		} catch {
			toast.error('Gagal memuat detail antrian');
		} finally {
			setLoading(false);
		}
	}, []);

	const close = () => setData(null);

	return { data, loading, open, close };
}
