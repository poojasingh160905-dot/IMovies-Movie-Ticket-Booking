const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    },
    theater: {
      type: String,
      required: true,
      default: 'Audi 1 - Dolby 7.1'
    },
    date: {
      type: String, // Stored as YYYY-MM-DD for easy querying
      required: true
    },
    time: {
      type: String, // e.g., '10:00 AM', '01:30 PM', '06:45 PM', '10:00 PM'
      required: true
    },
    price: {
      type: Number,
      required: true,
      default: 250
    },
    totalSeats: {
      type: Number,
      default: 60
    },
    rows: {
      type: Number,
      default: 6 // A to F
    },
    cols: {
      type: Number,
      default: 10 // 1 to 10
    },
    bookedSeats: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Composite index to easily lookup showtimes for a movie on a given date
showtimeSchema.index({ movie: 1, date: 1 });

module.exports = mongoose.model('Showtime', showtimeSchema);
