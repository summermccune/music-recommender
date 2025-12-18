require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Import routes
const kexpRoutes = require('./routes/kexp');
const spotifyRoutes = require('./routes/spotify');

app.use('/api/kexp', kexpRoutes);
app.use('/api/spotify', spotifyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Music Recommender API running on port ${PORT}`);
});
