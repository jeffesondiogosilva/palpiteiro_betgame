import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    return Response.json({ success: true, time: rows[0] });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
