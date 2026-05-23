const { getDB } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllMovies = async (req, res) => {
  // #swagger.tags = ['Movies']
  // #swagger.summary = 'Get all movies'
  try {
    const db = getDB();
    const movies = await db.collection('movies').find().toArray();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMovieById = async (req, res) => {
  // #swagger.tags = ['Movies']
  // #swagger.summary = 'Get a single movie by ID'
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const db = getDB();
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) });
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createMovie = async (req, res) => {
  // #swagger.tags = ['Movies']
  // #swagger.summary = 'Create a new movie'
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Movie data',
    required: true,
    schema: {
      title: 'Inception',
      year: 2010,
      genre: 'Sci-Fi',
      director: 'Christopher Nolan',
      rating: 8.8,
      duration: 148,
      language: 'English',
      synopsis: 'A thief who steals corporate secrets...',
      posterUrl: 'https://example.com/poster.jpg'
    }
  } */
  try {
    const { title, year, genre, director, rating, duration, language, synopsis, posterUrl } = req.body;

    if (!title || !year || !genre || !director) {
      return res.status(400).json({ error: 'title, year, genre, and director are required' });
    }
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title must be a non-empty string' });
    }
    if (typeof year !== 'number' || year < 1888 || year > new Date().getFullYear() + 5) {
      return res.status(400).json({ error: 'year must be a valid number (1888 to present)' });
    }
    if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 10)) {
      return res.status(400).json({ error: 'rating must be a number between 0 and 10' });
    }
    if (duration !== undefined && (typeof duration !== 'number' || duration <= 0)) {
      return res.status(400).json({ error: 'duration must be a positive number (in minutes)' });
    }

    const movie = {
      title: title.trim(),
      year,
      genre: genre.trim(),
      director: director.trim(),
      rating: rating ?? null,
      duration: duration ?? null,
      language: language?.trim() ?? 'English',
      synopsis: synopsis?.trim() ?? '',
      posterUrl: posterUrl?.trim() ?? '',
      createdAt: new Date()
    };

    const db = getDB();
    const result = await db.collection('movies').insertOne(movie);
    res.status(201).json({ _id: result.insertedId, ...movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMovie = async (req, res) => {
  // #swagger.tags = ['Movies']
  // #swagger.summary = 'Update a movie by ID'
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Fields to update (all optional)',
    schema: {
      title: 'Inception',
      year: 2010,
      genre: 'Sci-Fi',
      director: 'Christopher Nolan',
      rating: 8.8,
      duration: 148,
      language: 'English',
      synopsis: 'Updated synopsis...',
      posterUrl: 'https://example.com/poster.jpg'
    }
  } */
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Request body cannot be empty' });
    }

    const { title, year, genre, director, rating, duration, language, synopsis, posterUrl } = req.body;

    if (year !== undefined && (typeof year !== 'number' || year < 1888)) {
      return res.status(400).json({ error: 'year must be a valid number' });
    }
    if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 10)) {
      return res.status(400).json({ error: 'rating must be a number between 0 and 10' });
    }
    if (duration !== undefined && (typeof duration !== 'number' || duration <= 0)) {
      return res.status(400).json({ error: 'duration must be a positive number' });
    }

    const updates = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title.trim();
    if (year !== undefined) updates.year = year;
    if (genre !== undefined) updates.genre = genre.trim();
    if (director !== undefined) updates.director = director.trim();
    if (rating !== undefined) updates.rating = rating;
    if (duration !== undefined) updates.duration = duration;
    if (language !== undefined) updates.language = language.trim();
    if (synopsis !== undefined) updates.synopsis = synopsis.trim();
    if (posterUrl !== undefined) updates.posterUrl = posterUrl.trim();

    const db = getDB();
    const result = await db.collection('movies').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMovie = async (req, res) => {
  // #swagger.tags = ['Movies']
  // #swagger.summary = 'Delete a movie by ID'
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const db = getDB();
    const result = await db.collection('movies').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie };
