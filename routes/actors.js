const express = require('express');
const router = express.Router();
const {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor
} = require('../controllers/actors');

router.get('/', getAllActors);
router.get('/:id', getActorById);
router.post('/', createActor);
router.put('/:id', updateActor);
router.delete('/:id', deleteActor);

module.exports = router;
