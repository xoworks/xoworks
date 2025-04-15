'use client';

import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTheme } from '../contexts/ThemeContext';
import themesData from '../data/themes.json';

const ThemeMenu: React.FC = () => {
  const { themeList, changeTheme, currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<Array<HTMLButtonElement | null>>([]);

  // Reset options ref array when theme list changes
  useEffect(() => {
    optionsRef.current = optionsRef.current.slice(0, themeList.length);
  }, [themeList]);

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

  // Handle keyboard events for the menu button
  const handleButtonKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'Enter':
        case ' ':
          e.preventDefault();
          setIsOpen(true);
          setFocusIndex(0);
          // Focus the first menu item on the next render
          setTimeout(() => {
            optionsRef.current[0]?.focus();
          }, 10);
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
        default:
          break;
      }
    },
    []
  );

  // Handle keyboard events for menu items
  const handleMenuItemKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number;
      let prevIndex: number;
      let lastIndex: number;
      const char = e.key.toLowerCase();

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (index < themeList.length - 1) {
            nextIndex = index + 1;
            setFocusIndex(nextIndex);
            optionsRef.current[nextIndex]?.focus();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (index > 0) {
            prevIndex = index - 1;
            setFocusIndex(prevIndex);
            optionsRef.current[prevIndex]?.focus();
          } else {
            // If at the top of the list, focus back on the button
            setIsOpen(false);
            buttonRef.current?.focus();
          }
          break;
        case 'Home':
          e.preventDefault();
          setFocusIndex(0);
          optionsRef.current[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          lastIndex = themeList.length - 1;
          setFocusIndex(lastIndex);
          optionsRef.current[lastIndex]?.focus();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleThemeSelect(themeList[index]);
          buttonRef.current?.focus();
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        default:
          // Handle letter navigation (first letter navigation)
          if (char.length === 1 && /[a-z]/.test(char)) {
            const themeNames = themeList.map((t) =>
              getThemeName(t).toLowerCase()
            );
            const matchingIndex = themeNames.findIndex(
              (name, i) => i > index && name.startsWith(char)
            );

            if (matchingIndex !== -1) {
              setFocusIndex(matchingIndex);
              optionsRef.current[matchingIndex]?.focus();
            } else {
              // Wrap around to the beginning if not found after current position
              const firstMatchIndex = themeNames.findIndex((name) =>
                name.startsWith(char)
              );
              if (firstMatchIndex !== -1) {
                setFocusIndex(firstMatchIndex);
                optionsRef.current[firstMatchIndex]?.focus();
              }
            }
          }
          break;
      }
    },
    [themeList]
  );

  const toggleMenu = useCallback(() => {
    setIsOpen((prevOpen) => !prevOpen);
    // Reset focus index when opening menu
    if (!isOpen) {
      setFocusIndex(0);
    }
  }, [isOpen]);

  const handleThemeSelect = useCallback(
    (theme: string) => {
      changeTheme(theme);
      setIsOpen(false);
      buttonRef.current?.focus();
    },
    [changeTheme]
  );

  // Auto-focus on first option when menu opens
  useEffect(() => {
    if (isOpen && optionsRef.current.length > 0) {
      // Find index of current theme first
      const currentIndex = themeList.findIndex(
        (theme) => theme === currentTheme.id
      );
      const indexToFocus = currentIndex !== -1 ? currentIndex : 0;
      setFocusIndex(indexToFocus);

      setTimeout(() => {
        optionsRef.current[indexToFocus]?.focus();
      }, 10);
    }
  }, [isOpen, themeList, currentTheme.id]);

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

  // Create unique ID for the menu for ARIA labeling
  const menuId = 'theme-menu';
  const menuLabelId = 'theme-menu-label';

  return (
    <div className="theme-menu-container" ref={menuRef}>
      <button
        ref={buttonRef}
        className="theme-menu-button"
        onClick={toggleMenu}
        onKeyDown={handleButtonKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={isOpen ? menuId : undefined}
        aria-label={`Theme Menu - Current: ${getThemeName(currentTheme.id)}`}
      >
        <span
          className="theme-color-preview"
          style={{ backgroundColor: getThemeColor(currentTheme.id) }}
          aria-hidden="true"
        ></span>{' '}
        Theme
      </button>

      {isOpen && (
        <div
          id={menuId}
          className="theme-menu"
          role="menu"
          aria-labelledby={menuLabelId}
          aria-orientation="vertical"
        >
          <div id={menuLabelId} className="theme-menu-title">
            Select Theme
          </div>
          <div className="theme-menu-options">
            {themeList.map((theme, index) => (
              <button
                key={theme}
                ref={(el) => {
                  optionsRef.current[index] = el;
                }}
                className={`theme-menu-option ${theme === currentTheme.id ? 'active' : ''}`}
                onClick={() => handleThemeSelect(theme)}
                onKeyDown={(e) => handleMenuItemKeyDown(e, index)}
                role="menuitem"
                tabIndex={focusIndex === index ? 0 : -1}
                aria-current={theme === currentTheme.id ? 'true' : undefined}
              >
                <span
                  className="theme-color-preview"
                  style={{ backgroundColor: getThemeColor(theme) }}
                  aria-hidden="true"
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
