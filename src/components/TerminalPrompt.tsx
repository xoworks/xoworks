'use client';

import React, { RefObject } from 'react';

interface TerminalPromptProps {
  command: string;
  setCommand: React.Dispatch<React.SetStateAction<string>>;
  handleCommandSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  promptSymbol: string;
  inputRef: RefObject<HTMLInputElement>;
}

export const TerminalPrompt: React.FC<TerminalPromptProps> = ({
  command,
  setCommand,
  handleCommandSubmit,
  handleKeyDown,
  promptSymbol,
  inputRef,
}) => {
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
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Command input"
        autoComplete="off"
        autoFocus
      />
    </form>
  );
};
