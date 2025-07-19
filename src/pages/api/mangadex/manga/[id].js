// pages/api/mangadex/manga/[id].js
import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (!id) return res.status(400).json({ message: 'Manga ID is required' });

    const response = await axios.get(`${BASE_URL}/manga/${id}`, {
      params: { 'includes[]': ['cover_art', 'author', 'artist'] },
      timeout: 20000,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('[API /manga/[id]] Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Failed to fetch manga detail',
    });
  }
}
