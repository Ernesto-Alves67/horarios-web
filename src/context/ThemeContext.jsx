import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../utils/theme';
import LocalStorageHelper from '../services/localStorage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const storedPref = localStorage.getItem('theme_mode');
    if (storedPref) {
      setIsDarkMode(storedPref === 'dark');
    } else {
      const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPref);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme_mode', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
