import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Influencer Agency',
  description: 'Run your AI talents in one place: numbers, growth ideas, brand ideas and pitches.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  );
}
