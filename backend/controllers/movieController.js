const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const memoryStore = require('../services/inMemoryStore');

const getMovies = async (req, res, next) => {
  try {
    const { search, genre } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (genre && genre !== 'All') {
        query.genre = { $in: [new RegExp(`^${genre}$`, 'i')] };
      }
      if (search && search.trim() !== '') {
        query.$or = [
          { title: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } }
        ];
      }
      const movies = await Movie.find(query).sort({ rating: -1, createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
      });
    } else {
      const movies = await memoryStore.getMovies({ search, genre });
      return res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMovieById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }
      const showtimes = await Showtime.find({ movie: movie._id }).sort({
        date: 1,
        time: 1
      });
      return res.status(200).json({
        success: true,
        data: {
          ...movie.toObject(),
          showtimes
        }
      });
    } else {
      const movieData = await memoryStore.getMovieById(req.params.id);
      if (!movieData) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: movieData
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMovieGenres = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const genres = await Movie.distinct('genre');
      return res.status(200).json({
        success: true,
        data: genres.sort()
      });
    } else {
      const genres = await memoryStore.getMovieGenres();
      return res.status(200).json({
        success: true,
        data: genres
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  getMovieGenres
};
