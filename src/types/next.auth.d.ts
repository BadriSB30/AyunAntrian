import { Role } from '@/types/enums';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
	interface Session {
		user: {
			id: number;
			nama: string;
			role: Role;
		};
	}

	interface User {
		id: number;
		nama: string;
		role: Role;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: number;
		nama: string;
		role: Role;
	}
}
