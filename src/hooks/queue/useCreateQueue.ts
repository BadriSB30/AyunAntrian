// src/hooks/queue/useCreateQueue.ts
import { useState } from 'react';
import { createQueue } from '@/services/queue.api';
import type { CreateQueueDTO, QueueResponse } from '@/modules/queue/queue.types';

export function useCreateQueue() {
	const [loading, setLoading] = useState<number | null>(null);

	const submit = async (payload: CreateQueueDTO): Promise<QueueResponse | null> => {
		try {
			setLoading(payload.counter_id);
			return await createQueue(payload);
		} catch {
			return null;
		} finally {
			setLoading(null);
		}
	};

	return { submit, loading };
}
