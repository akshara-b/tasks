const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/auth');
const dotenv = require('dotenv');

dotenv.config();

router.use(verifyToken);

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.city) return res.status(400).json({ error: 'User does not have a city set' });

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Weather API key not configured' });

    const q = encodeURIComponent(user.city);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    res.json({ user: { _id: user._id, name: user.name, city: user.city }, weather: response.data });
  } catch (err) {
    if (err.response && err.response.data) {
      return res.status(err.response.status).json({ error: err.response.data });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

