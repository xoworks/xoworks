'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import themesData from '../data/themes.json';

type Theme = {
  id: string;
  name: string;
  prompt: string;
};

type ThemeContextType = {
  currentTheme: Theme;
  themeList: string[];
  changeTheme: (themeId: string) => void;
};

// Create a record of themes from the JSON data
const themes: Record<string, Theme> = {};
themesData.themes.forEach((theme) => {
  themes[theme.id] = theme;
});

const DEFAULT_THEME = 'dark';

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: themes[DEFAULT_THEME] || themes.classic,
  themeList: Object.keys(themes),
  changeTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    themes[DEFAULT_THEME] || themes.classic
  );

  // Load saved theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('terminal-theme');

      // Remove any existing theme classes first
      Object.keys(themes).forEach((theme) => {
        document.body.classList.remove(`theme-${theme}`);
      });

      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(themes[savedTheme]);
        document.body.classList.add(`theme-${savedTheme}`);
      } else {
        // Set default theme
        document.body.classList.add(`theme-${DEFAULT_THEME}`);
      }
    }
  }, []);

  const changeTheme = (themeId: string) => {
    if (themes[themeId]) {
      console.log(`Applying theme "${themes[themeId].name}" (${themeId})`);

      // Remove all theme classes
      Object.keys(themes).forEach((theme) => {
        document.body.classList.remove(`theme-${theme}`);
      });

      // Add new theme class
      document.body.classList.add(`theme-${themeId}`);

      // Update current theme
      setCurrentTheme(themes[themeId]);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('terminal-theme', themeId);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeList: Object.keys(themes),
        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
