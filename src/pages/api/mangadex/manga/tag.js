// pages/api/mangadex/manga/tag.js
import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/manga/tag`, { timeout: 20000 });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('[API /manga/tag] Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Failed to fetch manga genres',
    });
  }
}
