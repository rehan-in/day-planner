// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Security and CORS middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/summaries', summaryRoutes);
app.use('/api/stats', statsRoutes);

// Healthcheck / test endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'DayPlanner API is up and running!' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect Database and Start Server
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
  });
};

startServer();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  const mongoose = require('mongoose');
  await mongoose.connection.close();
  console.log('MongoDB connection closed gracefully');
  process.exit(0);
});