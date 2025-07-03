// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

// Metadata Lengkap untuk SEO dan Social Sharing
export const metadata: Metadata = {
  // Judul dasar dan template
  title: {
    template: '%s | Prompt Studio Pro',
    default: 'Prompt Studio Pro - AI Text & Video Prompt Creator',
  },
  // Deskripsi utama
  description: 'Alat canggih untuk membuat dan menyempurnakan prompt teks dan video dengan bantuan AI. Dilengkapi dengan pengaturan lanjutan untuk hasil yang maksimal.',
  
  // URL dasar untuk semua metadata URL absolut
  // Ganti dengan domain Anda jika sudah berbeda
  metadataBase: new URL('https://bikinsendiri.my.id'),

  // Keywords untuk SEO
  keywords: ['prompt generator', 'ai prompt', 'prompt engineering', 'text prompt', 'video prompt', 'AI tools', 'pollinations.ai', 'Gresik'],

  // Open Graph (untuk Facebook, LinkedIn, WhatsApp, dll.)
  openGraph: {
    title: 'Prompt Studio Pro - AI Text & Video Prompt Creator',
    description: 'Alat canggih untuk membuat prompt AI untuk teks dan video.',
    url: 'https://bikinsendiri.my.id', // Ganti dengan domain Anda
    siteName: 'Prompt Studio Pro',
    images: [
      {
        url: '/og-image.webp', // Path ke gambar di folder `public`
        width: 1200,
        height: 630,
        alt: 'Tampilan aplikasi Prompt Studio Pro',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },

  // Twitter Card (untuk saat link dibagikan di Twitter/X)
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Studio Pro - AI Text & Video Prompt Creator',
    description: 'Dari ide sederhana menjadi prompt AI yang detail untuk teks dan video.',
    images: ['/og-image.png'], // Path ke gambar
  },
  
  // Aturan untuk robot search engine
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Ikon untuk website
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png', // Buat gambar ini dan letakkan di folder public jika perlu
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}