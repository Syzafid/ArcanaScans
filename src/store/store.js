import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import bookmarkReducer from './slices/bookmarkSlice';
import userReducer from './slices/userSlice';
import rankingReducer from './slices/rankingSlice';
import authReducer from './slices/authSlice'; // Tambahan

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['bookmarks', 'auth'], // simpan auth juga
};

const rootReducer = combineReducers({
  bookmarks: bookmarkReducer,
  user: userReducer,
  rankings: rankingReducer,
  auth: authReducer, // Tambahan
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
