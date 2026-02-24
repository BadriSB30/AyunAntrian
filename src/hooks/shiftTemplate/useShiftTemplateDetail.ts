// src/hooks/useShiftDetail.ts
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { getShiftById } from '@/services/shift.api';
import type { ShiftResponse } from '@/modules/shift/shift.types';

export function useShiftDetailTemplate() {
	const [data, setData] = useState<ShiftResponse | null>(null);
	const [loading, setLoading] = useState(false);

	const open = useCallback(async (id: number) => {
		try {
			setLoading(true);
			const res = await getShiftById(id);
			setData(res);
		} catch {
			toast.error('Gagal memuat detail shift');
		} finally {
			setLoading(false);
		}
	}, []);

	const close = () => setData(null);

	return { data, loading, open, close };
}
