// src/hooks/useUpdateQueue.ts
import { useCallback, useState } from 'react';
import { updateQueue } from '@/services/queue.api';
import type { UpdateQueueDTO } from '@/modules/queue/queue.types';

export function useUpdateQueue(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const submit = useCallback(
		async (id: number, data: UpdateQueueDTO) => {
			try {
				setLoading(true);
				await updateQueue(id, data);
				onSuccess?.();
			} catch {
				// ⛔ sengaja DIAM — error sudah ditampilkan via toast
			} finally {
				setLoading(false);
			}
		},
		[onSuccess],
	);

	return { submit, loading };
}
