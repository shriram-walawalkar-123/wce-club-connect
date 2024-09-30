import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  clubName: '',
  email: '',
  password: '',
  collegeName: '',
  clubId: '',
  isStudentSignup: true,
  role: 'Student', // default role set to 'Student'
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Setters for the input fields
    setName: (state, action) => {
      state.name = action.payload;
    },
    setClubName: (state, action) => {
      state.clubName = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setCollegeName: (state, action) => {
      state.collegeName = action.payload;
    },
    setClubId: (state, action) => {
      state.clubId = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    // Toggle between student and admin signup mode
    toggleSignupMode: (state, action) => {
      state.isStudentSignup = action.payload;
    },
    // Clear the state after logout or reset
    clearAuthState: (state) => {
      state.name = '';
      state.clubName = '';
      state.email = '';
      state.password = '';
      state.collegeName = '';
      state.clubId = '';
      state.isAuthenticated = false;
      state.user = null;
      state.role = 'Student'; // Reset to default role
    },
  },
});

export const {
  setName,
  setClubName,
  setEmail,
  setPassword,
  setCollegeName,
  setClubId,
  setRole,
  setUser,
  setAuthentication,
  toggleSignupMode,
  clearAuthState,
} = authSlice.actions;

export default authSlice.reducer;
