const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configurations
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Required for HTTP-only cookies
}));
app.use(express.json());
app.use(cookieParser());

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'ok',
      appName: 'ALCHE CampusCart API',
      server_time: result.rows[0].now,
      database: 'Connected (PostgreSQL)'
    });
  } catch (err) {
    console.error('Health Check Error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`ALCHE CampusCart API running at http://localhost:${PORT}`);
});