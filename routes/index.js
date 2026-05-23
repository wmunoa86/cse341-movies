const router = require('express').Router();
const moviesRouter = require('./movies');
const actorsRouter = require('./actors');

router.get('/', (req, res) => {
  res.send('CSE 341 - Movies & Actors API | Docs: /api-docs');
});

router.use('/movies', moviesRouter);
router.use('/actors', actorsRouter);

module.exports = router;
