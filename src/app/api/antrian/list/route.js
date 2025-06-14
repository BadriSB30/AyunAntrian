import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM antrian ORDER BY waktu DESC');
    const formatted = rows.map(row => ({
      ...row,
      waktu: row.waktu ? new Date(row.waktu).toISOString().replace('T', ' ').substring(0, 19) : null,
    }));

    return Response.json(formatted);
  } catch (error) {
    console.error('GET /api/antrian/list error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
