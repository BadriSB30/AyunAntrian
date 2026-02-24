// src/hooks/useDeleteCounter.ts
import { useCallback, useState } from 'react';
import { deleteCounter } from '@/services/counter.api';

export function useDeleteCounter(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const remove = useCallback(
		async (id: number) => {
			try {
				setLoading(true);
				await deleteCounter(id);
				onSuccess?.();
			} finally {
				setLoading(false);
			}
		},
		[onSuccess],
	);

	return { remove, loading };
}
