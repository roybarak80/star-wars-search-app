// src/theme.ts
import { createTheme, ThemeOptions } from '@mui/material';

// Define the dark theme with TypeScript typing
const darkTheme: ThemeOptions = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffd54e', // Light blue for primary color
    },
    secondary: {
      main: '#ffd54e', // Pink for secondary color
    },
    background: {
      default: '#121212', // Dark background for the app
      paper: '#1d1d1d',   // Darker background for components like cards and dialogs
    },
    text: {
      primary: '#ffd54e', // White text color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      color: '#ffd54e',
      fontSize: '1.5rem',
      fontWeight: 800,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Custom border radius for all buttons
        },
      },
    },
  },
});

export default darkTheme;
