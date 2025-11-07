import pool from '../config/db.js';

export const listProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, v.store_name, u.name as vendor_name
       FROM products p
       JOIN vendors v ON p.vendor_id = v.vendor_id
       JOIN users u ON v.user_id = u.user_id
       WHERE p.active = 1`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ err: err.message }); }
};

export const createProduct = async (req, res) => {
  try {
    const { vendor_id, name, description, price, stock, category, image_url } = req.body;
    const [resu] = await pool.query(
      'INSERT INTO products (vendor_id,name,description,price,stock,category,image_url,active) VALUES (?,?,?,?,?,?,?,1)',
      [vendor_id, name, description, price, stock, category, image_url || '']
    );
    res.json({ msg: 'Product created', id: resu.insertId });
  } catch (err) { res.status(500).json({ err: err.message }); }
};

export const vendorProducts = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const [rows] = await pool.query('SELECT * FROM products WHERE vendor_id = ?', [vendorId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ err: err.message }); }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const fields = req.body;
    const sets = Object.keys(fields).map(k => `${k}=?`).join(',');
    await pool.query(`UPDATE products SET ${sets} WHERE product_id = ?`, [...Object.values(fields), id]);
    res.json({ msg: 'Updated' });
  } catch (err) { res.status(500).json({ err: err.message }); }
};

export const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT * FROM products WHERE product_id = ?', [id]);
    if (!rows.length) return res.status(404).json({ msg: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ err: err.message }); }
};
