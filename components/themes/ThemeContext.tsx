import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import { lightTheme, darkTheme, Theme } from './themes';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    // TODO: invert after testing
    setTheme(colorScheme === 'dark' ? lightTheme: darkTheme );
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};