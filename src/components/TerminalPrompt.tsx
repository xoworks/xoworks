'use client';

import React, { RefObject, memo, useCallback, useId } from 'react';

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
  const promptId = useId();
  const labelId = `cmd-label-${promptId}`;

  // Memoize the onChange handler to prevent recreating it on each render
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCommand(e.target.value);
    },
    [setCommand]
  );

  return (
    <form
      onSubmit={handleCommandSubmit}
      className="prompt"
      aria-label="Command input form"
      role="search"
    >
      <label
        htmlFor={labelId}
        className="prompt-symbol"
        aria-label={`Terminal prompt: ${promptSymbol}`}
      >
        <span aria-hidden="true">guest@xo.works {promptSymbol}</span>
      </label>
      <input
        id={labelId}
        ref={inputRef}
        type="text"
        className="command-input"
        value={command}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label="Enter terminal command"
        aria-autocomplete="list"
        aria-haspopup="true"
        aria-describedby="terminal-cmd-help"
        autoComplete="off"
        autoFocus
        role="combobox"
      />
      <div id="terminal-cmd-help" className="sr-only">
        Enter command and press Enter to execute. Use arrow keys for command
        history.
      </div>
    </form>
  );
};

export const TerminalPrompt = memo(TerminalPromptComponent);
TerminalPrompt.displayName = 'TerminalPrompt';
