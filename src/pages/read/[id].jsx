import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Rocket, Book, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  getChapterPages,
  getMangaChapters,
  getMangaById,
  getChapterById,
  getPageUrl,
} from '@/lib/mangadex';

import ChapterGapConfirmation from '@/components/ChapterGapConfirmation';

const ChapterReader = () => {
  const router = useRouter();
  const { id: chapterId } = router.query;

  const [chapterData, setChapterData] = useState(null);
  const [mangaData, setMangaData] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [allChapters, setAllChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showGapConfirmation, setShowGapConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  useEffect(() => {
  if (!chapterId) return;

  const fetchChapterData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching chapter pages for:", chapterId);
      const pagesResponse = await getChapterById(chapterId);
      console.log("Pages Response:", pagesResponse);

      if (!pagesResponse || !pagesResponse.chapter?.data) {
        throw new Error("No chapter data found for this ID");
      }

      const baseUrl = pagesResponse.baseUrl;
      const chapterHash = pagesResponse.chapter.hash;
      const chapterPages = pagesResponse.chapter.data;

      const pageUrls = chapterPages.map((fileName) =>
        getPageUrl(baseUrl, chapterHash, fileName, "data")
      );
      setPages(pageUrls);
      setChapterData(pagesResponse.chapter);

      const chapterMeta = await getChapterById(chapterId);
        const mangaId = chapterMeta.data.relationships.find(
          (rel) => rel.type === 'manga'
        )?.id;

        console.log('Fetched chapterMeta:', chapterMeta.data);
        console.log('Extracted mangaId:', mangaId);

        if (mangaId) {
          const mangaResponse = await getMangaById(mangaId);
          setMangaData(mangaResponse.data);

          const chaptersResponse = await getMangaChapters(mangaId);
          const chapters = chaptersResponse.data;

          const currentChapter = chapters.find((ch) => ch.id === chapterId);

          if (currentChapter) {
            setCurrentLanguage(currentChapter.attributes.translatedLanguage);

            const sameLanguageChapters = chapters
              .filter(
                (ch) =>
                  ch.attributes.translatedLanguage ===
                  currentChapter.attributes.translatedLanguage
              )
              .sort(
                (a, b) =>
                  parseFloat(b.attributes.chapter || 0) -
                  parseFloat(a.attributes.chapter || 0)
              );

            setAllChapters(sameLanguageChapters);

            const currentIndex = sameLanguageChapters.findIndex(
              (ch) => ch.id === chapterId
            );
            setCurrentChapterIndex(currentIndex);
            console.log('✅ Current index:', currentIndex);
          }
        }
      } catch (err) {
        setError('Failed to load chapter. Please try again later.');
        console.error('❌ Error fetching chapter data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapterData();
    console.log('Chapter ID changed:', chapterId);
  }, [chapterId]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  const getCurrentChapter = () => {
    return currentChapterIndex >= 0 ? allChapters[currentChapterIndex] : null;
  };

  const getAdjacentChapter = (direction) => {
    if (currentChapterIndex === -1 || allChapters.length === 0) return null;

    const nextIndex =
      direction === 'next'
        ? currentChapterIndex - 1
        : currentChapterIndex + 1;
    return nextIndex >= 0 && nextIndex < allChapters.length
      ? allChapters[nextIndex]
      : null;
  };

  const checkChapterGap = (currentChapter, nextChapter) => {
    if (!currentChapter || !nextChapter) return false;

    const currentNum = parseFloat(currentChapter.attributes.chapter);
    const nextNum = parseFloat(nextChapter.attributes.chapter);

    if (isNaN(currentNum) || isNaN(nextNum)) return false;

    return Math.abs(currentNum - nextNum) > 1;
  };

  const navigateToChapter = (direction) => {
    console.log('>> Clicked to navigate:', direction);
    console.log('>> currentChapterIndex:', currentChapterIndex);
    console.log('>> allChapters.length:', allChapters.length);
    console.log('Navigating to:', direction);
    console.log(
      'Next chapter object (regardless of direction):',
      getAdjacentChapter('next')
    );
    console.log('Prev chapter object:', getAdjacentChapter('prev'));

    const currentChapter = getCurrentChapter();
    const nextChapter = getAdjacentChapter(direction);

    if (!nextChapter) return;

    if (checkChapterGap(currentChapter, nextChapter)) {
      setPendingNavigation({ direction, chapterId: nextChapter.id });
      setShowGapConfirmation(true);
    } else {
      router.push(`/read/${nextChapter.id}`);
    }
  };

  const handleGapConfirmation = () => {
    if (pendingNavigation) {
      router.push(`/read/${pendingNavigation.chapterId}`);
    }
    setShowGapConfirmation(false);
    setPendingNavigation(null);
  };

  const handleGapCancel = () => {
    setShowGapConfirmation(false);
    setPendingNavigation(null);
  };

  const canNavigate = (direction) => {
    return getAdjacentChapter(direction) !== null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="loading-spinner mb-4"></div>
          <p className="text-dark-text-secondary">Loading chapter...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="dark-card p-8 rounded-xl">
            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-destructive text-2xl">⚠</div>
            </div>
            <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
            <p className="text-dark-text-secondary mb-6">{error}</p>
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentChapter = getCurrentChapter();
  const mangaTitle =
    mangaData?.attributes?.title?.en ||
    mangaData?.attributes?.title?.ja ||
    Object.values(mangaData?.attributes?.title || {})[0] ||
    'Unknown Manga';

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 dark-card border-b border-dark-border backdrop-blur-sm bg-dark-bg/95"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={mangaData ? `/manga/${mangaData.id}` : '/'}
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to {mangaData ? 'Manga' : 'Home'}
            </Link>

            <div className="text-center flex-1 mx-4">
              <h1 className="text-lg font-semibold text-dark-text-primary truncate">
                {mangaTitle}
              </h1>
              {currentChapter && (
                <div className="flex items-center justify-center space-x-4 text-sm text-dark-text-muted">
                  <span className="flex items-center">
                    <Book className="w-3 h-3 mr-1" />
                    Chapter {currentChapter.attributes.chapter || 'Unknown'}
                  </span>
                  {currentChapter.attributes.volume && (
                    <span>Vol. {currentChapter.attributes.volume}</span>
                  )}
                  <span className="flex items-center">
                    <Globe className="w-3 h-3 mr-1" />
                    {currentChapter.attributes.translatedLanguage?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation Top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-6"
      >
        <div className="flex items-center justify-between dark-card rounded-xl p-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateToChapter('prev')}
            disabled={!canNavigate('prev')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </motion.button>

          <div className="text-center">
            <p className="text-dark-text-muted text-sm">{pages.length} pages</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateToChapter('next')}
            disabled={!canNavigate('next')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-200"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Pages */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-2">
          {pages.map((pageUrl, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative"
            >
              {!loadedImages.has(index) && (
                <div className="aspect-[3/4] bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="loading-spinner"></div>
                </div>
              )}
            <Image
              src={pageUrl}
              alt={`Page ${index + 1}`}
              width={960} // kamu bisa sesuaikan ukuran sesuai kebutuhan
              height={1440}
              className={`w-full h-auto rounded-lg shadow-lg transition-opacity duration-300 ${
                loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(index)}
              onError={(e) => {
                e.target.src = '/placeholder.svg';
                handleImageLoad(index);
              }}
              // unoptimized
            />

              <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {index + 1} / {pages.length}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-6"
      >
        <div className="flex items-center justify-between dark-card rounded-xl p-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateToChapter('prev')}
            disabled={!canNavigate('prev')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Chapter</span>
          </motion.button>

          <Link
            href={mangaData ? `/manga/${mangaData.id}` : '/'}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors duration-200"
          >
            Back to Manga
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateToChapter('next')}
            disabled={!canNavigate('next')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-200"
          >
            <span>Next Chapter</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Scroll Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/80 transition-colors duration-200 flex items-center justify-center z-50"
          >
            <Rocket className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chapter Gap Confirmation */}
      <AnimatePresence>
        {showGapConfirmation && pendingNavigation && (
          <ChapterGapConfirmation
            isOpen={showGapConfirmation}
            onClose={handleGapCancel}
            onConfirm={handleGapConfirmation}
            currentChapter={getCurrentChapter()?.attributes?.chapter}
            nextChapter={getAdjacentChapter(pendingNavigation.direction)?.attributes?.chapter}
            direction={pendingNavigation.direction}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChapterReader;
