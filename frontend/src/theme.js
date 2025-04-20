import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0', // Purple
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    secondary: {
      main: '#e91e63', // Pink
      light: '#f48fb1',
      dark: '#c2185b',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
          boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #7b1fa2 30%, #c2185b 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.MuiAppBar-root': {
            borderRadius: 0
          }
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    h4: {
      fontWeight: 600,
      color: '#424242',
    },
    h6: {
      fontWeight: 500,
    },
  },
}); 