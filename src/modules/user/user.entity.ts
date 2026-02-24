// modules/user/user.entity.ts
import { Role, UserStatus } from '@/types/enums';

export interface UserEntity {
	id: number;
	nama: string;
	username: string;
	email: string;
	password: string;
	role: Role;
	status: UserStatus;
	created_at: Date;
}
