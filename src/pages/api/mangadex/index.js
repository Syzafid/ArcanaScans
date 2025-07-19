// pages/api/mangadex/index.js
export default function handler(req, res) {
  res.status(200).json({
    message: 'MangaDex API Proxy is running',
    endpoints: {
      manga: '/api/mangadex/manga',
      mangaById: '/api/mangadex/manga/[id]',
      genres: '/api/mangadex/manga/tag',
      chapters: '/api/mangadex/chapter?manga=<mangaId>',
      chapterById: '/api/mangadex/chapter/[id]',
      chapterPages: '/api/mangadex/at-home/[id]',
    },
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
}
