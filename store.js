// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clubReducer from './slices/clubSlice'; // Import the clubReducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    club: clubReducer, // Add the club reducer here
  },
});
