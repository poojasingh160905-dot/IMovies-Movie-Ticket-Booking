const mongoose = require('mongoose');
const Showtime = require('../models/Showtime');
const memoryStore = require('../services/inMemoryStore');

const getShowtimesByMovie = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const showtimes = await Showtime.find({ movie: req.params.movieId })
        .populate('movie', 'title posterUrl duration rating')
        .sort({ date: 1, time: 1 });

      return res.status(200).json({
        success: true,
        count: showtimes.length,
        data: showtimes
      });
    } else {
      const showtimes = await memoryStore.getShowtimesByMovie(req.params.movieId);
      return res.status(200).json({
        success: true,
        count: showtimes.length,
        data: showtimes
      });
    }
  } catch (error) {
    next(error);
  }
};

const getShowtimeById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const showtime = await Showtime.findById(req.params.id).populate(
        'movie',
        'title posterUrl duration rating basePrice genre'
      );

      if (!showtime) {
        return res.status(404).json({
          success: false,
          message: 'Showtime not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: showtime
      });
    } else {
      const showtime = await memoryStore.getShowtimeById(req.params.id);
      if (!showtime) {
        return res.status(404).json({
          success: false,
          message: 'Showtime not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: showtime
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShowtimesByMovie,
  getShowtimeById
};
