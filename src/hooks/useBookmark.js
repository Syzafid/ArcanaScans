import { useSelector, useDispatch } from 'react-redux';
import { addBookmark, removeBookmark } from '../store/slices/bookmarkSlice';

const useBookmark = () => {
  const dispatch = useDispatch();
  const { bookmarkedManga } = useSelector((state) => state.bookmarks);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const isBookmarked = (mangaId) => {
    return bookmarkedManga.some(item => item.id === mangaId);
  };

  const toggleBookmark = (manga) => {
    if (!isAuthenticated || !user?.id) {
      alert('Please log in to bookmark manga');
      return;
    }

    if (isBookmarked(manga.id)) {
      dispatch(removeBookmark({ id: manga.id, userId: user.id }));
    } else {
      dispatch(addBookmark({ manga, userId: user.id }));
    }
  };

  const addToBookmarks = (manga) => {
    if (!isAuthenticated || !user?.id) {
      alert('Please log in to bookmark manga');
      return;
    }
    dispatch(addBookmark({ manga, userId: user.id }));
  };

  const removeFromBookmarks = (mangaId) => {
    if (!user?.id) return;
    dispatch(removeBookmark({ id: mangaId, userId: user.id }));
  };

  return {
    bookmarkedManga,
    isBookmarked,
    toggleBookmark,
    addToBookmarks,
    removeFromBookmarks,
    isAuthenticated,
  };
};

export default useBookmark;
