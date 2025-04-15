'use client';

import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useTheme } from '../contexts/ThemeContext';
import { useTerminalBoot } from '../hooks/useTerminalBoot';
import { useTerminalCommands } from '../hooks/useTerminalCommands';
import { useTerminalInput } from '../hooks/useTerminalInput';
import TerminalOutput from './TerminalOutput';
import { TerminalPrompt } from './TerminalPrompt';
import ThemeMenu from './ThemeMenu';

const Terminal = () => {
  const { currentTheme } = useTheme();
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const initialBootRef = useRef(true);
  const terminalId = 'main-terminal';
  const terminalLabelId = 'terminal-header-title';

  // Clear session storage on first mount
  useEffect(() => {
    if (initialBootRef.current && typeof window !== 'undefined') {
      sessionStorage.removeItem('terminal-history');
      initialBootRef.current = false;
    }
  }, []);

  // Trigger animation after component mounts
  useEffect(() => {
    // Small delay to ensure the animation starts after render
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Use custom hooks
  const {
    isBooting,
    history,
    setHistory,
    rebootTerminal: _rebootTerminal,
  } = useTerminalBoot();

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
    const handleFocusOut = (_event: MouseEvent) => {
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
  const handleTerminalClick = useCallback(() => {
    if (inputRef.current && !isBooting && !isDisconnected) {
      inputRef.current.focus();
    }
  }, [isBooting, isDisconnected]);

  // Memoize the terminal class to prevent unnecessary re-renders
  const terminalContainerClass = useMemo(
    () => `terminal-container ${isVisible ? 'terminal-appear' : ''}`,
    [isVisible]
  );

  // Get current status message for screen readers
  const getStatusMessage = useCallback(() => {
    if (isDisconnected) {
      return 'Terminal connection terminated.';
    }
    if (isBooting) {
      return 'Terminal is booting. Please wait.';
    }
    return 'Terminal ready for input.';
  }, [isBooting, isDisconnected]);

  // Memoize the terminal content
  const terminalContent = useMemo(() => {
    if (isDisconnected) {
      return (
        <div
          className="disconnected-message"
          role="alert"
          aria-live="assertive"
        >
          Connection to XO_Works terminated.
        </div>
      );
    }

    return (
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
    );
  }, [
    isDisconnected,
    history,
    isBooting,
    command,
    setCommand,
    handleCommandSubmit,
    handleKeyDown,
    currentTheme.prompt,
  ]);

  return (
    <main>
      <ThemeMenu />

      <div
        className={terminalContainerClass}
        aria-atomic="false"
        aria-relevant="additions"
        aria-live={isBooting ? 'assertive' : 'polite'}
      >
        <div
          className="terminal"
          role="application"
          aria-label="XO_Works Terminal Emulator"
          id={terminalId}
          aria-describedby={terminalLabelId}
        >
          <header className="terminal-header">
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
            <h1 className="terminal-title" id={terminalLabelId}>
              XO_Works Terminal
            </h1>
            <div className="terminal-buttons-spacer" aria-hidden="true"></div>
          </header>
          <div
            className="terminal-body"
            onClick={handleTerminalClick}
            ref={terminalBodyRef}
            role="region"
            aria-label="Terminal Interface"
            aria-busy={isBooting}
            tabIndex={isBooting || isDisconnected ? 0 : -1}
          >
            <div className="sr-only" aria-live="polite">
              {getStatusMessage()}
            </div>
            {terminalContent}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Terminal;
