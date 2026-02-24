// modules/counter/counter.entity.ts
import { CounterStatus } from '@/types/enums';

export interface CounterEntity {
	id: number;
	kode_loket: string;
	nama_loket: string;
	status: CounterStatus;
	created_at: Date;
}
