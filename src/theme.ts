import { createTheme } from '@mui/material/styles';

// Meta-SPA Color Palette (exact colors from meta-spa codebase)
export const metaSpaColors = {
  // Primary - Indigo
  primary: {
    main: '#6366F1',
    dark: '#4F46E5',
    light: '#818CF8',
    50: '#EEF2FF',
  },
  // Secondary - Blue
  secondary: {
    main: '#4058a7',
    dark: '#1E3A8A',
    light: '#60A5FA',
    50: '#EFF6FF',
  },
  // Success - Green
  success: {
    main: '#10B981',
    dark: '#047857',
    light: '#34D399',
    50: '#ECFDF5',
  },
  // Error - Red
  error: {
    main: '#C93A2B',
    dark: '#991B1B',
    light: '#F87171',
    50: '#FEF2F2',
  },
  // Warning - Orange
  warning: {
    main: '#F59E0B',
    dark: '#92400E',
    light: '#FBBF24',
    50: '#FEF3C7',
  },
  // Info - Cyan
  info: {
    main: '#06AED4',
    dark: '#0C4A6E',
    light: '#67E8F9',
    50: '#E0F2FE',
  },
  // Neutral/Grey scale
  grey: {
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
  // Background
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
    grey: '#F8F9FA',
  },
};

// Create Material-UI theme with meta-spa styling
export const metaSpaTheme = createTheme({
  palette: {
    primary: {
      main: metaSpaColors.primary.main,
      dark: metaSpaColors.primary.dark,
      light: metaSpaColors.primary.light,
    },
    secondary: {
      main: metaSpaColors.secondary.main,
      dark: metaSpaColors.secondary.dark,
      light: metaSpaColors.secondary.light,
    },
    success: {
      main: metaSpaColors.success.main,
      dark: metaSpaColors.success.dark,
      light: metaSpaColors.success.light,
    },
    error: {
      main: metaSpaColors.error.main,
      dark: metaSpaColors.error.dark,
      light: metaSpaColors.error.light,
    },
    warning: {
      main: metaSpaColors.warning.main,
      dark: metaSpaColors.warning.dark,
      light: metaSpaColors.warning.light,
    },
    info: {
      main: metaSpaColors.info.main,
      dark: metaSpaColors.info.dark,
      light: metaSpaColors.info.light,
    },
    grey: metaSpaColors.grey,
    background: {
      default: metaSpaColors.background.default,
      paper: metaSpaColors.background.paper,
    },
  },
  typography: {
    fontFamily: 'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 8, // Default border radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // No uppercase transformation
          fontWeight: 700,
          borderRadius: '50px', // Pill-shaped buttons
          minHeight: 46,
          fontSize: 14,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '50px',
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
            },
          },
          '& .MuiOutlinedInput-root.MuiInputBase-multiline': {
            borderRadius: '20px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: '20px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '30px',
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
});

export default metaSpaTheme;
