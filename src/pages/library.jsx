"use client";

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { removeBookmark, setBookmarkLoading, setBookmarkError, loadBookmarksForUser } from '../store/slices/bookmarkSlice';
import MangaCard from '../components/MangaCard';
import Navigation from '../components/Navigation';
import AnimatedContainer from '../components/animations/AnimatedContainer';
import FadeInOnScroll from '../components/animations/FadeInOnScroll';
import { Trash2, BookOpen, User } from 'lucide-react';

const Library = () => {
  const dispatch = useDispatch();
  const { bookmarkedManga, loading, error } = useSelector((state) => state.bookmarks);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && user.id) {
      dispatch(setBookmarkLoading(true));
      dispatch(loadBookmarksForUser(user.id));
    }
  }, [user, dispatch]);

  const handleRemoveBookmark = (mangaId) => {
    if (user?.id) {
      dispatch(removeBookmark({ id: mangaId, userId: user.id }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatedContainer className="text-center py-16">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="dark-card p-12 rounded-xl max-w-md mx-auto"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-dark-text-primary mb-4">Access Restricted</h1>
              <p className="text-dark-text-secondary mb-6">Please log in to view your library</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Mock login for demo
                  dispatch({ 
                    type: 'user/loginUser', 
                    payload: { id: 'demo-user', username: 'Demo User', email: 'demo@example.com' } 
                  });
                }}
                className="btn-primary"
              >
                Demo Login
              </motion.button>
            </motion.div>
          </AnimatedContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedContainer>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark-text-primary mb-2 gradient-text flex items-center">
              <BookOpen className="w-8 h-8 mr-3" />
              My Library
            </h1>
            <p className="text-dark-text-secondary">Your bookmarked manga collection</p>
            {user && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-primary mt-2"
              >
                Welcome back, {user.username}! 👋
              </motion.p>
            )}
          </div>
        </AnimatedContainer>

        {error && (
          <FadeInOnScroll>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6"
            >
              <p className="text-destructive">{error}</p>
            </motion.div>
          </FadeInOnScroll>
        )}

        <FadeInOnScroll delay={0.2}>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
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
          ) : bookmarkedManga.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {bookmarkedManga.map((bookmark, index) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="relative group"
                >
                  <MangaCard manga={bookmark.manga} />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveBookmark(bookmark.id)}
                    className="absolute top-2 right-2 bg-destructive/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive shadow-lg backdrop-blur-sm"
                    title="Remove from library"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="mt-2 text-xs text-dark-text-muted bg-gray-800/50 rounded px-2 py-1"
                  >
                    Added: {new Date(bookmark.addedAt).toLocaleDateString()}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="dark-card p-12 rounded-xl max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-dark-text-primary mb-2">Your library is empty</h3>
                <p className="text-dark-text-secondary mb-6">Start adding manga to your collection by bookmarking them</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/" className="btn-primary inline-flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Manga
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </FadeInOnScroll>
      </div>
    </div>
  );
};

export default Library;
