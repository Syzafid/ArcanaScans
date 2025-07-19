// pages/api/mangadex-proxy/[...path].js

import axios from 'axios';

export default async function handler(req, res) {
  const { path = [] } = req.query;
  const query = { ...req.query };
  delete query.path; // jangan forward 'path' sebagai query param

  const url = `https://api.mangadex.org/${path.join('/')}`;

  try {
    const response = await axios.get(url, {
      params: Object.keys(query).length > 0 ? query : undefined, // hanya kirim jika tidak kosong
      headers: {
        'User-Agent': 'YourAppName',
      },
      timeout: 20000,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('[proxy] Error:', error.message);
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Proxy failed',
        detail: error.response.data,
      });
    } else {
      res.status(500).json({
        error: 'Proxy failed',
        detail: error.message,
      });
    }
  }
}
