import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Site Lavajato',
  description: 'Sistema de gestão para lava-jatos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
