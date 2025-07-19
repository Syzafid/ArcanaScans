import axios from 'axios';

export default async function handler(req, res) {
  try {
    const params = {
      limit: req.query.limit || 10,
      offset: req.query.offset || 0,
      'order[followedCount]': 'desc',
      'contentRating[]': ['safe', 'suggestive'],
      'includes[]': ['cover_art', 'author', 'artist'],
    };

    const response = await axios.get('https://api.mangadex.org/manga', { params });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('[API MangaDex] Error:', error.message);
    res.status(500).json({
      message: 'Failed to fetch manga',
      error: error.message,
      details: error.response?.data || null,
    });
  }
}
