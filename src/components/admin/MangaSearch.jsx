
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Loader } from 'lucide-react';
import { getMangaList, getCoverUrl } from '../../services/mangadexApi';

const MangaSearch = ({ onAdd, buttonText = "Add", placeholder = "Search manga..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchManga = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await getMangaList(20, 0, searchTerm);
      setSearchResults(response.data || []);
    } catch (err) {
      setError('Failed to search manga. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchManga();
    }
  };

  const handleAdd = (manga) => {
    const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
    const coverFileName = coverArt?.attributes?.fileName;
    
    const mangaData = {
      id: manga.id,
      title: manga.attributes?.title?.en || manga.attributes?.title?.ja || 'Unknown Title',
      cover: coverFileName ? getCoverUrl(manga.id, coverFileName, '256') : '/placeholder.svg',
      description: manga.attributes?.description?.en || '',
      status: manga.attributes?.status || 'unknown',
      addedAt: new Date().toISOString()
    };
    
    onAdd(mangaData);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-dark-text-muted" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={searchManga}
          disabled={loading || !searchTerm.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>Search</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((manga, index) => {
            const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
            const coverFileName = coverArt?.attributes?.fileName;
            const title = manga.attributes?.title?.en || manga.attributes?.title?.ja || 'Unknown Title';
            
            return (
              <motion.div
                key={manga.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="dark-card p-4 rounded-xl"
              >
                <div className="flex space-x-4">
                  <img
                    src={coverFileName ? getCoverUrl(manga.id, coverFileName, '256') : '/placeholder.svg'}
                    alt={title}
                    className="w-16 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-dark-text-primary mb-2 truncate" title={title}>
                      {title}
                    </h3>
                    <p className="text-xs text-dark-text-secondary mb-3">
                      Status: {manga.attributes?.status || 'Unknown'}
                    </p>
                    <button
                      onClick={() => handleAdd(manga)}
                      className="btn-primary text-xs flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{buttonText}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MangaSearch;
