import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT COUNT(DISTINCT ruangan) AS total_ruangan 
      FROM antrian 
      WHERE ruangan IS NOT NULL AND ruangan != ''
    `);
    return Response.json({ total_ruangan: rows[0].total_ruangan });
  } catch (error) {
    console.error('GET /api/antrian/ruangan error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
