/**
 * Shared type definitions
 */

// Terminal line type used for terminal output history
export type TerminalLine = {
  type: 'input' | 'output' | 'error' | 'system';
  content: string | string[];
};

// Theme-related types
export type Theme = {
  id: string;
  name: string;
  prompt: string;
  colors: ThemeColors;
};

export type ThemeColors = {
  background: string;
  text: string;
  accent: string;
  header: string;
  border: string;
};

export type ThemeContextType = {
  currentTheme: Theme;
  themeList: string[];
  changeTheme: (themeId: string) => void;
};

// Terminal command-related types
export type CommandHandler = (args: string[]) => TerminalLine;

export type CommandDefinition = {
  description: string;
  usage?: string;
  handler: CommandHandler;
};

export type Commands = Record<string, CommandDefinition>;
