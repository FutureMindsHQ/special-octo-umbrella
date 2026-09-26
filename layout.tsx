import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FutureMinds — AI Education Platform',
  description: 'AI-помощник для поступления и развития портфолио',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
