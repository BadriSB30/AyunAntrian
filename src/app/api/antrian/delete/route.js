import { db } from "@/lib/db";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ message: 'ID diperlukan' }), { status: 400 });
    }

    await db.query('DELETE FROM antrian WHERE id = ?', [id]);

    return new Response(JSON.stringify({ message: 'Antrian berhasil dihapus' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('DELETE /api/antrian/delete error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
