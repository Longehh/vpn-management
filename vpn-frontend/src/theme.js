import { createTheme } from '@mui/material/styles';
import alatsiFont from './assets/fonts/alatsi.woff2';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(213, 54, 54, 0.85)',
      dark: 'rgb(237, 65, 65)',
      contrastText: '#fff',
    },
    background: {
      default: '#171717',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255,255,255,0.55)',
    },
  },
  typography: {
    fontFamily: "'Alatsi', sans-serif",
    h1: { fontFamily: "'Alatsi', sans-serif" },
    h2: { fontFamily: "'Alatsi', sans-serif" },
    h3: { fontFamily: "'Alatsi', sans-serif" },
    h4: { fontFamily: "'Alatsi', sans-serif" },
    h5: { fontFamily: "'Alatsi', sans-serif" },
    h6: { fontFamily: "'Alatsi', sans-serif" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '1px',
          fontFamily: "'Alatsi', sans-serif",
          fontWeight: 'bold',
          boxShadow: 'inset 0px 0px 4px rgb(255, 255, 255)',
          border: '1px inset rgb(54,62,213)',
          background: 'rgba(54,67,213,0.85)',
          '&:hover': {
            background: 'rgb(54,62,213)',
          },
        }
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(23,23,23,0.92)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Alatsi';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url(${alatsiFont}) format('woff2');
        }
      `,
    },
  },
});

export default theme;
