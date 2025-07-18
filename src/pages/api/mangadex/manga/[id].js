import { getMangaById } from '@/lib/mangadex';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(400).json({ message: 'Manga ID is required' });
    }

    const data = await getMangaById(id);
    return res.status(200).json(data);
  } catch (error) {
    console.error('API Route Error (get manga by ID):', error);
    return res.status(500).json({ message: error.message || 'Failed to fetch manga details' });
  }
}
