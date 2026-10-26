require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDBStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins in development (Vite frontend)
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    success: true,
    message: 'IMovies API Server is online and healthy',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus.connected ? 'Connected' : 'Disconnected',
      host: dbStatus.host
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);

// Fallback & Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🎬 IMovies Backend running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
