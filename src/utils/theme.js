/**
 * Theme Configuration
 * Define as cores e estilos baseados no tema da UFCAT
 */

const theme = {
  colors: {
    // Cores principais da UFCAT
    ufcatGreen: '#018786',
    ufcatBlack: '#1C1C1C',
    
    // Cores de fundo
    background: '#FFFFFF',
    backgroundDark: '#F5F5F5',
    grayElements: '#F0F0F0',
    
    // Cores de texto
    textPrimary: '#1C1C1C',
    textSecondary: '#666666',
    textLight: '#999999',
    
    // Cores de estado
    success: '#00A859',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#007AFF',
    
    // Cores de navegação
    navBackground: '#297A7D',
    navText: '#FFFFFF',
    navTextSecondary: 'rgba(255, 255, 255, 0.7)',
    
    // Cores de card/surface
    cardBackground: '#FFFFFF',
    cardBorder: '#E0E0E0',
    
    // Sombras
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
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

export default theme;
