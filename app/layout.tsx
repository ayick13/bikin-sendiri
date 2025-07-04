// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
// Impor ikon yang dibutuhkan dari lucide-react
import { Github, Globe, Cloud, Zap, Bot, Sparkles, Box, Triangle } from 'lucide-react';

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
              <main>{children}</main>
              <footer className="main-footer">
                <p>
                  &copy; {new Date().getFullYear()} AI Studio+. All Rights Reserved. <a href="https://ariftirtana.my.id" target="_blank" rel="noopener noreferrer">Made with ❤️ by Arif Tirtana</a>
                </p>
                {/* --- BAGIAN UCAPAN TERIMA KASIH DENGAN IKON --- */}
                <div className="footer-tech-grid">
                    <a href="https://pollinations.ai/" target="_blank" rel="noopener noreferrer" className="tech-item"><Bot size={14}/> Pollinations.ai</a> | 
                    <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer" className="tech-item"><Globe size={14}/> Google</a> | 
                    <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="tech-item"><Triangle size={14}/> Vercel</a> | 
                    <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer" className="tech-item"><Cloud size={14}/> Cloudflare</a> | 
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="tech-item"><Github size={14}/> GitHub</a> | 
                    <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="tech-item"><Zap size={14}/> Next.js</a> | 
                    <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="tech-item"><Sparkles size={14}/> React</a> | 
                    <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="tech-item"><Box size={14}/> Tailwind CSS</a> | 
                    <a href="https://framer.com/motion/" target="_blank" rel="noopener noreferrer" className="tech-item"><Sparkles size={14}/> Framer Motion</a> | 
                    <a href="https://next-auth.js.org/" target="_blank" rel="noopener noreferrer" className="tech-item"><Box size={14}/> NextAuth.js</a> | 
                    <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="tech-item"><Sparkles size={14}/> Lucide Icons</a> | 
                    <a href="https://typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="tech-item"><Box size={14}/> TypeScript</a> | 
                    <a href="https://eslint.org/" target="_blank" rel="noopener noreferrer" className="tech-item"><Sparkles size={14}/> ESLint</a> | 
                    <a href="https://prettier.io/" target="_blank" rel="noopener noreferrer" className="tech-item"><Box size={14}/> Prettier</a> | 
                    <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="tech-item"><Box size={14}/> Node.js</a> | 
                    <a href="https://pnpm.io/" target="_blank" rel="noopener noreferrer" className="tech-item"><Box size={14}/> pnpm</a> | 
                    <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="tech-item"><Sparkles size={14}/> Lucide</a>
                </div>
              </footer>
            </div>
        </AuthProvider>
      </body>
    </html>
  );
}
