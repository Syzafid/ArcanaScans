import { getMangaChapters } from '@/lib/mangadex';

export default async function handler(req, res) {
  const { mangaId, limit, offset, translatedLanguage } = req.query;

  try {
    if (!mangaId) {
      return res.status(400).json({ message: 'Manga ID is required' });
    }

    const data = await getMangaChapters(
      mangaId,
      parseInt(limit) || 100,
      parseInt(offset) || 0,
      translatedLanguage ? [].concat(translatedLanguage) : []
    );

    return res.status(200).json(data);
  } catch (error) {
    console.error('API Route Error (get manga chapters):', error);
    return res.status(500).json({ message: error.message || 'Failed to fetch chapters' });
  }
}
