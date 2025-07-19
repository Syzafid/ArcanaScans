// pages/api/mangadex-proxy/[...path].js

import axios from 'axios';

export default async function handler(req, res) {
  const { path = [] } = req.query;
  const url = `https://api.mangadex.org/${path.join('/')}`;

  try {
    const response = await axios.get(url, {
      params: req.query,
      headers: {
        'User-Agent': 'arcanascans',
      },
      timeout: 20000,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('[proxy] Error:', error.message);
    res.status(500).json({ error: 'Proxy failed', detail: error.message });
  }
}
