// src/hooks/useQueues.ts
import { useEffect, useState, useCallback, useRef } from 'react';

import { getQueues } from '@/services/queue.api';
import type { QueueListResponse } from '@/modules/queue/queue.types';

export function useQueues({ enabled = true }: { enabled?: boolean }) {
	const [list, setList] = useState<QueueListResponse>([]);
	const [loading, setLoading] = useState(false);

	const mountedRef = useRef(true);

	const refresh = useCallback(async () => {
		if (!enabled) return;

		setLoading(true);

		try {
			const data = await getQueues();

			// hanya update state jika component masih mounted
			if (mountedRef.current && Array.isArray(data)) {
				setList(data);
			}
		} catch {
			// ❗ sengaja DIABAIKAN
			// frontend UI tidak perlu tahu error API
			// list dibiarkan apa adanya
		} finally {
			if (mountedRef.current) {
				setLoading(false);
			}
		}
	}, [enabled]);

	useEffect(() => {
		mountedRef.current = true;

		if (enabled) refresh();

		return () => {
			mountedRef.current = false;
		};
	}, [enabled, refresh]);

	return {
		list,
		loading,
		refresh,
	};
}
