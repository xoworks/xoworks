'use client';

import { RefObject, useCallback, useState } from 'react';

import { TerminalLine } from './useTerminalCommands';

type UseTerminalInputProps = {
  processCommand: (cmd: string) => TerminalLine;
  history: TerminalLine[];
  setHistory: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
  availableCommands: string[];
  prompt: string;
  inputRef: RefObject<HTMLInputElement>;
};

export const useTerminalInput = ({
  processCommand,
  history,
  setHistory,
  availableCommands,
  prompt,
  inputRef,
}: UseTerminalInputProps) => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Clear terminal
  const clearTerminal = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  // Handle command submission
  const handleCommandSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      if (!command.trim()) return;

      // Add command to history
      const newHistory = [
        ...history,
        { type: 'input' as const, content: `${prompt} ${command}` },
      ];

      // Add to command history for up/down navigation
      setCommandHistory((prev) => [...prev, command]);
      setHistoryIndex(-1);

      // Process command
      const processedCommand = processCommand(command.trim().toLowerCase());
      setHistory([...newHistory, processedCommand]);
      setCommand('');

      // Save new commands to session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'terminal-history',
          JSON.stringify([...newHistory, processedCommand])
        );
      }

      // Focus the input after command submission
      if (inputRef?.current) {
        inputRef.current.focus();
      }
    },
    [command, history, prompt, processCommand, setHistory, inputRef]
  );

  // Handle tab completion
  const handleTabCompletion = useCallback(() => {
    if (!command.trim()) return;

    const matchingCommands = availableCommands.filter((cmd) =>
      cmd.startsWith(command.toLowerCase())
    );

    if (matchingCommands.length === 1) {
      // Exact match found
      setCommand(matchingCommands[0]);
    } else if (matchingCommands.length > 1) {
      // Multiple matches found, show possibilities
      setHistory((prev) => [
        ...prev,
        { type: 'input' as const, content: `${prompt} ${command}` },
        { type: 'system' as const, content: matchingCommands.join('  ') },
      ]);
    }
  }, [command, availableCommands, prompt, setHistory]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle keyboard shortcuts
      if (e.ctrlKey) {
        if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          clearTerminal();
          return;
        }
      }

      // Handle tab key for command completion
      if (e.key === 'Tab') {
        e.preventDefault();
        handleTabCompletion();
        return;
      }

      // Handle up arrow key to navigate command history
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (
          commandHistory.length > 0 &&
          historyIndex < commandHistory.length - 1
        ) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
      // Handle down arrow key to navigate command history
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCommand('');
        }
      }
    },
    [commandHistory, historyIndex, clearTerminal, handleTabCompletion]
  );

  // Handle global keyboard shortcuts
  const setupGlobalKeyboardShortcuts = useCallback(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        clearTerminal();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [clearTerminal]);

  return {
    command,
    setCommand,
    handleCommandSubmit,
    handleKeyDown,
    clearTerminal,
    setupGlobalKeyboardShortcuts,
  };
};
