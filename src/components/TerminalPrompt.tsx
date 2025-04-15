'use client';

import React, { RefObject, memo, useCallback } from 'react';

interface TerminalPromptProps {
  command: string;
  setCommand: React.Dispatch<React.SetStateAction<string>>;
  handleCommandSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  promptSymbol: string;
  inputRef: RefObject<HTMLInputElement>;
}

const TerminalPromptComponent: React.FC<TerminalPromptProps> = ({
  command,
  setCommand,
  handleCommandSubmit,
  handleKeyDown,
  promptSymbol,
  inputRef,
}) => {
  // Memoize the onChange handler to prevent recreating it on each render
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCommand(e.target.value);
    },
    [setCommand]
  );

  return (
    <form onSubmit={handleCommandSubmit} className="prompt">
      <span className="prompt-symbol" aria-hidden="true">
        guest@xo.works {promptSymbol}
      </span>
      <input
        ref={inputRef}
        type="text"
        className="command-input"
        value={command}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label="Command input"
        autoComplete="off"
        autoFocus
      />
    </form>
  );
};

export const TerminalPrompt = memo(TerminalPromptComponent);
TerminalPrompt.displayName = 'TerminalPrompt';
