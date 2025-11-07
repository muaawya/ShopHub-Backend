import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Missing fields' });

    const [exists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(400).json({ msg: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', [name, email, hashed, role || 'customer']);
    const userId = result.insertId;

    if (role === 'vendor') {
      await pool.query('INSERT INTO vendors (user_id, store_name, approved) VALUES (?,?,?)', [userId, `${name} Store`, false]);
    }
    res.json({ msg: 'Registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ msg: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user.user_id, role: user.role, name: user.name }, jwtSecret, { expiresIn: '8h' });
    res.json({ token, user: { id: user.user_id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err.message });
  }
};

export const verifyTokenMiddleware = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ msg: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};
