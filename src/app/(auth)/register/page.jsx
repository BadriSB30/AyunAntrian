'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // ✅ Ganti swal dengan sonner

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        nama: '',
        email: '',
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            toast.error(data.message || 'Terjadi kesalahan saat mendaftar');
        } else {
            toast.success('Akun berhasil dibuat!');
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-10 px-12 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Buat Akun</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="nama" className="block text-sm font-medium mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            id="nama"
                            name="nama"
                            value={form.nama}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        {loading ? 'Memproses...' : 'Daftar'}
                    </button>
                </form>
                <p className="text-sm text-center mt-4">
                    Sudah punya akun?{' '}
                    <a href="/login" className="text-blue-500 hover:underline">Login di sini</a>
                </p>
            </div>
        </div>
    );
}
