// backend/routes/auth.js
import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// default export so server.js can: import authRoutes from './routes/auth.js'
export default router;
