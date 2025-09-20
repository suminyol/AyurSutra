import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeState } from '../../types';

const initialState: ThemeState = {
  mode: (localStorage.getItem('ayursutra_theme') as 'light' | 'dark') || 'light',
  primaryColor: '#0ea5e9',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('ayursutra_theme', state.mode);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      localStorage.setItem('ayursutra_theme', state.mode);
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setPrimaryColor } = themeSlice.actions;
export default themeSlice.reducer;
