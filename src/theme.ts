import { alpha, createTheme } from '@mui/material/styles'

const surfaceBorder = alpha('#8EB8FF', 0.18)

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#5da9ff',
      dark: '#0c4a9a',
    },
    secondary: {
      main: '#0b5cab',
    },
    background: {
      default: '#eef3f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#16324f',
      secondary: '#5c718a',
    },
    divider: surfaceBorder,
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.15rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: '0.95rem',
      fontWeight: 600,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 320,
          backgroundColor: '#eef3f8',
        },
        '#root': {
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: `1px solid ${surfaceBorder}`,
          boxShadow: '0 16px 40px rgba(17, 68, 114, 0.08)',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
})
