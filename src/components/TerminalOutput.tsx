/** @jsxImportSource react */
'use client';

import type { FC } from 'react';

import { TerminalLine } from '../hooks/useTerminalBoot';

/** @jsxImportSource react */

interface TerminalOutputProps {
  history: TerminalLine[];
}

const TerminalOutput: FC<TerminalOutputProps> = ({ history }) => {
  // Render terminal line content
  const renderLineContent = (line: TerminalLine) => {
    if (!line || !line.content) return null;

    if (Array.isArray(line.content)) {
      return line.content.map((item, i) => {
        // Make email clickable
        if (item.includes('Email:')) {
          const emailMatch = item.match(
            /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/
          );
          if (emailMatch) {
            const email = emailMatch[0];
            const parts = item.split(email);
            return (
              <div key={i} className="pre-line">
                {parts[0]}
                <a href={`mailto:${email}`} className="terminal-link">
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
              <div key={i} className="pre-line">
                {parts[0]}
                <a href={`tel:+1${phoneDigits}`} className="terminal-link">
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
              <div key={i} className="pre-line">
                Address:{' '}
                <a
                  href={`https://maps.google.com/?q=${encodedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-link"
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
            return (
              <div key={i} className="pre-line">
                {parts[0]}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-link"
                >
                  {url}
                </a>
                {parts[1]}
              </div>
            );
          }
        }

        return (
          <div key={i} className="pre-line">
            {item}
          </div>
        );
      });
    }

    return line.content;
  };

  return (
    <div className="terminal-output">
      {history.map((line, index) =>
        line ? (
          <div
            key={index}
            className={`${line.type === 'input' ? 'text-accent' : ''} ${line.type === 'error' ? 'text-error' : ''} ${line.type === 'system' ? 'text-system' : ''}`}
          >
            {renderLineContent(line)}
          </div>
        ) : null
      )}
    </div>
  );
};

export default TerminalOutput;
