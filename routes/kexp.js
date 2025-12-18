const express = require('express');
const router = express.Router();
const kexpService = require('../services/kexpService');

/**
 * GET /api/kexp/now-playing
 * Get recently played tracks (first one is closest to now playing)
 */
router.get('/now-playing', async (req, res) => {
  try {
    const data = await kexpService.getRecentTracks(1);
    if (data && data.results && data.results.length > 0) {
      const play = data.results[0];
      // Skip air breaks, only show actual tracks
      const track = play.track;
      const artist = play.artist;
      
      if (track && artist) {
        res.json({
          on_air: {
            track: {
              title: track.name,
              artist: artist.name,
              album: play.release?.name || 'Unknown Album',
              played_at: play.airdate
            }
          }
        });
      } else {
        res.json({ on_air: { track: null } });
      }
    } else {
      res.json({ on_air: { track: null } });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch now playing' });
  }
});

/**
 * GET /api/kexp/history
 * Get track history
 * Query params: ?limit=50
 */
router.get('/history', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const data = await kexpService.getRecentTracks(limit);
    
    if (data && data.results) {
      const results = data.results
        .filter(item => item.track && item.artist) // Only include actual tracks, not air breaks
        .map(item => ({
          track: {
            title: item.track.name,
            artist: item.artist.name,
            album: item.release?.name || 'Unknown Album'
          },
          played_at: item.airdate
        }));
      res.json({ results });
    } else {
      res.json({ results: [] });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
