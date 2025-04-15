'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useTheme } from '../contexts/ThemeContext';
import themesData from '../data/themes.json';

const ThemeMenu: React.FC = () => {
  const { themeList, changeTheme, currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeSelect = (theme: string) => {
    changeTheme(theme);
    setIsOpen(false);
  };

  // Get theme name from ID
  const getThemeName = (themeId: string): string => {
    const theme = themesData.themes.find((t) => t.id === themeId);
    return theme
      ? theme.name
      : themeId.charAt(0).toUpperCase() + themeId.slice(1);
  };

  // Get theme accent color for preview
  const getThemeColor = (themeId: string): string => {
    // Map theme IDs to their accent colors (matching CSS values)
    const themeColors: Record<string, string> = {
      classic: '#000000',
      dark: '#272727',
      light: '#F1F1F1',
      green: '#08A00A',
      amber: '#EEA403',
      solarized: '#268BD2',
      chicago: '#0000A1',
      synthwave: '#834579',
      ubuntu: '#dd4814',
    };

    return themeColors[themeId] || '#ffffff';
  };

  return (
    <div className="theme-menu-container" ref={menuRef}>
      <button
        className="theme-menu-button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span
          className="theme-color-preview"
          style={{ backgroundColor: getThemeColor(currentTheme.id) }}
          aria-hidden="true"
        ></span>{' '}
        Theme
      </button>

      {isOpen && (
        <div className="theme-menu" role="menu">
          <div className="theme-menu-title">Select Theme</div>
          <div className="theme-menu-options">
            {themeList.map((theme) => (
              <button
                key={theme}
                className={`theme-menu-option ${theme === currentTheme.id ? 'active' : ''}`}
                onClick={() => handleThemeSelect(theme)}
                role="menuitem"
              >
                <span
                  className="theme-color-preview"
                  style={{ backgroundColor: getThemeColor(theme) }}
                ></span>
                {getThemeName(theme)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeMenu;
