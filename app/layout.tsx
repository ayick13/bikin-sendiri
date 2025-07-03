// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

// Ganti blok metadata ini
export const metadata: Metadata = {
  title: {
    template: '%s | Prompt Studio Pro', // Pola untuk halaman lain
    default: 'Prompt Studio Pro - AI Text & Video Prompt Creator', // Judul default untuk halaman utama
  },
  description: 'Alat canggih untuk membuat dan menyempurnakan prompt teks dan video dengan bantuan AI. Dilengkapi dengan pengaturan lanjutan untuk hasil yang maksimal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}