// routes/users.js - CRUD and bulk operations for User model
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// Protect all routes below
router.use(verifyToken);

// POST /users - create a user
router.post('/', async (req, res) => {
  try {
    const { name, email, city, role } = req.body;
    const user = await User.create({ name, email, city, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /users - get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users/bulk - bulk create
router.post('/bulk', async (req, res) => {
  try {
    const users = req.body; // expect array of user objects
    if (!Array.isArray(users)) return res.status(400).json({ error: 'Array of users expected' });
    const inserted = await User.insertMany(users);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /users/bulk - bulk update
router.put('/bulk', async (req, res) => {
  try {
    const updates = req.body; // expect array of { _id, ...fields }
    if (!Array.isArray(updates)) return res.status(400).json({ error: 'Array of updates expected' });

    const results = await Promise.all(updates.map(u => {
      const { _id, ...fields } = u;
      return User.findByIdAndUpdate(_id, fields, { new: true, runValidators: true });
    }));

    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /users/:id - get user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Invalid user id' });
  }
});

// PUT /users/:id - update user
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /users/:id - delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid user id' });
  }
});

module.exports = router;
