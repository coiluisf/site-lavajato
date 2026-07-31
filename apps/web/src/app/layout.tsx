'use client';

import './globals.css';
import { CompanyProvider } from '@/context/CompanyContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <CompanyProvider>{children}</CompanyProvider>
      </body>
    </html>
  );
}
