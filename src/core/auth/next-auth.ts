import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { comparePassword } from './password';
import { UserRepository } from '@/modules/user/user.repository';
import { Role } from '@/types/enums';

export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
	},

	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				username: { label: 'Username', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},

			async authorize(credentials) {
				if (!credentials?.username || !credentials.password) {
					throw new Error('Username dan password wajib diisi');
				}

				const username = credentials.username.toLowerCase().trim();
				const user = await UserRepository.findByUsername(username);

				if (!user) {
					throw new Error('Username atau password salah');
				}

				if (user.status !== 'aktif') {
					throw new Error('Akun tidak aktif, silahkan hubungi administrator');
				}

				const isValid = await comparePassword(credentials.password, user.password);

				if (!isValid) {
					throw new Error('Username atau password salah');
				}

				return {
					id: user.id,
					nama: user.nama,
					role: user.role as Role,
				};
			},
		}),
	],

	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id as number;
				token.nama = user.nama;
				token.role = user.role;
			}
			return token;
		},

		session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
				session.user.nama = token.nama;
				session.user.role = token.role;
			}
			return session;
		},
	},

	pages: {
		signIn: '/login',
	},
};
