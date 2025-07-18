
import { useState, useEffect } from 'react';
import { getMangaGenres } from '../services/mangadexApi';

const GenreFilter = ({ onGenreChange, selectedGenres }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getMangaGenres();
        const genreList = response.data.filter(tag => 
          tag.attributes.group === 'genre'
        );
        setGenres(genreList);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreToggle = (genreId) => {
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    onGenreChange(updatedGenres);
  };

  if (loading) {
    return <div className="text-gray-500">Loading genres...</div>;
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">Filter by Genre</h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreToggle(genre.id)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedGenres.includes(genre.id)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {genre.attributes.name.en}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
