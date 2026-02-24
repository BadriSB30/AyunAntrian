// src/hooks/useWeeklyShiftTemplateDetail.ts
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { getWeeklyShiftTemplateById } from '@/services/weekly.api';
import type { WeeklyShiftTemplateResponse } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.types';

export function useWeeklyShiftTemplateDetail() {
	const [data, setData] = useState<WeeklyShiftTemplateResponse | null>(null);
	const [loading, setLoading] = useState(false);

	const open = useCallback(async (id: number) => {
		try {
			setLoading(true);
			const res = await getWeeklyShiftTemplateById(id);
			setData(res);
		} catch {
			toast.error('Gagal memuat detail weekly shift');
		} finally {
			setLoading(false);
		}
	}, []);

	const close = () => setData(null);

	return { data, loading, open, close };
}
