import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Calendar, Star, Globe, ChevronDown } from 'lucide-react';
import { getMangaById, getCoverUrl, getMangaChapters } from '@/services/mangadexApi';
import AnimatedContainer from '@/components/animations/AnimatedContainer';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';

const MangaDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' }
  ];

  const filteredChapters = chapters.filter(
    (chapter) => chapter.attributes.translatedLanguage === selectedLanguage
  );

  // Fetch manga details
  useEffect(() => {
    if (!id) return;

    const fetchMangaDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMangaById(id);
        setManga(response.data);
      } catch (err) {
        setError('Failed to fetch manga details. Please try again later.');
        console.error('Error fetching manga details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaDetail();
  }, [id]);

  // Fetch chapters
  useEffect(() => {
    if (!id) return;

    const fetchChapters = async () => {
      try {
        setChaptersLoading(true);
        const response = await getMangaChapters(id, 100, 0);
        setChapters(response.data);

        const langs = [
          ...new Set(response.data.map((chapter) => chapter.attributes.translatedLanguage))
        ];
        setAvailableLanguages(langs);

        if (langs.includes('en')) {
          setSelectedLanguage('en');
        } else if (langs.length > 0) {
          setSelectedLanguage(langs[0]);
        }
      } catch (err) {
        console.error('Error fetching chapters:', err);
      } finally {
        setChaptersLoading(false);
      }
    };

    fetchChapters();
  }, [id]);

  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <AnimatedContainer className="text-center max-w-md mx-auto px-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="dark-card p-8 rounded-xl"
          >
            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-destructive text-2xl">⚠</div>
            </div>
            <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
            <p className="text-dark-text-secondary mb-6">{error || 'Manga not found'}</p>
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          </motion.div>
        </AnimatedContainer>
      </div>
    );
  }

  // Extract relationships
  const coverArt = manga.relationships.find((rel) => rel.type === 'cover_art');
  const coverFileName = coverArt?.attributes?.fileName;
  const coverUrl = coverFileName
    ? getCoverUrl(manga.id, coverFileName, '512')
    : '/placeholder.svg';

  const author = manga.relationships.find((rel) => rel.type === 'author');
  const artist = manga.relationships.find((rel) => rel.type === 'artist');

  const title =
    manga.attributes.title.en ||
    manga.attributes.title.ja ||
    manga.attributes.title['ja-ro'] ||
    Object.values(manga.attributes.title)[0] ||
    'Unknown Title';

  const description =
    manga.attributes.description.en ||
    manga.attributes.description.ja ||
    Object.values(manga.attributes.description)[0] ||
    'No description available';

  const status = manga.attributes.status;
  const year = manga.attributes.year;
  const contentRating = manga.attributes.contentRating;

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="dark-card rounded-xl overflow-hidden">
          <div className="md:flex">
            {/* Cover Image */}
            <FadeInOnScroll className="md:w-1/3 lg:w-1/4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative group"
              >
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </FadeInOnScroll>

            {/* Details */}
            <div className="md:w-2/3 lg:w-3/4 p-6">
              <AnimatedContainer delay={0.2}>
                <h1 className="text-3xl font-bold text-dark-text-primary mb-4">{title}</h1>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FadeInOnScroll delay={0.3}>
                    <div>
                      <h3 className="text-lg font-semibold text-dark-text-primary mb-3 flex items-center">
                        <Book className="w-5 h-5 mr-2 text-primary" />
                        Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        {author && (
                          <p>
                            <span className="font-medium text-dark-text-primary">Author:</span>{' '}
                            <span className="text-dark-text-secondary">
                              {author.attributes?.name || 'Unknown'}
                            </span>
                          </p>
                        )}
                        {artist && artist.id !== author?.id && (
                          <p>
                            <span className="font-medium text-dark-text-primary">Artist:</span>{' '}
                            <span className="text-dark-text-secondary">
                              {artist.attributes?.name || 'Unknown'}
                            </span>
                          </p>
                        )}
                        <p>
                          <span className="font-medium text-dark-text-primary">Status:</span>{' '}
                          <span className="text-dark-text-secondary capitalize">
                            {status || 'Unknown'}
                          </span>
                        </p>
                        {year && (
                          <p>
                            <span className="font-medium text-dark-text-primary">Year:</span>{' '}
                            <span className="text-dark-text-secondary">{year}</span>
                          </p>
                        )}
                        <p>
                          <span className="font-medium text-dark-text-primary">Content Rating:</span>{' '}
                          <span className="text-dark-text-secondary capitalize">
                            {contentRating || 'Unknown'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </FadeInOnScroll>

                  <FadeInOnScroll delay={0.4}>
                    <div>
                      <h3 className="text-lg font-semibold text-dark-text-primary mb-3 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-accent" />
                        Genres
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {manga.attributes.tags
                          .filter((tag) => tag.attributes.group === 'genre')
                          .map((tag) => (
                            <motion.span
                              key={tag.id}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/30 hover:bg-primary/30 transition-colors duration-200"
                            >
                              {tag.attributes.name.en}
                            </motion.span>
                          ))}
                      </div>
                    </div>
                  </FadeInOnScroll>
                </div>

                {/* Description */}
                <FadeInOnScroll delay={0.5}>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-dark-text-primary mb-3">
                      Description
                    </h3>
                    <p className="text-dark-text-secondary leading-relaxed">{description}</p>
                  </div>
                </FadeInOnScroll>

                {/* Additional Tags */}
                {manga.attributes.tags.filter((tag) => tag.attributes.group !== 'genre').length > 0 && (
                  <FadeInOnScroll delay={0.6}>
                    <div>
                      <h3 className="text-lg font-semibold text-dark-text-primary mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {manga.attributes.tags
                          .filter((tag) => tag.attributes.group !== 'genre')
                          .map((tag) => (
                            <motion.span
                              key={tag.id}
                              whileHover={{ scale: 1.02 }}
                              className="px-2 py-1 bg-gray-800 text-dark-text-secondary text-xs rounded-full border border-dark-border hover:border-primary/50 transition-colors duration-200"
                            >
                              {tag.attributes.name.en}
                            </motion.span>
                          ))}
                      </div>
                    </div>
                  </FadeInOnScroll>
                )}
              </AnimatedContainer>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <FadeInOnScroll delay={0.7} className="mt-8">
          <div className="dark-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark-text-primary flex items-center">
                <Book className="w-6 h-6 mr-2 text-primary" />
                Chapters
              </h2>

              {/* Language Selector */}
              {availableLanguages.length > 0 && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="flex items-center space-x-2 bg-gray-800 border border-dark-border rounded-lg px-4 py-2 text-dark-text-primary hover:border-primary/50 transition-colors duration-200"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{languages.find((lang) => lang.code === selectedLanguage)?.flag}</span>
                    <span>{languages.find((lang) => lang.code === selectedLanguage)?.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showLanguageDropdown ? 'rotate-180' : ''
                      }`}
                    />
                  </motion.button>

                  {showLanguageDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 border border-dark-border rounded-lg shadow-lg z-10"
                    >
                      {availableLanguages.map((langCode) => {
                        const language = languages.find((lang) => lang.code === langCode);
                        return (
                          <motion.button
                            key={langCode}
                            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                            onClick={() => {
                              setSelectedLanguage(langCode);
                              setShowLanguageDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-center space-x-2 transition-colors duration-200 ${
                              selectedLanguage === langCode
                                ? 'bg-primary/20 text-primary'
                                : 'text-dark-text-primary hover:text-primary'
                            } first:rounded-t-lg last:rounded-b-lg`}
                          >
                            <span>{language?.flag || '🌐'}</span>
                            <span>{language?.name || langCode}</span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              {chaptersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="loading-spinner"></div>
                </div>
              ) : filteredChapters.length > 0 ? (
                filteredChapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="group"
                  >
                    <Link
                      href={`/read/${chapter.id}`}
                      className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 border border-dark-border hover:border-primary/50 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {chapter.attributes.chapter || '?'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-dark-text-primary group-hover:text-primary transition-colors duration-200">
                            {chapter.attributes.title ||
                              `Chapter ${chapter.attributes.chapter || 'Unknown'}`}
                            {chapter.attributes.volume && (
                              <span className="text-dark-text-muted ml-2">
                                (Vol. {chapter.attributes.volume})
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center space-x-4 text-xs text-dark-text-muted">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatRelativeTime(chapter.attributes.publishAt)}
                            </span>
                            {chapter.attributes.pages && (
                              <span>{chapter.attributes.pages} pages</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-dark-text-muted group-hover:text-primary transition-colors duration-200 rotate-180" />
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-dark-text-muted">
                    {availableLanguages.length > 0
                      ? `No chapters available in ${
                          languages.find((lang) => lang.code === selectedLanguage)?.name ||
                          selectedLanguage
                        }`
                      : 'No chapters available'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </FadeInOnScroll>
      </main>
    </div>
  );
};

export default MangaDetail;
