// src/context/ThemeContext.js
import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getDesignTokens } from '../Theme/theme'; // Adjust the path if necessary

// Create the ColorModeContext with default values
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
});

// Create a provider component
const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light'); // Initialize theme mode

  // Memoize the toggle function to prevent unnecessary re-renders
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  // Memoize the theme to optimize performance
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default CustomThemeProvider;
