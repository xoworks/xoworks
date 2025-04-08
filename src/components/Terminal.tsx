'use client';

import React, { RefObject, useEffect, useRef, useState } from 'react';

import { useTheme } from '../contexts/ThemeContext';
import { useTerminalBoot } from '../hooks/useTerminalBoot';
import { useTerminalCommands } from '../hooks/useTerminalCommands';
import { useTerminalInput } from '../hooks/useTerminalInput';
import TerminalOutput from './TerminalOutput';
import { TerminalPrompt } from './TerminalPrompt';
import ThemeMenu from './ThemeMenu';

/**
 * Terminal Component
 * - Fixed window size using CSS variables for responsive layout
 * - Resolved TypeScript type issues with RefObject typing
 * - Enhanced focus handling for better user experience
 * - Improved theme switching with ThemeMenu component
 */
export default function Terminal() {
  const { currentTheme } = useTheme();
  const [isDisconnected, setIsDisconnected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const initialBootRef = useRef(true);

  // Clear session storage on first mount
  useEffect(() => {
    if (initialBootRef.current && typeof window !== 'undefined') {
      sessionStorage.removeItem('terminal-history');
      initialBootRef.current = false;
    }
  }, []);

  // Use custom hooks
  const { isBooting, history, setHistory, rebootTerminal } = useTerminalBoot();

  const { availableCommands, processCommand } = useTerminalCommands(
    setHistory,
    setIsDisconnected
  );

  const {
    command,
    setCommand,
    handleCommandSubmit,
    handleKeyDown,
    setupGlobalKeyboardShortcuts,
  } = useTerminalInput({
    processCommand,
    history,
    setHistory,
    availableCommands,
    prompt: currentTheme.prompt,
    inputRef: inputRef as RefObject<HTMLInputElement>,
  });

  // Auto-focus the input when the terminal is done booting
  useEffect(() => {
    if (!isBooting && !isDisconnected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isBooting, isDisconnected]);

  // Re-focus input when it loses focus
  useEffect(() => {
    const handleFocusOut = () => {
      if (
        !isBooting &&
        !isDisconnected &&
        inputRef.current &&
        document.activeElement !== inputRef.current
      ) {
        setTimeout(() => {
          // Check if focus is still outside the input and not on a dialog
          if (
            document.activeElement !== inputRef.current &&
            !document.activeElement?.closest('[role="dialog"]') &&
            inputRef.current
          ) {
            inputRef.current.focus();
          }
        }, 10);
      }
    };

    document.addEventListener('click', handleFocusOut);

    return () => {
      document.removeEventListener('click', handleFocusOut);
    };
  }, [isBooting, isDisconnected]);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  // Set up global keyboard shortcuts
  useEffect(() => {
    return setupGlobalKeyboardShortcuts();
  }, [setupGlobalKeyboardShortcuts]);

  // Focus input when clicking anywhere in the terminal
  const handleTerminalClick = () => {
    if (inputRef.current && !isBooting && !isDisconnected) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <ThemeMenu />

      <div className="terminal-container">
        <div className="terminal">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <div
                className="terminal-button terminal-button-close"
                aria-hidden="true"
              ></div>
              <div
                className="terminal-button terminal-button-minimize"
                aria-hidden="true"
              ></div>
              <div
                className="terminal-button terminal-button-maximize"
                aria-hidden="true"
              ></div>
            </div>
            <div className="terminal-title">XO_Works Terminal</div>
            <div className="terminal-buttons-spacer" aria-hidden="true"></div>
          </div>
          <div
            className="terminal-body"
            onClick={handleTerminalClick}
            ref={terminalBodyRef}
            role="region"
            aria-label="Terminal Interface"
          >
            {isDisconnected ? (
              <div className="disconnected-message">
                Connection to XO_Works terminated.
              </div>
            ) : (
              <>
                {/* Terminal output */}
                <TerminalOutput history={history} />

                {/* Command input */}
                {!isBooting && (
                  <TerminalPrompt
                    command={command}
                    setCommand={setCommand}
                    handleCommandSubmit={handleCommandSubmit}
                    handleKeyDown={handleKeyDown}
                    promptSymbol={currentTheme.prompt}
                    inputRef={inputRef as RefObject<HTMLInputElement>}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
