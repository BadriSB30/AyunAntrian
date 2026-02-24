// src/hooks/useShiftsTemplate.ts
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

import { getShifts } from '@/services/shift.api';
import type { ShiftListResponse } from '@/modules/shift/shift.types';

export function useShiftTemplate() {
	const [list, setList] = useState<ShiftListResponse>([]);
	const [loading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getShifts();
			setList(data);
		} catch (error) {
			console.error('[useShiftsTemplate]', error);
			toast.error('Gagal memuat daftar shift');
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
