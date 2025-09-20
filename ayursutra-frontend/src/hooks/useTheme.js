import { useAppSelector, useAppDispatch } from './redux';
import { toggleTheme, setTheme } from '../store/slices/themeSlice';
import { useEffect } from 'react';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const { mode, primaryColor } = useAppSelector((state) => state.theme);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const setMode = (mode) => {
    dispatch(setTheme(mode));
  };

  useEffect(() => {
    // Apply theme to document
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return {
    mode,
    primaryColor,
    toggle,
    setMode,
    isDark: mode === 'dark',
  };
};
