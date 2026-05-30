const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movies');

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', isAuthenticated, createMovie);
router.put('/:id', isAuthenticated, updateMovie);
router.delete('/:id', isAuthenticated, deleteMovie);

module.exports = router;
