// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { Sun, Moon, Pencil, Video, Image as ImageIcon } from 'lucide-react'; // 1. Tambahkan ikon Image
import TextPromptGenerator from './components/TextPromptGenerator';
import VideoPromptGenerator from './components/VideoPromptGenerator';
import ImageGenerator from './components/ImageGenerator'; // 2. Impor komponen baru
import AuthButtons from './components/AuthButtons';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('text');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`${styles.container} ${isDarkMode ? 'dark' : ''}`}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Prompt <span>Studio</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AuthButtons />
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={styles.themeToggleButton} aria-label="Toggle dark mode">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'text' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('text')}
          >
            <Pencil size={16} />
            Creator Prompt Teks
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'video' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <Video size={16} />
            Creator Prompt Video
          </button>
          {/* 3. Tambahkan tombol tab baru */}
          <button 
            className={`${styles.tab} ${activeTab === 'image' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('image')}
          >
            <ImageIcon size={16} />
            Generate Gambar
          </button>
        </div>
        <div className={styles.tabContent}>
            {activeTab === 'text' && <TextPromptGenerator />}
            {activeTab === 'video' && <VideoPromptGenerator />}
            {/* 4. Tampilkan komponen baru saat tab aktif */}
            {activeTab === 'image' && <ImageGenerator />}
        </div>
      </main>
    </div>
  );
}