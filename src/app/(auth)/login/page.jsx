'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner'; // ✅ Ganti swal dengan sonner

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const onLogin = async (e) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.ok) {
      toast.success('Login berhasil!');
      router.push('/dashboard');
    } else {
      const errMsg = res?.error || 'Username atau password salah';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2 p-8 px-12 bg-gray-200 rounded-t">
          <Image src="/Logo.png" alt="Logo" width={70} height={70} className="rounded-md" />
          <h2 className="text-3xl font-mono">
            <span className="text-blue-500 font-bold">Antrian</span>
          </h2>
        </div>

        <div className="bg-white p-8 rounded shadow-lg max-w-xs w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <form className="space-y-4" onSubmit={onLogin}>
            <div>
              <label htmlFor="username" className="block mb-1">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Login
            </button>
          </form>
          <p className="text-sm text-center mt-4">
            Belum Punya Akun?{' '}
            <a href="/register" className="text-blue-500 hover:underline">Daftar di sini</a>
          </p>
        </div>
      </div>
    </section>
  );
}
