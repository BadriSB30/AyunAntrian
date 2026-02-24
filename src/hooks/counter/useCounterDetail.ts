// src/hooks/useCounterDetail.ts
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { getCounterById } from '@/services/counter.api';
import type { CounterResponse } from '@/modules/counter/counter.types';

export function useCounterDetail() {
	const [data, setData] = useState<CounterResponse | null>(null);
	const [loading, setLoading] = useState(false);

	const open = useCallback(async (id: number) => {
		try {
			setLoading(true);
			const res = await getCounterById(id);
			setData(res);
		} catch {
			toast.error('Gagal memuat detail loket');
		} finally {
			setLoading(false);
		}
	}, []);

	const close = () => setData(null);

	return { data, loading, open, close };
}
