const { getDB } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllActors = async (req, res) => {
  // #swagger.tags = ['Actors']
  // #swagger.summary = 'Get all actors'
  try {
    const db = getDB();
    const actors = await db.collection('actors').find().toArray();
    res.status(200).json(actors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getActorById = async (req, res) => {
  // #swagger.tags = ['Actors']
  // #swagger.summary = 'Get a single actor by ID'
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const db = getDB();
    const actor = await db.collection('actors').findOne({ _id: new ObjectId(id) });
    if (!actor) {
      return res.status(404).json({ error: 'Actor not found' });
    }
    res.status(200).json(actor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createActor = async (req, res) => {
  // #swagger.tags = ['Actors']
  // #swagger.summary = 'Create a new actor'
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Actor data',
    required: true,
    schema: {
      name: 'Leonardo DiCaprio',
      birthDate: '1974-11-11',
      nationality: 'American',
      biography: 'American actor and film producer...',
      knownFor: 'Inception, Titanic, The Revenant',
      awards: 'Academy Award for Best Actor (2016)',
      isActive: true
    }
  } */
  try {
    const { name, birthDate, nationality, biography, knownFor, awards, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'name must be a non-empty string' });
    }
    if (isActive !== undefined && typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    const actor = {
      name: name.trim(),
      birthDate: birthDate?.trim() ?? '',
      nationality: nationality?.trim() ?? '',
      biography: biography?.trim() ?? '',
      knownFor: knownFor?.trim() ?? '',
      awards: awards?.trim() ?? '',
      isActive: isActive ?? true,
      createdAt: new Date()
    };

    const db = getDB();
    const result = await db.collection('actors').insertOne(actor);
    res.status(201).json({ _id: result.insertedId, ...actor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateActor = async (req, res) => {
  // #swagger.tags = ['Actors']
  // #swagger.summary = 'Update an actor by ID'
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Fields to update (all optional)',
    schema: {
      name: 'Leonardo DiCaprio',
      birthDate: '1974-11-11',
      nationality: 'American',
      biography: 'Updated biography...',
      knownFor: 'Inception, Titanic',
      awards: 'Academy Award for Best Actor',
      isActive: true
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

    const { name, birthDate, nationality, biography, knownFor, awards, isActive } = req.body;

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return res.status(400).json({ error: 'name must be a non-empty string' });
    }
    if (isActive !== undefined && typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    const updates = { updatedAt: new Date() };
    if (name !== undefined) updates.name = name.trim();
    if (birthDate !== undefined) updates.birthDate = birthDate.trim();
    if (nationality !== undefined) updates.nationality = nationality.trim();
    if (biography !== undefined) updates.biography = biography.trim();
    if (knownFor !== undefined) updates.knownFor = knownFor.trim();
    if (awards !== undefined) updates.awards = awards.trim();
    if (isActive !== undefined) updates.isActive = isActive;

    const db = getDB();
    const result = await db.collection('actors').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Actor not found' });
    }
    res.status(200).json({ message: 'Actor updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteActor = async (req, res) => {
  // #swagger.tags = ['Actors']
  // #swagger.summary = 'Delete an actor by ID'
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const db = getDB();
    const result = await db.collection('actors').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Actor not found' });
    }
    res.status(200).json({ message: 'Actor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllActors, getActorById, createActor, updateActor, deleteActor };
