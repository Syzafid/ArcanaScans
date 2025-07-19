"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMangaGenres, getMangaList } from '../lib/mangadex';
import MangaCard from '../components/MangaCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Navigation from '../components/Navigation';
import AnimatedContainer from '../components/animations/AnimatedContainer';
import FadeInOnScroll from '../components/animations/FadeInOnScroll';

const Category = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchManga();
  }, [selectedGenre, searchTerm, currentPage]);

  const fetchGenres = async () => {
    try {
      const response = await getMangaGenres();
      setGenres(response.data);
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  };

  const fetchManga = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const includedTags = selectedGenre ? [selectedGenre] : [];

      const response = await getMangaList(ITEMS_PER_PAGE, offset, searchTerm, includedTags);

      setManga(response.data);
      setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Failed to fetch manga:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    if (term !== searchTerm) {
      setSearchTerm(term);
      setCurrentPage(1);
    }
  };

  const handleGenreChange = (genreId) => {
    if (genreId !== selectedGenre) {
      setSelectedGenre(genreId);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedContainer>
          <h1 className="text-3xl font-bold text-dark-text-primary mb-6 gradient-text">Browse by Category</h1>
        </AnimatedContainer>
        
        {/* Search and Filters */}
        <FadeInOnScroll delay={0.2}>
          <div className="dark-card p-6 mb-8 rounded-xl">
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-dark-text-primary">Genres</h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGenreChange('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedGenre === ''
                      ? 'bg-primary text-white shadow-glow'
                      : 'bg-gray-800 text-dark-text-secondary border border-dark-border hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  All Genres
                </motion.button>
                
                {genres.map((genre) => (
                  <motion.button
                    key={genre.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGenreChange(genre.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedGenre === genre.id
                        ? 'bg-primary text-white shadow-glow'
                        : 'bg-gray-800 text-dark-text-secondary border border-dark-border hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {genre.attributes?.name?.en || 'Unknown'}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Results */}
        <FadeInOnScroll delay={0.3}>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
          ) : manga.length > 0 ? (
            <>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {manga.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    <MangaCard manga={item} />
                  </motion.div>
                ))}
              </motion.div>
              
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="dark-card p-12 rounded-xl max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-primary text-3xl">📚</div>
                </div>
                <h3 className="text-xl font-semibold text-dark-text-primary mb-2">No manga found</h3>
                <p className="text-dark-text-secondary mb-6">Try adjusting your search terms or genre filter</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGenre('');
                  }}
                  className="btn-primary"
                >
                  Reset Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </FadeInOnScroll>
      </div>
    </div>
  );
};

export default Category;
