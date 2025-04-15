'use client';

/** @jsxImportSource react */
import { FC, memo, useCallback, useId } from 'react';

import { TerminalLine } from '../types';

interface TerminalOutputProps {
  history: TerminalLine[];
}

const TerminalOutput: FC<TerminalOutputProps> = ({ history }) => {
  const listId = useId();
  const outputId = `terminal-output-${listId}`;

  // Render terminal line content
  const renderLineContent = useCallback(
    (line: TerminalLine, index: number) => {
      if (!line || !line.content) return null;

      const lineId = `line-${index}-${listId}`;

      if (Array.isArray(line.content)) {
        return line.content.map((item, i) => {
          const itemId = `${lineId}-item-${i}`;

          // Make email clickable
          if (item.includes('Email:')) {
            const emailMatch = item.match(
              /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/
            );
            if (emailMatch) {
              const email = emailMatch[0];
              const parts = item.split(email);
              return (
                <div key={i} className="pre-line" id={itemId}>
                  {parts[0]}
                  <a
                    href={`mailto:${email}`}
                    className="terminal-link"
                    aria-label={`Send email to ${email}`}
                  >
                    {email}
                  </a>
                  {parts[1]}
                </div>
              );
            }
          }

          // Make phone clickable
          if (item.includes('Phone:')) {
            const phoneMatch = item.match(/(\(\d{3}\)\s*\d{3}-\d{4})/);
            if (phoneMatch) {
              const phone = phoneMatch[0];
              const phoneDigits = phone.replace(/\D/g, '');
              const parts = item.split(phone);
              return (
                <div key={i} className="pre-line" id={itemId}>
                  {parts[0]}
                  <a
                    href={`tel:+1${phoneDigits}`}
                    className="terminal-link"
                    aria-label={`Call ${phone}`}
                  >
                    {phone}
                  </a>
                  {parts[1]}
                </div>
              );
            }
          }

          // Make address clickable
          if (item.includes('Address:')) {
            const addressMatch = item.match(/Address:\s*(.*)/);
            if (addressMatch) {
              const address = addressMatch[1];
              const encodedAddress = encodeURIComponent(address);
              return (
                <div key={i} className="pre-line" id={itemId}>
                  Address:{' '}
                  <a
                    href={`https://maps.google.com/?q=${encodedAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terminal-link"
                    aria-label={`Open map for ${address}`}
                  >
                    {address}
                  </a>
                </div>
              );
            }
          }

          // Make social media links clickable
          if (
            item.includes('LinkedIn:') ||
            item.includes('Mastodon:') ||
            item.includes('GitHub:')
          ) {
            const urlMatch = item.match(/https?:\/\/[^\s]+/);
            if (urlMatch) {
              const url = urlMatch[0];
              const parts = item.split(url);
              const platform = item.includes('LinkedIn')
                ? 'LinkedIn'
                : item.includes('Mastodon')
                  ? 'Mastodon'
                  : 'GitHub';

              return (
                <div key={i} className="pre-line" id={itemId}>
                  {parts[0]}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terminal-link"
                    aria-label={`Visit ${platform} profile`}
                  >
                    {url}
                  </a>
                  {parts[1]}
                </div>
              );
            }
          }

          return (
            <div key={i} className="pre-line" id={itemId}>
              {item}
            </div>
          );
        });
      }

      return <div id={lineId}>{line.content}</div>;
    },
    [listId]
  );

  return (
    <div
      className="terminal-output"
      id={outputId}
      role="log"
      aria-live="polite"
      aria-atomic="false"
      aria-relevant="additions"
    >
      {history.map((line, index) =>
        line ? (
          <div
            key={index}
            className={`${line.type === 'input' ? 'text-accent' : ''} ${line.type === 'error' ? 'text-error' : ''} ${line.type === 'system' ? 'text-system' : ''}`}
            role={line.type === 'error' ? 'alert' : undefined}
            aria-label={
              line.type === 'error'
                ? 'Error'
                : line.type === 'system'
                  ? 'System message'
                  : line.type === 'input'
                    ? 'Command input'
                    : 'Output'
            }
          >
            {renderLineContent(line, index)}
          </div>
        ) : null
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(TerminalOutput);
