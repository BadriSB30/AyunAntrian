'use client';

import { useSession, signOut } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';

export default function LogoutButton() {
  const { data: session, status } = useSession();

  if (status === 'loading' || !session) return null;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <button
      onClick={handleLogout}
      className="py-2 px-2 bg-red-500 rounded-full hover:bg-red-600 transition"
    >
      <FiLogOut />
    </button>
  );
}
