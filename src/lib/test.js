import pool from '@/lib/db';

export default async function handler(req, res) {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.status(200).json({ success: true, time: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
