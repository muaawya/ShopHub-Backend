import pool from '../config/db.js';

export const listVendors = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT v.*, u.email, u.name FROM vendors v JOIN users u ON v.user_id = u.user_id');
    res.json(rows);
  } catch (err) { res.status(500).json({ err: err.message }); }
};

export const approveVendor = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('UPDATE vendors SET approved = 1 WHERE vendor_id = ?', [id]);
    res.json({ msg: 'Vendor approved' });
  } catch (err) { res.status(500).json({ err: err.message }); }
};

export const getVendor = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT * FROM vendors WHERE vendor_id = ?', [id]);
    if (!rows.length) return res.status(404).json({ msg: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ err: err.message }); }
};
