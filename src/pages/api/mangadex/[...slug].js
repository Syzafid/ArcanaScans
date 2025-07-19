// pages/api/mangadex/[...slug].js

import axios from 'axios';

export default async function handler(req, res) {
  const { slug = [] } = req.query;
  const method = req.method;
  const params = req.query;
  const body = req.body;

  const path = slug.join('/');
  const apiUrl = `https://api.mangadex.org/${path}`;

  try {
    const response = await axios({
      method,
      url: apiUrl,
      params: method === 'GET' ? params : undefined,
      data: method !== 'GET' ? body : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[API PROXY] MangaDex error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
}
