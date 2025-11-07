import pool from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const { user_id, items, total } = req.body; // items: [{product_id, quantity, price},...]
    const [r] = await pool.query('INSERT INTO orders (user_id, total_amount, status) VALUES (?,?,?)', [user_id, total, 'placed']);
    const orderId = r.insertId;
    const promises = items.map(it => pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)', [orderId, it.product_id, it.quantity, it.price]));
    await Promise.all(promises);
    res.json({ msg: 'Order created', orderId });
  } catch (err) { res.status(500).json({ err: err.message }); }
};

export const listOrders = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT o.*, u.name as customer FROM orders o JOIN users u ON o.user_id = u.user_id ORDER BY o.created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ err: err.message }); }
};
