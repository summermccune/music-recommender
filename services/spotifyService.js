const axios = require('axios');

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

class SpotifyService {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  /**
   * Get authorization URL for user to login
   */
  getAuthUrl(scopes = ['user-read-currently-playing', 'user-read-recently-played']) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: scopes.join(' ')
    });
    return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code) {
    try {
      const response = await axios.post(SPOTIFY_TOKEN_URL, null, {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUri,
          client_id: this.clientId,
          client_secret: this.clientSecret
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting Spotify access token:', error.message);
      throw error;
    }
  }

  /**
   * Get currently playing track
   */
  async getNowPlaying(accessToken) {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE}/me/player/currently-playing`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Spotify now playing:', error.message);
      return null;
    }
  }

  /**
   * Get recently played tracks
   */
  async getRecentlyPlayed(accessToken, limit = 20) {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE}/me/player/recently-played`, {
        params: { limit },
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Spotify recently played:', error.message);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(SPOTIFY_TOKEN_URL, null, {
        params: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error refreshing Spotify token:', error.message);
      throw error;
    }
  }
}

module.exports = SpotifyService;
