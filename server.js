const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const weatherRoutes = require('./routes/weather');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/weather', weatherRoutes);

app.get('/', (req, res) => res.send({ status: 'ok', message: 'User & Weather Dashboard API' }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user-weather-dashboard';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

