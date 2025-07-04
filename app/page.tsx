// app/page.tsx
'use client';

import { useState } from 'react';
import styles from './Home.module.css';
import { Pencil, Video, Image as ImageIcon, Eye, Volume2 } from 'lucide-react';
import Layout from './components/Layout';
import TextPromptGenerator from './components/TextPromptGenerator';
import VideoPromptGenerator from './components/VideoPromptGenerator';
import ImageGenerator from './components/ImageGenerator';
import ImageAnalysis from './components/ImageAnalysis';
import TextToAudioGenerator from './components/TextToAudioGenerator';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <Layout>
      {/* AuthButtons sudah dipindahkan ke Layout, jadi kita hapus dari sini */}
      
      <div className={styles.tabContainer}>
        {/* ... (sisa kode tab tidak berubah) ... */}
        <div className={styles.tabRow}>
          <button className={`${styles.tab} ${activeTab === 'text' ? styles.activeTab : ''}`} onClick={() => setActiveTab('text')}>
            <Pencil size={16} /> Creator Prompt Teks
          </button>
          <button className={`${styles.tab} ${activeTab === 'video' ? styles.activeTab : ''}`} onClick={() => setActiveTab('video')}>
            <Video size={16} /> Creator Prompt Video
          </button>
        </div>
        <div className={styles.tabRow}>
            <button className={`${styles.tab} ${activeTab === 'image' ? styles.activeTab : ''}`} onClick={() => setActiveTab('image')}>
                <ImageIcon size={16} /> Generate Gambar
            </button>
            <button className={`${styles.tab} ${activeTab === 'analysis' ? styles.activeTab : ''}`} onClick={() => setActiveTab('analysis')}>
                <Eye size={16} /> Analisis Gambar
            </button>
        </div>
        <div className={styles.tabRow}>
            <button className={`${styles.tab} ${activeTab === 'audio' ? styles.activeTab : ''}`} onClick={() => setActiveTab('audio')}>
                <Volume2 size={16} /> Text-to-Audio
            </button>
        </div>
      </div>

      <div className={styles.tabContent}>
          {activeTab === 'text' && <TextPromptGenerator />}
          {activeTab === 'video' && <VideoPromptGenerator />}
          {activeTab === 'image' && <ImageGenerator />}
          {activeTab === 'analysis' && <ImageAnalysis />}
          {activeTab === 'audio' && <TextToAudioGenerator />}
      </div>
    </Layout>
  );
}