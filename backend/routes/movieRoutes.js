const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  getMovieGenres
} = require('../controllers/movieController');

router.get('/', getMovies);
router.get('/genres', getMovieGenres);
router.get('/:id', getMovieById);

module.exports = router;
