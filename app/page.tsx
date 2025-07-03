// app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { Sun, Moon, Pencil, Video } from 'lucide-react';

// Impor dua komponen generator kita
import TextPromptGenerator from './components/TextPromptGenerator';
import VideoPromptGenerator from './components/VideoPromptGenerator';

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
            Prompt <span >Studio</span>
          </h1>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={styles.themeToggleButton} aria-label="Toggle dark mode">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Navigasi Tab */}
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
        </div>

        {/* Konten yang ditampilkan berdasarkan tab aktif */}
        <div className={styles.tabContent}>
            {activeTab === 'text' && <TextPromptGenerator />}
            {activeTab === 'video' && <VideoPromptGenerator />}
        </div>
      </main>
    </div>
  );
}