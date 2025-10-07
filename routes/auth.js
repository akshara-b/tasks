// routes/auth.js - simple login that issues JWTs
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// POST /auth/login
// Accepts { email, role } and returns a signed JWT
router.post('/login', (req, res) => {
  const { email, role } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const payload = { email, role: role || 'user' };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

  res.json({ token });
});

module.exports = router;
