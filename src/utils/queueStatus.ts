// src/utils/queueStatus.ts
import { QueueStatus } from '@/types/enums';

export const queueStatusBadge: Record<
	QueueStatus,
	{ label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' }
> = {
	[QueueStatus.MENUNGGU]: {
		label: 'Menunggu',
		variant: 'default',
	},
	[QueueStatus.DIPANGGIL]: {
		label: 'Dipanggil',
		variant: 'primary',
	},
	[QueueStatus.SELESAI]: {
		label: 'Selesai',
		variant: 'success',
	},
	[QueueStatus.BATAL]: {
		label: 'Dibatalkan',
		variant: 'danger',
	},
};
