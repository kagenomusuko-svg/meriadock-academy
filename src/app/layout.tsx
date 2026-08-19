import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Academia Meriadock',
  description: 'Plataforma de formación, investigación y tecnología',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-white">{children}</body>
    </html>
  );
}
