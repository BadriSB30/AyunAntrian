// src/hooks/useUpdateShift.ts
import { useCallback, useState } from 'react';
import { updateShift } from '@/services/shift.api';
import type { UpdateShiftDTO } from '@/modules/shift/shift.types';

export function useUpdateShiftTemplate(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const submit = useCallback(
		async (id: number, data: UpdateShiftDTO) => {
			try {
				setLoading(true);
				await updateShift(id, data);
				onSuccess?.();
			} finally {
				setLoading(false);
			}
		},
		[onSuccess]
	);

	return { submit, loading };
}
