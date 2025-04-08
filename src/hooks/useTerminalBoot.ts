'use client';

import { useCallback, useEffect, useState } from 'react';

import asciiArtData from '../data/ascii-art.json';

export type TerminalLine = {
  type: 'input' | 'output' | 'error' | 'system';
  content: string | string[];
};

export const useTerminalBoot = () => {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const [bootStep, setBootStep] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Update date/time regularly
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reboot function
  const rebootTerminal = useCallback(() => {
    setIsBooting(true);
    setBootStep(0);
    setHistory([]);
  }, []);

  // Boot sequence
  useEffect(() => {
    if (!isBooting) return;

    const bootSequence = [
      { type: 'system' as const, content: 'XO_Works System v1.0.0' },
      { type: 'system' as const, content: 'System boot initiated...' },
      { type: 'system' as const, content: 'Loading kernel modules...' },
      { type: 'system' as const, content: 'Initializing systems...' },
      { type: 'system' as const, content: 'System ready.' },
    ];

    if (bootStep < bootSequence.length) {
      // Add the current boot step to history
      setHistory((prev) => [...prev, bootSequence[bootStep]]);

      // Speed up delays for faster boot sequence
      const delays = [100, 150, 150, 150, 150];
      const delay = delays[bootStep] || 100;

      setTimeout(() => {
        setBootStep((prev) => prev + 1);
      }, delay);
    } else if (bootStep === bootSequence.length) {
      // Add a pause after boot sequence before showing ASCII art
      setTimeout(() => {
        // Reset history completely before adding ASCII art
        setHistory([]);

        // Start ASCII art display process
        setBootStep(bootSequence.length + 1);
      }, 600); // Longer pause after boot sequence
    } else if (
      bootStep > bootSequence.length &&
      bootStep < bootSequence.length + asciiArtData.asciiArt.length + 1
    ) {
      // Display ASCII art one line at a time
      const asciiIndex = bootStep - bootSequence.length - 1;

      if (asciiIndex < asciiArtData.asciiArt.length) {
        // Add the current ASCII line to history
        setHistory((prev) => [
          ...prev,
          {
            type: 'output' as const,
            content: asciiArtData.asciiArt[asciiIndex],
          },
        ]);

        // Schedule next line with a short delay
        setTimeout(() => {
          setBootStep((prev) => prev + 1);
        }, 30);
      }
    } else if (
      bootStep ===
      bootSequence.length + asciiArtData.asciiArt.length + 1
    ) {
      // Show welcome message after ASCII logo is complete
      setTimeout(() => {
        // Format date similar to real terminal login message
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };
        const formattedDate = now.toLocaleDateString('en-US', options);

        setHistory((prev) => [
          ...prev,
          { type: 'output' as const, content: '' },
          {
            type: 'system' as const,
            content: `Last login: ${formattedDate} on ttys001`,
          },
          { type: 'output' as const, content: '' },
          {
            type: 'output' as const,
            content:
              "Welcome to XO_Works. Type 'help' to see available commands.",
          },
        ]);

        // Mark boot sequence as complete after a delay
        setTimeout(() => {
          setIsBooting(false);
        }, 100); // Faster transition
      }, 100); // Shorter pause before welcome message
    }
  }, [bootStep, isBooting]);

  // Load history from session storage
  useEffect(() => {
    if (typeof window !== 'undefined' && !isBooting) {
      const savedHistory = sessionStorage.getItem('terminal-history');
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error('Error loading history from session storage', e);
        }
      }
    }
  }, [isBooting]);

  return {
    history,
    setHistory,
    isBooting,
    currentDateTime,
    rebootTerminal,
  };
};
