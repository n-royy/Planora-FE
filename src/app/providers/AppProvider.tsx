import React, { useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryProvider } from './QueryProvider';
import { getTheme } from '@/design-system';
import { initCSRFToken } from '@/utils/security/csrf';
import { useThemeStore } from '@/stores/themeStore';
import useMediaQuery from '@mui/material/useMediaQuery';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { mode } = useThemeStore();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    // Initialize CSRF token on app mount
    initCSRFToken();
  }, []);

  const actualMode = useMemo(() => {
    if (mode === 'system') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return mode;
  }, [mode, prefersDarkMode]);

  const theme = useMemo(() => getTheme(actualMode), [actualMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
};
