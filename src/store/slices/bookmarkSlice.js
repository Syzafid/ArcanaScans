import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookmarkedManga: [],
  loading: false,
  error: null,
};

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    loadBookmarksForUser: (state, action) => {
      const userId = action.payload;
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem(`bookmarks_${userId}`);
        state.bookmarkedManga = data ? JSON.parse(data) : [];
      } else {
        state.bookmarkedManga = [];
      }
      state.loading = false;
      state.error = null;
    },

    addBookmark: (state, action) => {
      const { manga, userId } = action.payload;

      const exists = state.bookmarkedManga.find(item => item.id === manga.id);
      if (!exists) {
        const newBookmark = {
          id: manga.id,
          title: manga.attributes?.title?.en || 'Unknown Title',
          coverFileName:
            manga.relationships?.find(rel => rel.type === 'cover_art')?.attributes?.fileName,
          addedAt: new Date().toISOString(),
          manga: manga,
        };

        state.bookmarkedManga.push(newBookmark);

        if (userId && typeof window !== 'undefined') {
          localStorage.setItem(
            `bookmarks_${userId}`,
            JSON.stringify(state.bookmarkedManga)
          );
        }
      }
    },

    removeBookmark: (state, action) => {
      const { id: mangaId, userId } = action.payload;

      state.bookmarkedManga = state.bookmarkedManga.filter(item => item.id !== mangaId);

      if (userId && typeof window !== 'undefined') {
        localStorage.setItem(
          `bookmarks_${userId}`,
          JSON.stringify(state.bookmarkedManga)
        );
      }
    },

    clearBookmarks: (state) => {
      state.bookmarkedManga = [];
    },

    setBookmarkLoading: (state, action) => {
      state.loading = action.payload;
    },

    setBookmarkError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  loadBookmarksForUser,
  addBookmark,
  removeBookmark,
  clearBookmarks,
  setBookmarkLoading,
  setBookmarkError,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
