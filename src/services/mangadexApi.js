
import axios from 'axios';

const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';

const BASE_URL = 'https://api.mangadex.org';
          


const mangaApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased timeout to 20 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
mangaApi.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.url, config.params);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);


// Add response interceptor for better error handling
mangaApi.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server is taking too long to respond');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error - please try again later');
    }
    
    if (error.response?.status === 429) {
      throw new Error('Too many requests - please wait a moment');
    }
    
    throw error;
  }
);

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

    if (title && title.trim()) {
      params.title = title.trim();
    }

    if (includedTags.length > 0) {
      params['includedTags[]'] = includedTags;
    }

    if (originalLanguages.length > 0) {
      params['originalLanguage[]'] = originalLanguages;
    }

    console.log('Fetching manga with params:', params);

    const response = await mangaApi.get('/manga', { params });

    if (!response.data || !response.data.data) {
      console.error('Invalid response structure:', response.data);
      throw new Error('Invalid response from server');
    }

    return {
      data: response.data.data || [],
      total: response.data.total || 0,
      limit: response.data.limit || limit,
      offset: response.data.offset || offset,
    };
  } catch (error) {
    console.error('Error fetching manga list:', error);
    throw new Error(error.message || 'Failed to fetch manga list');
  }
};


export const getMangaById = async (id) => {
  try {
    if (!id) {
      throw new Error('Manga ID is required');
    }

    const response = await mangaApi.get(`/manga/${id}`, {
      params: {
        'includes[]': ['cover_art', 'author', 'artist'],
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error('Manga not found');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching manga details:', error);
    throw new Error(error.message || 'Failed to fetch manga details');
  }
};

export const getMangaChapters = async (mangaId, limit = 100, offset = 0, translatedLanguage = []) => {
  try {
    if (!mangaId) {
      throw new Error('Manga ID is required');
    }

    const params = {
      manga: mangaId,
      limit: Math.min(limit, 500), // Cap limit
      offset,
      'order[chapter]': 'desc',
      'includes[]': ['scanlation_group', 'user'],
    };

    if (translatedLanguage && translatedLanguage.length > 0) {
      params['translatedLanguage[]'] = translatedLanguage;
    }

    const response = await mangaApi.get('/chapter', { params });

    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    return {
      data: response.data.data || [],
      total: response.data.total || 0,
      limit: response.data.limit || limit,
      offset: response.data.offset || offset
    };
  } catch (error) {
    console.error('Error fetching manga chapters:', error);
    throw new Error(error.message || 'Failed to fetch chapters');
  }
};

export const getChapterPages = async (chapterId) => {
  try {
    if (!chapterId) {
      throw new Error('Chapter ID is required');
    }

    const response = await mangaApi.get(`/at-home/server/${chapterId}`);

    if (!response.data || !response.data.chapter) {
      throw new Error('Chapter pages not found');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching chapter pages:', error);
    throw new Error(error.message || 'Failed to fetch chapter pages');
  }
};

export const getChapterById = async (chapterId) => {
  try {
    if (!chapterId) {
      throw new Error('Chapter ID is required');
    }

    const response = await mangaApi.get(`/chapter/${chapterId}`);
    if (!response.data || !response.data.data) {
      throw new Error('Chapter not found');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching chapter by ID:', error);
    throw new Error(error.message || 'Failed to fetch chapter by ID');
  }
};



export const getMangaGenres = async () => {
  try {
    const response = await mangaApi.get('manga/tag');

    if (!response.data || !response.data.data) {
      console.error('Invalid genres response:', response.data);
      return { data: [] }; // Return empty array instead of throwing
    }

    return {
      data: response.data.data || []
    };
  } catch (error) {
    console.error('Error fetching genres:', error);
    // Return empty genres instead of throwing to prevent app crash
    return { data: [] };
  }
};


export const getCoverUrl = (mangaId, coverFileName, size = '256') => {
  if (!mangaId || !coverFileName) {
    return '/placeholder.svg'; // Return placeholder if data is missing
  }
  return `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}.${size}.jpg`;
};

export const getPageUrl = (baseUrl, hash, fileName, quality = 'data') => {
  if (!baseUrl || !hash || !fileName) {
    return '/placeholder.svg'; // Return placeholder if data is missing
  }
  return `${baseUrl}/${quality}/${hash}/${fileName}`;
};
