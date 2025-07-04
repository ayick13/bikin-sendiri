// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";

export const metadata: Metadata = {
  title: {
    template: '%s | AI Studio+',
    default: 'AI Studio+ - AI Text, Video, Image Creator & Analyzer',
  },
  description: 'Alat canggih untuk membuat, menyempurnakan, dan menganalisis prompt dan gambar dengan bantuan AI. Dilengkapi dengan pengaturan lanjutan untuk hasil yang maksimal.',
  metadataBase: new URL('https://bikinsendiri.my.id'),
  keywords: ['prompt generator', 'ai prompt', 'image generator', 'image analysis', 'prompt engineering', 'text prompt', 'video prompt', 'AI tools', 'pollinations.ai', 'Gresik'],
  openGraph: {
    title: 'AI Studio+ - AI Text, Video, Image Creator & Analyzer',
    description: 'Alat canggih untuk membuat dan menganalisis prompt dan gambar dengan AI.',
    url: 'https://bikinsendiri.my.id',
    siteName: 'AI Studio+',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Tampilan aplikasi AI Studio+',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Studio+ - AI Text, Video, Image Creator & Analyzer',
    description: 'Dari ide sederhana menjadi prompt dan gambar AI yang detail.',
    images: ['/og-image.webp'],
  },
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
            <div className="app-wrapper">
              {/* Children (page.tsx) akan dirender di sini */}
              {children}
              <footer className="main-footer">
                <p>
                  &copy; {new Date().getFullYear()} AI Studio+. All Rights Reserved.
                </p>
              </footer>
            </div>
        </AuthProvider>
      </body>
    </html>
  );
}
