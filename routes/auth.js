const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db'); // Correctly destructures pool from db.js
const verifyToken = require('../middleware/authMiddleware');

// REGISTER USER
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password, whatsapp_number } = req.body;

    // Enforce ALU student email domain
    if (!email || !email.endsWith('@alustudent.com')) {
      return res.status(400).json({ error: 'Must use a valid @alustudent.com email address.' });
    }

    // Ensure whatsapp_number is provided
    if (!whatsapp_number) {
      return res.status(400).json({ error: 'WhatsApp number is required.' });
    }

    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user into PostgreSQL database
    const newUser = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, whatsapp_number) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, whatsapp_number, created_at',
      [full_name, email, password_hash, whatsapp_number]
    );

    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN USER
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set HTTP-Only Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user.rows[0].id, name: user.rows[0].full_name, email: user.rows[0].email }
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET CURRENT USER PROFILE
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT id, full_name, email, whatsapp_number, created_at FROM users WHERE id = $1', [req.user.id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Profile Fetch Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;