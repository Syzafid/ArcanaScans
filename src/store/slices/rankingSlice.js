
import { createSlice } from '@reduxjs/toolkit';

// Mock data for initial rankings
const mockRankings = [
  { id: 1, mangaId: 'rank-1', title: 'One Piece', rank: 1, coverFileName: 'cover-1', score: 9.8 },
  { id: 2, mangaId: 'rank-2', title: 'Attack on Titan', rank: 2, coverFileName: 'cover-2', score: 9.5 },
  { id: 3, mangaId: 'rank-3', title: 'Demon Slayer', rank: 3, coverFileName: 'cover-3', score: 9.3 },
  { id: 4, mangaId: 'rank-4', title: 'Naruto', rank: 4, coverFileName: 'cover-4', score: 9.1 },
  { id: 5, mangaId: 'rank-5', title: 'Dragon Ball', rank: 5, coverFileName: 'cover-5', score: 9.0 },
];

const initialState = {
  rankings: mockRankings,
  loading: false,
  error: null,
};

const rankingSlice = createSlice({
  name: 'rankings',
  initialState,
  reducers: {
    setRankings: (state, action) => {
      state.rankings = action.payload.sort((a, b) => a.rank - b.rank);
    },
    addRanking: (state, action) => {
      const newRanking = action.payload;
      const exists = state.rankings.find(item => item.id === newRanking.id);
      if (!exists) {
        state.rankings.push(newRanking);
        state.rankings.sort((a, b) => a.rank - b.rank);
      }
    },
    updateRanking: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.rankings.findIndex(item => item.id === id);
      if (index !== -1) {
        state.rankings[index] = { ...state.rankings[index], ...updates };
        state.rankings.sort((a, b) => a.rank - b.rank);
      }
    },
    removeRanking: (state, action) => {
      const id = action.payload;
      state.rankings = state.rankings.filter(item => item.id !== id);
    },
    setRankingLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRankingError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRankings,
  addRanking,
  updateRanking,
  removeRanking,
  setRankingLoading,
  setRankingError,
} = rankingSlice.actions;

export default rankingSlice.reducer;
