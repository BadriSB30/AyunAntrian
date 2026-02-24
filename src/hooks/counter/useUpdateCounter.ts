// src/hooks/useUpdateCounter.ts
import { useCallback, useState } from 'react';
import { updateCounter } from '@/services/counter.api';
import type { UpdateCounterDTO } from '@/modules/counter/counter.types';

export function useUpdateCounter(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const submit = useCallback(
		async (id: number, data: UpdateCounterDTO) => {
			try {
				setLoading(true);
				await updateCounter(id, data);
				onSuccess?.();
			} finally {
				setLoading(false);
			}
		},
		[onSuccess]
	);

	return { submit, loading };
}
