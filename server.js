// ============================================================
// AgroMarket Amravati - Main Server (Node.js + Express + MongoDB)
// ============================================================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ---- Middleware ----
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ---- MongoDB Connection ----
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agromarket';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('   Run "node seed.js" to populate the database with sample data');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\n⚠️  MongoDB is not running. To fix this:');
    console.log('   Option 1: Install MongoDB Community Edition from https://www.mongodb.com/try/download/community');
    console.log('   Option 2: Use MongoDB Atlas (free cloud): https://www.mongodb.com/atlas');
    console.log('             Then update MONGODB_URI in .env file with your Atlas connection string');
    console.log('\n   The server will start but database operations will fail until MongoDB is connected.\n');
  });

// ---- Routes ----
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// ---- Serve HTML Pages ----
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/auth', (req, res) => res.sendFile(path.join(__dirname, 'public', 'auth.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));

// ---- Error Handler ----
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ---- Start Server ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🌾 AgroMarket Amravati Server running on http://localhost:${PORT}`);
  console.log(`📄 Homepage:  http://localhost:${PORT}`);
  console.log(`🔐 Auth:      http://localhost:${PORT}/auth`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard\n`);
});
