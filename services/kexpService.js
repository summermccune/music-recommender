require('dotenv').config();
const axios = require('axios');

// KEXP real API endpoints
const KEXP_PLAY_LOG_URL = 'https://legacy-api.kexp.org/play?format=json';

/**
 * Get currently playing or recently played tracks from KEXP
 */
async function getRecentTracks(limit = 50) {
  try {
    const response = await axios.get(KEXP_PLAY_LOG_URL, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching KEXP tracks:', error.message);
    return null;
  }
}

/**
 * Get historical tracks from KEXP
 * @param {number} limit - Number of tracks to fetch (default: 50)
 */
async function getHistory(limit = 50) {
  try {
    const response = await axios.get(`${KEXP_API_BASE}/history`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching KEXP history, using mock data:', error.message);
    return MOCK_HISTORY;
  }
}

/**
 * Get all KEXP shows/programs
 */
async function getShows() {
  try {
    const response = await axios.get(`${KEXP_API_BASE}/shows`);
    return response.data;
  } catch (error) {
    console.error('Error fetching KEXP shows, using mock data:', error.message);
    return MOCK_SHOWS;
  }
}

/**
 * Get tracks played during a specific show
 */
async function getShowHistory(showId, limit = 50) {
  try {
    const response = await axios.get(`${KEXP_API_BASE}/shows/${showId}/history`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching show ${showId} history, using mock data:`, error.message);
    return MOCK_HISTORY;
  }
}

module.exports = {
  getRecentTracks
};
