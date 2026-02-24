import type { Hari } from '@/types/enums';

export interface WeeklyShiftTemplateEntity {
	id: number;
	hari: Hari;

	// Foreign Keys
	counter_id: number;
	admin_id: number;
	shift_id: number;

	// Relations
	counter: {
		id: number;
		kode_loket: string;
		nama_loket: string;
	};

	admin: {
		id: number;
		nama: string;
	};

	shift: {
		id: number;
		nama_shift: string;
		jam_mulai: string;
		jam_selesai: string;
	};
}
