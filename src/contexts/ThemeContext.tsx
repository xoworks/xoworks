'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import themesData from '../data/themes.json';
import { Theme, ThemeContextType } from '../types';

// Create a record of themes from the JSON data with default colors
const themes: Record<string, Theme> = {};

// Map of default colors for themes
const themeColorMap: Record<string, Theme['colors']> = {
  classic: {
    background: '#000000',
    text: '#33ff33',
    accent: '#00ff00',
    header: '#272727',
    border: '#333',
  },
  dark: {
    background: '#121212',
    text: '#f0f0f0',
    accent: '#64eda8',
    header: '#272727',
    border: '#333',
  },
  light: {
    background: '#ffffff',
    text: '#333333',
    accent: '#27ae60',
    header: '#e0e0e0',
    border: '#ccc',
  },
  green: {
    background: '#001100',
    text: '#00ff00',
    accent: '#33ff33',
    header: '#002200',
    border: '#222',
  },
  amber: {
    background: '#100800',
    text: '#ffb000',
    accent: '#ffaa00',
    header: '#201000',
    border: '#222',
  },
  solarized: {
    background: '#002b36',
    text: '#839496',
    accent: '#268bd2',
    header: '#073642',
    border: '#333',
  },
  chicago: {
    background: '#0000aa',
    text: '#aaaaaa',
    accent: '#ffffff',
    header: '#0c2956',
    border: '#333',
  },
  synthwave: {
    background: '#241b2f',
    text: '#ff7edb',
    accent: '#f97e72',
    header: '#34263f',
    border: '#333',
  },
  ubuntu: {
    background: '#300a24',
    text: '#ffffff',
    accent: '#89e033',
    header: '#484244',
    border: '#333',
  },
};

themesData.themes.forEach((theme) => {
  themes[theme.id] = {
    id: theme.id,
    name: theme.name,
    prompt: theme.prompt,
    colors: themeColorMap[theme.id] || themeColorMap.dark,
  };
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
