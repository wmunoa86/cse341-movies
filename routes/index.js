const router = require('express').Router();
const moviesRouter = require('./movies');
const actorsRouter = require('./actors');
const authRouter = require('./auth');

router.get('/', (_req, res) => {
  res.send('CSE 341 - Movies & Actors API | Docs: /api-docs');
});

router.use('/movies', moviesRouter);
router.use('/actors', actorsRouter);
router.use('/auth', authRouter);

module.exports = router;
