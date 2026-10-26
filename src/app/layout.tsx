import type { Metadata } from 'next';
import './globals.css';
import '../agency/design-states.css';

export const metadata: Metadata = {
  title: 'Influencer Agency',
  description: 'Run your AI talents in one place: numbers, growth ideas, brand ideas and pitches.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Grand+Hotel&family=Montserrat:wght@800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
