
const mockRecommendations = [
  {
    id: 'fallback-1',
    mangaId: 'fallback-1',
    title: 'Attack on Titan',
    description: 'Humanity fights for survival against giant humanoid creatures known as Titans.',
    author: 'Hajime Isayama',
    cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=256&h=384&fit=crop&crop=center',
    coverFileName: null,
    addedAt: new Date().toISOString()
  },
  {
    id: 'fallback-2',
    mangaId: 'fallback-2',
    title: 'One Piece',
    description: 'Follow Monkey D. Luffy and his crew as they search for the ultimate treasure known as One Piece.',
    author: 'Eiichiro Oda',
    cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=256&h=384&fit=crop&crop=center',
    coverFileName: null,
    addedAt: new Date().toISOString()
  },
  {
    id: 'fallback-3',
    mangaId: 'fallback-3',
    title: 'Demon Slayer',
    description: 'A young boy becomes a demon slayer to save his sister and avenge his family.',
    author: 'Koyoharu Gotouge',
    cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=256&h=384&fit=crop&crop=center',
    coverFileName: null,
    addedAt: new Date().toISOString()
  },
  {
    id: 'fallback-4',
    mangaId: 'fallback-4',
    title: 'My Hero Academia',
    description: 'In a world where superpowers are common, a powerless boy dreams of becoming a hero.',
    author: 'Kohei Horikoshi',
    cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=256&h=384&fit=crop&crop=center',
    coverFileName: null,
    addedAt: new Date().toISOString()
  }
];

export const getRecommendations = async () => {
  try {
    console.log('🔄 Fetching recommendations from localStorage...');
    
    // Get data from localStorage (admin recommendations)
    const storedRecommendations = localStorage.getItem('recommendationList');
    
    if (storedRecommendations) {
      try {
        const recommendations = JSON.parse(storedRecommendations);
        
        if (Array.isArray(recommendations) && recommendations.length > 0) {
          console.log('✅ Found admin recommendations in localStorage:', recommendations.length);
          
          // Transform data to match expected format
          const transformedData = recommendations.map(item => ({
            id: item.id || item.mangaId,
            mangaId: item.mangaId || item.id,
            title: item.title || 'Unknown Title',
            description: item.description || 'No description available',
            author: item.author || 'Unknown Author',
            cover: item.cover || '/placeholder.svg',
            coverFileName: item.coverFileName || null,
            addedAt: item.addedAt || new Date().toISOString()
          }));
          
          return transformedData;
        }
      } catch (parseError) {
        console.warn('⚠️ Failed to parse localStorage recommendations:', parseError);
      }
    }
    
    console.log('📦 No admin recommendations found, using fallback data');
    return mockRecommendations;
    
  } catch (error) {
    console.error('❌ Error fetching recommendations:', error);
    return mockRecommendations;
  }
};
