import axios from 'axios';

const API_URL = '/api/mangadex-proxy';

console.log('[mangadex] Using API URL:', API_URL);

// === Axios Instance ===
const mangaApi = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// === Interceptors ===
// Request interceptor
mangaApi.interceptors.request.use(
  (config) => {
    console.log('[mangadex] API Request:', {
      url: `${config.baseURL}${config.url}`,
      params: config.params || {},
      method: config.method,
    });
    return config;
  },
  (error) => {
    console.error('[mangadex] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
mangaApi.interceptors.response.use(
  (response) => {
    console.log('[mangadex] API Response OK:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('[mangadex] API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    if (error.code === 'ECONNABORTED')
      return Promise.reject(new Error('Request timeout - server is taking too long to respond'));
    if (error.response?.status >= 500)
      return Promise.reject(new Error('Server error - please try again later'));
    if (error.response?.status === 429)
      return Promise.reject(new Error('Too many requests - please wait a moment'));

    return Promise.reject(error);
  }
);

// === FUNGSI API ===

// 1. Ambil daftar manga
export const getMangaList = async (
  limit = 20,
  offset = 0,
  title = '',
  includedTags = [],
  originalLanguages = []
) => {
  try {
    const maxOffset = 10000;
    const safeOffset = Math.min(offset, maxOffset);

    const params = {
      limit: Math.min(limit, 100),
      offset: safeOffset,
      'order[followedCount]': 'desc',
      'contentRating[]': ['safe', 'suggestive'],
      'includes[]': ['cover_art', 'author', 'artist'],
    };

    if (title && title.trim()) params.title = title.trim();
    if (includedTags.length > 0) params['includedTags[]'] = includedTags;
    if (originalLanguages.length > 0)
      params['originalLanguage[]'] = originalLanguages;

    console.log('[mangadex] Fetching manga list with params:', params);

    const response = await mangaApi.get('/manga', { params });
    if (!response?.data || !response?.data?.data) {
      console.error('[mangadex] Invalid response structure:', response?.data);
      throw new Error('Invalid response from server');
    }

    return {
      data: response.data.data || [],
      total: response.data.total || 0,
      limit: response.data.limit || limit,
      offset: response.data.offset || offset,
    };
  } catch (error) {
    console.error('[mangadex] Error fetching manga list:', error);
    throw new Error(error.message || 'Failed to fetch manga list');
  }
};

// 2. Ambil detail manga berdasarkan ID
export const getMangaById = async (id) => {
  try {
    if (!id) throw new Error('Manga ID is required');

    const response = await mangaApi.get(`/manga/${id}`, {
      params: { 'includes[]': ['cover_art', 'author', 'artist'] },
    });

    if (!response?.data || !response?.data?.data)
      throw new Error('Manga not found');
    return response.data;
  } catch (error) {
    console.error('[mangadex] Error fetching manga details:', error);
    throw new Error(error.message || 'Failed to fetch manga details');
  }
};

// 3. Ambil semua chapter dari manga
export const getMangaChapters = async (
  mangaId,
  limit = 100,
  offset = 0,
  translatedLanguage = []
) => {
  try {
    if (!mangaId) throw new Error('Manga ID is required');

    const params = {
      manga: mangaId,
      limit: Math.min(limit, 500),
      offset,
      'order[chapter]': 'desc',
      'includes[]': ['scanlation_group', 'user'],
    };
    if (translatedLanguage.length > 0)
      params['translatedLanguage[]'] = translatedLanguage;

    console.log('[mangadex] Fetching chapters:', { mangaId, params });

    const response = await mangaApi.get('/chapter', { params });
    if (!response?.data) throw new Error('Invalid response from server');

    return {
      data: response.data.data || [],
      total: response.data.total || 0,
      limit: response.data.limit || limit,
      offset: response.data.offset || offset,
    };
  } catch (error) {
    console.error('[mangadex] Error fetching manga chapters:', error);
    throw new Error(error.message || 'Failed to fetch chapters');
  }
};

// 4. Ambil halaman (image pages) dari chapter
export const getChapterPages = async (chapterId) => {
  try {
    if (!chapterId) throw new Error('Chapter ID is required');
    console.log('[mangadex] Fetching chapter pages:', chapterId);

    const response = await mangaApi.get(`/at-home/server/${chapterId}`);

    if (!response?.data || !response?.data?.chapter)
      throw new Error('Chapter pages not found');
    return response.data;
  } catch (error) {
    console.error('[mangadex] Error fetching chapter pages:', error);
    throw new Error(error.message || 'Failed to fetch chapter pages');
  }
};

// 5. Ambil detail chapter berdasarkan ID
export const getChapterById = async (chapterId) => {
  try {
    if (!chapterId) throw new Error('Chapter ID is required');
    console.log('[mangadex] Fetching chapter by ID:', chapterId);

    const response = await mangaApi.get(`/chapter/${chapterId}`);

    if (!response?.data || !response?.data?.data)
      throw new Error('Chapter not found');
    return response.data;
  } catch (error) {
    console.error('[mangadex] Error fetching chapter by ID:', error);
    throw new Error(error.message || 'Failed to fetch chapter by ID');
  }
};

// 6. Ambil daftar genre/tag manga
export const getMangaGenres = async () => {
  try {
    console.log('[mangadex] Fetching manga genres...');
    const response = await mangaApi.get('/manga/tag');
    if (!response?.data || !response?.data?.data) {
      console.error('[mangadex] Invalid genres response:', response?.data);
      return { data: [] };
    }
    return { data: response.data.data || [] };
  } catch (error) {
    console.error('[mangadex] Error fetching genres:', error);
    return { data: [] };
  }
};

// 7. Helper untuk cover dan page
export const getCoverUrl = (mangaId, coverFileName, size = '256') => {
  if (!mangaId || !coverFileName) return '/placeholder.svg';

  // Tambahkan versi dengan resolusi jika diperlukan
  const baseUrl = `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}`;
  const url = size ? `${baseUrl}?width=${size}` : baseUrl;

  console.log('[mangadex] Cover URL:', url);
  return url;
};


export const getPageUrl = (baseUrl, hash, fileName, quality = 'data') => {
  const url = baseUrl && hash && fileName
    ? `${baseUrl}/${quality}/${hash}/${fileName}`
    : '/placeholder.svg';
  return url;
};
