/**
 * Theme Configuration
 * Define as cores e estilos baseados no tema da UFCAT
 */

// Colors that don't change between themes
const commonColors = {
  ufcatGreen: '#018786',
  ufcatGreenDark: '#39a2a2',
  ufcatBlack: '#1C1C1C',
  success: '#00A859',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',
  
  // Grid Specific Colors
  M_PeriodColor: '#B2DFDB',
  T_PeriodColor: '#FFCC80',
  N_PeriodColor: '#CE93D8',
  
  // Gradient Colors
  UfcatOrange: '#FD841A',
  UfcatRed: '#EE2D55',
  UfcatOrangeDark: '#FF8C00',
  
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Base configuration shared across themes
const baseConfig = {
  spacing: {
    xxs: '2px',
    xs: '4px',
    sm: '8px',
    mmd: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  }
};

export const lightTheme = {
  ...baseConfig,
  colors: {
    ...commonColors,
    background: '#FFFFFF',
    backgroundToggleTheme: '#121212',
    backgroundDark: '#F5F5F5',
    grayElements: '#F0F0F0',
    cardBackground: '#FFFFFF',
    cardBorder: '#E0E0E0',
    
    // Text
    textPrimary: '#1C1C1C',
    textSecondary: '#666666',
    textLight: '#999999',
    
    // Navigation
    navBackground: '#297A7D',
    navText: '#FFFFFF',
    navTextSecondary: 'rgba(255, 255, 255, 0.7)',
  }
};

export const darkTheme = {
  ...baseConfig,
  colors: {
    ...commonColors,
    background: '#121212',
    backgroundToggleTheme: '#FFFFFF',
    backgroundDark: '#1E1E1E',
    grayElements: '#2D2D2D',
    cardBackground: '#1E1E1E',
    cardBorder: '#333333',
    
    // Text
    textPrimary: '#E0E0E0',
    textSecondary: '#A0A0A0',
    textLight: '#707070',
    
    // Navigation
    navBackground: '#1A1A1A',
    navText: '#FFFFFF',
    navTextSecondary: 'rgba(255, 255, 255, 0.5)',
  }
};

const theme = lightTheme;
export default theme;
