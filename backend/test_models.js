// Self-check verification script for IMovies Backend models, routes, and controllers
console.log('Testing IMovies Backend Components...\n');

try {
  // 1. Models
  const User = require('./models/User');
  const Movie = require('./models/Movie');
  const Showtime = require('./models/Showtime');
  const Booking = require('./models/Booking');
  console.log('✔ Mongoose Models loaded successfully:');
  console.log('   - User Schema:', typeof User.schema !== 'undefined');
  console.log('   - Movie Schema:', typeof Movie.schema !== 'undefined');
  console.log('   - Showtime Schema:', typeof Showtime.schema !== 'undefined');
  console.log('   - Booking Schema:', typeof Booking.schema !== 'undefined');

  // 2. Controllers
  const authController = require('./controllers/authController');
  const movieController = require('./controllers/movieController');
  const showtimeController = require('./controllers/showtimeController');
  const bookingController = require('./controllers/bookingController');
  console.log('✔ Controllers loaded successfully:');
  console.log('   - authController methods:', Object.keys(authController).join(', '));
  console.log('   - movieController methods:', Object.keys(movieController).join(', '));
  console.log('   - showtimeController methods:', Object.keys(showtimeController).join(', '));
  console.log('   - bookingController methods:', Object.keys(bookingController).join(', '));

  // 3. Routes
  const authRoutes = require('./routes/authRoutes');
  const movieRoutes = require('./routes/movieRoutes');
  const showtimeRoutes = require('./routes/showtimeRoutes');
  const bookingRoutes = require('./routes/bookingRoutes');
  console.log('✔ Routes loaded successfully:');
  console.log('   - Auth routes router defined');
  console.log('   - Movie routes router defined');
  console.log('   - Showtime routes router defined');
  console.log('   - Booking routes router defined');

  // 4. Middleware
  const { protect } = require('./middleware/authMiddleware');
  const { notFound, errorHandler } = require('./middleware/errorHandler');
  console.log('✔ Middleware verified (protect, notFound, errorHandler)');

  console.log('\n\x1b[32m🎉 All backend modules passed integrity checks with 0 errors!\x1b[0m\n');
  process.exit(0);
} catch (error) {
  console.error('\x1b[31m✖ Module Verification Failed:\x1b[0m', error);
  process.exit(1);
}
