import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isStudentSignup: true,
  name: '',
  clubName: '',
  email: '',
  password: '',
  CollegeName: '',
  clubId: '',
  role: 'student', // Default role
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
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
      state.CollegeName = action.payload;
    },
    setClubId: (state, action) => {
      state.clubId = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    toggleSignupMode: (state, action) => {
      state.isStudentSignup = action.payload;
      state.role = action.payload ? 'student' : 'club'; // Automatically set role when toggling mode
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
  toggleSignupMode,
} = authSlice.actions;

export default authSlice.reducer;
