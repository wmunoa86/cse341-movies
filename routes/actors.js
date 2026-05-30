const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor
} = require('../controllers/actors');

router.get('/', getAllActors);
router.get('/:id', getActorById);
router.post('/', isAuthenticated, createActor);
router.put('/:id', isAuthenticated, updateActor);
router.delete('/:id', isAuthenticated, deleteActor);

module.exports = router;
