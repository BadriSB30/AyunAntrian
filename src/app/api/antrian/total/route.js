import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS total_antrian FROM antrian');
    return Response.json({ total_antrian: rows[0].total_antrian });
  } catch (error) {
    console.error('GET /api/antrian/total error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
