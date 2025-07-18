import { getMangaList } from '@/lib/mangadex';

export default async function handler(req, res) {
  try {
    const { limit, offset, title, includedTags, originalLanguages } = req.query;

    const data = await getMangaList(
      parseInt(limit) || 20,
      parseInt(offset) || 0,
      title || '',
      Array.isArray(includedTags) ? includedTags : (includedTags ? [includedTags] : []),
      Array.isArray(originalLanguages) ? originalLanguages : (originalLanguages ? [originalLanguages] : [])
    );

    return res.status(200).json(data);
  } catch (error) {
    console.error('API Route Error (manga list):', error);
    return res.status(500).json({ message: error.message || 'Failed to fetch manga list' });
  }
}
