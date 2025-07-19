import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMangaList } from '../lib/mangadex';
import MangaCard from '../components/MangaCard';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import Pagination from '../components/Pagination';
import RecommendationCarousel from '../components/RecommendationCarousel';
import RankingSidebar from '../components/RankingSidebar';
import AnimatedContainer from '../components/animations/AnimatedContainer';
import FadeInOnScroll from '../components/animations/FadeInOnScroll';

const HomePage = () => {
  const [allManga, setAllManga] = useState([]);
  const [filteredManga, setFilteredManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [activeTab, setActiveTab] = useState('manga');

  const ITEMS_PER_PAGE = 20;

  const languageMap = {
    manga: ['ja'],
    manhwa: ['ko'],
    manhua: ['zh']
  };

  const fetchManga = async (page = 1, title = '', genres = []) => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const originalLanguages = languageMap[activeTab] || [];

      const response = await getMangaList(ITEMS_PER_PAGE, offset, title, genres, originalLanguages);

      const mangaData = Array.isArray(response.data) ? response.data : [];
      const totalCount = typeof response.total === 'number' ? response.total : 0;

      setAllManga(mangaData);
      setFilteredManga(mangaData);
      setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err.message || 'Failed to fetch manga');
      setAllManga([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManga(currentPage, searchTerm, selectedGenres);
  }, [currentPage, searchTerm, selectedGenres, activeTab]);

  const handleSearch = (term) => {
    if (term !== searchTerm) setCurrentPage(1);
    setSearchTerm(term);
  };

  const handleGenreChange = (genres) => {
    if (JSON.stringify(genres) !== JSON.stringify(selectedGenres)) {
      setCurrentPage(1);
    }
    setSelectedGenres(genres);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="flex items-center justify-center pt-20">
          <AnimatedContainer className="text-center max-w-md mx-auto px-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="dark-card p-8 rounded-xl"
            >
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-destructive text-2xl">⚠</div>
              </div>
              <h2 className="text-2xl font-bold text-destructive mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-dark-text-secondary mb-6">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchManga(currentPage, searchTerm, selectedGenres)}
                className="btn-primary w-full"
              >
                Try Again
              </motion.button>
            </motion.div>
          </AnimatedContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecommendationCarousel />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <FadeInOnScroll>
              <div className="dark-card p-6 mb-8 rounded-xl">
                <div className="mb-6">
                  <SearchBar onSearch={handleSearch} />
                </div>
                <GenreFilter 
                  onGenreChange={handleGenreChange}
                  selectedGenres={selectedGenres}
                />
              </div>
            </FadeInOnScroll>

            {/* Tab Navigation */}
            <FadeInOnScroll delay={0.2}>
              <div className="dark-card rounded-xl mb-8 overflow-hidden">
                <div className="border-b border-dark-border">
                  <nav className="flex">
                    {[
                      { id: 'manga', label: 'Manga', emoji: '📖' },
                      { id: 'manhwa', label: 'Manhwa', emoji: '🇰🇷' },
                      { id: 'manhua', label: 'Manhua', emoji: '🇨🇳' }
                    ].map((tab) => (
                      <motion.button
                        key={tab.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTabChange(tab.id)}
                        className={`relative py-4 px-6 text-sm font-medium transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'text-primary'
                            : 'text-dark-text-secondary hover:text-primary'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span>{tab.emoji}</span>
                          <span>{tab.label}</span>
                        </span>
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </nav>
                </div>
                
                <div className="p-4">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm text-dark-text-secondary"
                    >
                      Found {filteredManga.length} {activeTab} titles
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Manga Grid */}
            <FadeInOnScroll delay={0.3}>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="dark-card animate-pulse rounded-xl overflow-hidden"
                    >
                      <div className="bg-dark-border aspect-[3/4] rounded-t-xl"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-dark-border rounded"></div>
                        <div className="h-3 bg-dark-border rounded w-3/4"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : filteredManga.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={`${activeTab}-${currentPage}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                      {filteredManga.map((item, index) => (
                        <motion.div
                          key={`${activeTab}-${item.id}-${currentPage}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.5 }}
                        >
                          <MangaCard manga={item} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                  
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-12"
                    >
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </motion.div>
                  )}
                </>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`empty-${activeTab}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-16"
                  >
                    <div className="dark-card p-12 rounded-xl max-w-md mx-auto">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="text-primary text-3xl">📚</div>
                      </div>
                      <h3 className="text-xl font-semibold text-dark-text-primary mb-2">
                        No {activeTab} found
                      </h3>
                      <p className="text-dark-text-secondary mb-6">
                        Try adjusting your search terms or filters
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedGenres([]);
                        }}
                        className="btn-primary"
                      >
                        Reset Filters
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </FadeInOnScroll>
          </div>

          {/* Sidebar */}
          <FadeInOnScroll delay={0.4} className="lg:w-80">
            <RankingSidebar />
          </FadeInOnScroll>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
