import { db } from '@/lib/db';

export async function PUT(req) {
  try {
    const { id, nomor, ruangan } = await req.json();

    if (!id || !nomor || !ruangan) {
      return new Response(JSON.stringify({ message: 'Data tidak lengkap' }), { status: 400 });
    }

    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const waktu = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    await db.query(
      'UPDATE antrian SET nomor = ?, ruangan = ?, waktu = ? WHERE id = ?',
      [nomor, ruangan, waktu, id]
    );

    return new Response(JSON.stringify({ message: 'Antrian berhasil diupdate' }));
  } catch (error) {
    console.error('PUT /api/antrian/update error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
