// src/hooks/useCounters.ts
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

import { getCounters } from '@/services/counter.api';
import type { CounterListResponse } from '@/modules/counter/counter.types';

export function useCounters() {
	const [list, setList] = useState<CounterListResponse>([]);
	const [loading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getCounters();
			setList(data);
		} catch (error) {
			console.error('[useCounters]', error);
			toast.error('Gagal memuat daftar loket');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return {
		list,
		loading,
		refresh,
	};
}
