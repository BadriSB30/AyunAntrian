// src/hooks/useCreateShiftTemplate.ts
import { useState } from 'react';

import { createShift } from '@/services/shift.api';
import type { CreateShiftDTO } from '@/modules/shift/shift.types';

export function useCreateShiftTemplate(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const submit = async (payload: CreateShiftDTO) => {
		try {
			setLoading(true);
			await createShift(payload);
			onSuccess?.();
		} finally {
			setLoading(false);
		}
	};

	return { submit, loading };
}
