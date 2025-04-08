import type { Metadata, Viewport } from 'next';
import { DM_Mono } from 'next/font/google';

import { ThemeProvider } from '../contexts/ThemeContext';
import './globals.css';

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-mono',
});

export const metadata: Metadata = {
  title: 'XO_Works - IT Consulting Solutions',
  description: 'Expert IT consulting services tailored to your business needs',
  keywords:
    'IT consulting, software development, cloud architecture, DevOps, cybersecurity',
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmMono.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
