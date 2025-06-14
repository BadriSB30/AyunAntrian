import { db } from '@/lib/db';

export async function POST(req) {
  try {
    // Ambil nomor antrian terakhir
    const [lastRow] = await db.query(
      'SELECT nomor FROM antrian ORDER BY id DESC LIMIT 1'
    );

    let nextNumber = 1;
    if (lastRow.length > 0) {
      nextNumber = parseInt(lastRow[0].nomor, 10) + 1;
    }

    // Buat waktu sekarang (format: YYYY-MM-DD HH:mm:ss)
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const waktu = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    // Simpan data ke database
    await db.query(
      'INSERT INTO antrian (nomor, ruangan, waktu) VALUES (?, ?, ?)',
      [nextNumber.toString(), '', waktu]
    );

    return new Response(
      JSON.stringify({ message: 'Antrian berhasil ditambahkan', nomor: nextNumber }),
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/antrian/create error:', error);
    return new Response(
      JSON.stringify({ message: 'Terjadi kesalahan pada server' }),
      { status: 500 }
    );
  }
}
