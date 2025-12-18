const express = require('express');
const router = express.Router();
const SpotifyService = require('../services/spotifyService');

const spotifyClient = new SpotifyService(
  process.env.SPOTIFY_CLIENT_ID,
  process.env.SPOTIFY_CLIENT_SECRET,
  process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5000/api/spotify/callback'
);

/**
 * GET /api/spotify/login
 * Redirect user to Spotify authorization
 */
router.get('/login', (req, res) => {
  const authUrl = spotifyClient.getAuthUrl();
  res.redirect(authUrl);
});

/**
 * GET /api/spotify/callback
 * Handle Spotify callback with authorization code
 */
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`/?error=${error}`);
  }

  try {
    const tokenData = await spotifyClient.getAccessToken(code);
    // Redirect with token in URL (frontend will handle storing it)
    const tokenParams = new URLSearchParams({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || '',
      expires_in: tokenData.expires_in
    });
    res.redirect(`/?${tokenParams.toString()}`);
  } catch (error) {
    res.redirect(`/?error=auth_failed`);
  }
});

/**
 * GET /api/spotify/now-playing
 * Get currently playing track
 */
router.get('/now-playing', async (req, res) => {
  const { access_token } = req.query;

  if (!access_token) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  try {
    const data = await spotifyClient.getNowPlaying(access_token);
    if (!data || !data.item) {
      return res.json({ on_air: { track: null } });
    }

    const track = data.item;
    res.json({
      on_air: {
        track: {
          title: track.name,
          artist: track.artists.map(a => a.name).join(', '),
          album: track.album.name,
          image: track.album.images[0]?.url || null
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch now playing' });
  }
});

/**
 * GET /api/spotify/recently-played
 * Get recently played tracks
 */
router.get('/recently-played', async (req, res) => {
  const { access_token } = req.query;
  const limit = req.query.limit || 20;

  if (!access_token) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  try {
    const data = await spotifyClient.getRecentlyPlayed(access_token, limit);
    
    const results = data.items.map(item => ({
      track: {
        title: item.track.name,
        artist: item.track.artists.map(a => a.name).join(', '),
        album: item.track.album.name,
        image: item.track.album.images[0]?.url || null
      },
      played_at: item.played_at
    }));

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recently played' });
  }
});

module.exports = router;
