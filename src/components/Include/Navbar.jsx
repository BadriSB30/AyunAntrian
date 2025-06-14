'use client';

import { useSession } from 'next-auth/react';
import LogoutButton from './Logout';
import Image from 'next/image';

const Navbar = () => {
  const { data: session, status } = useSession();
  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Access Denied</p>;

  return (
    <header className="flex items-center justify-between bg-gray-900 text-white p-4 shadow">
      <div className="flex items-center space-x-3">
        <Image
          src="/Logo.png"
          alt="Logo Ayun Antrian"
          width={40}
          height={40}
          className="rounded-md"
          priority
        />
        <h1 className="text-xl font-semibold">
          <a 
            href="https://www.youtube.com/@a.y.u.n0o0" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span className='text-blue-400'>Ayun</span> Antrian
          </a>
        </h1>
      </div>
      <nav className="md:flex items-center space-x-6 mr-5">
        <h1 className="hidden md:block">Welcome: {session.user.name}</h1>
        <LogoutButton />
      </nav>
    </header>
  );
};

export default Navbar;
