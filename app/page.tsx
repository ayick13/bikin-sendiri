// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { Sun, Moon, Pencil, Video, Image as ImageIcon, Eye } from 'lucide-react';
import TextPromptGenerator from './components/TextPromptGenerator';
import VideoPromptGenerator from './components/VideoPromptGenerator';
import ImageGenerator from './components/ImageGenerator';
import ImageAnalysis from './components/ImageAnalysis'; // Impor komponen baru
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
            AI <span>Studio</span>+
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AuthButtons />
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={styles.themeToggleButton} aria-label="Toggle dark mode">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <div className={styles.tabContainer}>
          {/* Baris pertama */}
          <div className={styles.tabRow}>
            <button className={`${styles.tab} ${activeTab === 'text' ? styles.activeTab : ''}`} onClick={() => setActiveTab('text')}>
              <Pencil size={16} /> Creator Prompt Teks
            </button>
            <button className={`${styles.tab} ${activeTab === 'video' ? styles.activeTab : ''}`} onClick={() => setActiveTab('video')}>
              <Video size={16} /> Creator Prompt Video
            </button>
          </div>
          {/* Baris kedua */}
          <div className={styles.tabRow}>
              <button className={`${styles.tab} ${activeTab === 'image' ? styles.activeTab : ''}`} onClick={() => setActiveTab('image')}>
                  <ImageIcon size={16} /> Generate Gambar
              </button>
              <button className={`${styles.tab} ${activeTab === 'analysis' ? styles.activeTab : ''}`} onClick={() => setActiveTab('analysis')}>
                  <Eye size={16} /> Analisis Gambar
              </button>
          </div>
        </div>

        <div className={styles.tabContent}>
            {activeTab === 'text' && <TextPromptGenerator />}
            {activeTab === 'video' && <VideoPromptGenerator />}
            {activeTab === 'image' && <ImageGenerator />}
            {activeTab === 'analysis' && <ImageAnalysis />}
        </div>
      </main>
    </div>
  );
}