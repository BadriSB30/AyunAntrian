// src/hooks/useCreateCounter.ts
import { useState } from 'react';

import { createCounter } from '@/services/counter.api';
import type { CreateCounterDTO } from '@/modules/counter/counter.types';

export function useCreateCounter(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const submit = async (payload: CreateCounterDTO) => {
		try {
			setLoading(true);
			await createCounter(payload);
			onSuccess?.();
		} finally {
			setLoading(false);
		}
	};

	return { submit, loading };
}
