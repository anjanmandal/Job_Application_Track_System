// src/theme.js
import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => {
  return {
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode palette
            primary: { main: '#3F51B5' },    // Indigo 500
            secondary: { main: '#FF4081' },  // Pink A200
            background: {
              default: '#F5F5F5',            // Grey 100
              paper: '#FFFFFF',              // White
            },
            text: {
              primary: '#212121',            // Grey 900
              secondary: '#757575',          // Grey 600
            },
          }
        : {
            // Dark mode palette
            primary: { main: '#7986CB' },    // Indigo 300
            secondary: { main: '#FF4081' },  // Pink A200
            background: {
              default: '#303030',            // Grey 800
              paper: '#424242',              // Grey 700
            },
            text: {
              primary: '#FFFFFF',            // White
              secondary: '#BDBDBD',          // Grey 400
            },
          }),
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
    components: {
      // Optional: Customize component styles here
    },
  };
};
