// src/hooks/useDeleteQueue.ts
import { useCallback, useState } from 'react';
import { deleteQueue } from '@/services/queue.api';

export function useDeleteQueue(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const remove = useCallback(
		async (id: number) => {
			try {
				setLoading(true);
				await deleteQueue(id);
				onSuccess?.();
			} catch {
				// silent
			} finally {
				setLoading(false);
			}
		},
		[onSuccess],
	);

	return { remove, loading };
}
