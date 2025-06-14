import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // atau sesuaikan path relatif jika tidak pakai alias
import bcrypt from 'bcrypt';

export async function POST(req) {
  const body = await req.json();
  const { nama, email, username, password } = body;

  if (!nama || !email || !username || !password) {
    return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 });
  }

  try {
    const [existingUsers] = await db.query(
      'SELECT * FROM auth WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      const conflictField = existingUsers[0].username === username ? 'Username' : 'Email';
      return NextResponse.json({ message: `${conflictField} sudah digunakan` }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO auth (nama, email, username, password) VALUES (?, ?, ?, ?)',
      [nama, email, username, hashedPassword]
    );

    return NextResponse.json({ message: 'Pendaftaran berhasil' }, { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
