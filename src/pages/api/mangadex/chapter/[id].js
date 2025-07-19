// pages/api/mangadex/chapter/index.js
import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

    const { manga, limit = 100, offset = 0, translatedLanguage } = req.query;

    if (!manga) return res.status(400).json({ message: 'Manga ID is required' });

    const params = {
      manga,
      limit,
      offset,
      'order[chapter]': 'desc',
      'includes[]': ['scanlation_group', 'user'],
    };

    if (translatedLanguage)
      params['translatedLanguage[]'] = Array.isArray(translatedLanguage) ? translatedLanguage : [translatedLanguage];

    const response = await axios.get(`${BASE_URL}/chapter`, { params, timeout: 20000 });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('[API /chapter] Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Failed to fetch chapters',
    });
  }
}
