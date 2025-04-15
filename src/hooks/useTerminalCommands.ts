'use client';

import { useCallback } from 'react';

import { useTheme } from '../contexts/ThemeContext';
import contentData from '../data/content.json';
import themesData from '../data/themes.json';
import { CommandDefinition, CommandHandler, TerminalLine } from '../types';

export const useTerminalCommands = (
  setHistory: React.Dispatch<React.SetStateAction<TerminalLine[]>>,
  setIsDisconnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { changeTheme, themeList } = useTheme();
  const availableCommands = Object.keys(contentData.commands);

  const processCommand = useCallback(
    (cmd: string): TerminalLine => {
      // Split command and arguments
      const [baseCmd, ...args] = cmd.split(' ');

      // Handle theme command separately
      if (
        baseCmd === 'theme' &&
        args.length > 0 &&
        themeList.includes(args[0])
      ) {
        changeTheme(args[0]);
        // Clear terminal when changing theme
        setTimeout(() => {
          setHistory([
            { type: 'system' as const, content: `Theme changed to ${args[0]}` },
          ]);
        }, 10);
        return {
          type: 'output' as const,
          content: '',
        };
      } else if (baseCmd === 'theme' && args.length === 0) {
        const themeOptions = 'Theme options: ' + themeList.join(', ');
        return {
          type: 'output' as const,
          content: ['Usage: theme [theme-name]', themeOptions],
        };
      }

      // Clear command
      if (baseCmd === 'clear') {
        setTimeout(() => {
          setHistory([]);
        }, 0);
        return { type: 'output' as const, content: '' };
      }

      // Help command - show available commands
      if (baseCmd === 'help') {
        return {
          type: 'output' as const,
          content: contentData.commands.help.output,
        };
      }

      // Exit command - simulate disconnecting from session
      if (baseCmd === 'exit' || baseCmd === 'poweroff') {
        setTimeout(() => {
          setIsDisconnected(true);
        }, 800);

        return {
          type: 'system' as const,
          content: 'Disconnecting from session...',
        };
      }

      // Restart command - reload the page
      if (baseCmd === 'restart' || baseCmd === 'reboot') {
        setTimeout(() => {
          setHistory([
            { type: 'system' as const, content: 'System is restarting...' },
            { type: 'system' as const, content: '' },
          ]);

          // Reload the page after a short delay
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }, 1500);
        }, 10);

        return {
          type: 'system' as const,
          content: 'Restarting system...',
        };
      }

      // Man command - detailed help for specific commands
      if (baseCmd === 'man') {
        if (args.length === 0) {
          return {
            type: 'output' as const,
            content: [
              'Usage: man [command]',
              'Show detailed manual page for a command.',
              '',
              'Example: man theme',
            ],
          };
        }

        const commandToShow = args[0].toLowerCase();

        // Command-specific detailed help
        const manPages: Record<string, string[]> = {
          theme: [
            'NAME',
            '       theme - change the terminal appearance',
            '',
            'SYNOPSIS',
            '       theme [theme-name]',
            '',
            'DESCRIPTION',
            "       Changes the terminal's visual theme to the specified theme.",
            '       If no theme is specified, shows available themes.',
            '',
            'OPTIONS',
            '       theme-name    The name of the theme to apply.',
            '',
            'AVAILABLE THEMES',
            `       ${getThemesList()}`,
            '',
            'EXAMPLES',
            '       theme green      Switch to the Retro Green theme',
            '       theme dark       Switch to the Dark theme',
          ],

          help: [
            'NAME',
            '       help - display available commands',
            '',
            'SYNOPSIS',
            '       help',
            '',
            'DESCRIPTION',
            '       Shows a list of all available commands with brief descriptions.',
          ],

          clear: [
            'NAME',
            '       clear - clear the terminal screen',
            '',
            'SYNOPSIS',
            '       clear',
            '',
            'DESCRIPTION',
            '       Clears all content from the terminal screen.',
            '',
            'SHORTCUTS',
            '       Ctrl+L      Also clears the screen',
          ],

          about: [
            'NAME',
            '       about - display information about XO_Works',
            '',
            'SYNOPSIS',
            '       about',
            '',
            'DESCRIPTION',
            '       Shows company information about XO_Works.',
          ],

          services: [
            'NAME',
            '       services - list available services',
            '',
            'SYNOPSIS',
            '       services',
            '',
            'DESCRIPTION',
            '       Displays a list of services offered by XO_Works.',
          ],

          contact: [
            'NAME',
            '       contact - show contact information',
            '',
            'SYNOPSIS',
            '       contact',
            '',
            'DESCRIPTION',
            '       Displays contact information for XO_Works.',
          ],

          man: [
            'NAME',
            '       man - display manual pages',
            '',
            'SYNOPSIS',
            '       man [command]',
            '',
            'DESCRIPTION',
            '       Shows detailed documentation for the specified command.',
            '       If no command is specified, shows usage information.',
            '',
            'EXAMPLES',
            '       man theme     Show detailed help for the theme command',
            '       man help      Show detailed help for the help command',
          ],

          exit: [
            'NAME',
            '       exit - disconnect from terminal session',
            '',
            'SYNOPSIS',
            '       exit',
            '',
            'DESCRIPTION',
            '       Terminates the current terminal session and returns to the login screen.',
            '       This is equivalent to logging out of the system.',
          ],

          poweroff: [
            'NAME',
            '       poweroff - power off the system',
            '',
            'SYNOPSIS',
            '       poweroff',
            '',
            'DESCRIPTION',
            '       Simulates powering off the system.',
            "       This command is an alias for 'exit'.",
          ],

          reboot: [
            'NAME',
            '       reboot - restart the system',
            '',
            'SYNOPSIS',
            '       reboot',
            '',
            'DESCRIPTION',
            '       Restarts the system by reloading the page.',
            '       This will reset all terminal state and start a new session.',
          ],
        };

        if (manPages[commandToShow]) {
          return {
            type: 'output' as const,
            content: manPages[commandToShow],
          };
        } else {
          return {
            type: 'error' as const,
            content: `No manual entry for '${commandToShow}'`,
          };
        }
      }

      // Check if command exists
      const commandObj =
        contentData.commands[baseCmd as keyof typeof contentData.commands];
      if (commandObj) {
        return {
          type: 'output' as const,
          content: commandObj.output,
        };
      }

      // Command not found
      return {
        type: 'error' as const,
        content: `Command not found: ${baseCmd}. Type 'help' to see available commands.`,
      };
    },
    [changeTheme, themeList, setHistory, setIsDisconnected]
  );

  return {
    availableCommands,
    processCommand,
  };
};

// Update the themes in the man page
const getThemesList = (): string => {
  return themesData.themes.map((theme) => theme.id).join(', ');
};
