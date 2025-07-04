// app/e-kursus/page.tsx
'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import PasswordProtect from '../components/PasswordProtect';
import styles from '../Home.module.css';
import pageStyles from '../page.module.css';
import { BrainCircuit, BookOpen, Wand2, Palette, Video, Code, Shield, Mic, Share2, Briefcase } from 'lucide-react';

// TAMBAHKAN 4 KURSUS BARU DI SINI
const allCourses = [
  {
    icon: <BrainCircuit size={32} />,
    title: 'Dasar-Dasar AI Generatif',
    description: 'Pelajari konsep fundamental di balik teknologi AI generatif, seperti Large Language Models (LLM) dan model difusi untuk gambar.',
  },
  {
    icon: <Wand2 size={32} />,
    title: 'Rekayasa Prompt Tingkat Lanjut',
    description: 'Kuasai seni membuat prompt yang efektif untuk mendapatkan hasil teks, gambar, dan video yang presisi dan kreatif dari berbagai model AI.',
  },
  {
    icon: <BookOpen size={32} />,
    title: 'Studi Kasus: Membangun Aplikasi dengan AI',
    description: 'Lihat bagaimana kami membangun AI Studio+ dari awal, integrasi API, dan praktik terbaik dalam pengembangan aplikasi berbasis AI.',
  },
  {
    icon: <Palette size={32} />,
    title: 'Menguasai Model Gambar AI',
    description: 'Fokus mendalam pada model seperti Stable Diffusion & Midjourney. Pelajari parameter, gaya, dan teknik untuk hasil visual yang menakjubkan.',
  },
  {
    icon: <Video size={32} />,
    title: 'Dari Teks ke Video Sinematik',
    description: 'Jelajahi model AI video seperti Sora dan Veo. Pelajari cara membuat prompt video yang menghasilkan adegan yang koheren dan dinamis.',
  },
  {
    icon: <Code size={32} />,
    title: 'Integrasi API AI ke Proyek Anda',
    description: 'Panduan teknis untuk developer tentang cara mengintegrasikan API dari OpenAI, Pollinations, dan penyedia lainnya ke dalam aplikasi web Anda.',
  },
  {
    icon: <Shield size={32} />,
    title: 'Etika dan Keamanan dalam AI',
    description: 'Pahami implikasi etis, bias, dan tantangan keamanan dalam menggunakan dan mengembangkan teknologi AI secara bertanggung jawab.',
  },
  {
    icon: <Mic size={32} />,
    title: 'Kloning Suara dan Text-to-Speech',
    description: 'Pelajari cara kerja model kloning suara dan manfaatkan teknologi text-to-speech (TTS) untuk berbagai aplikasi, dari narasi hingga asisten virtual.',
  },
  {
    icon: <Share2 size={32} />,
    title: 'Fine-Tuning Model AI Anda Sendiri',
    description: 'Panduan untuk melatih (fine-tune) model AI pada dataset kustom Anda untuk menciptakan solusi yang sangat spesifik dan personal.',
  },
  {
    icon: <Briefcase size={32} />,
    title: 'AI untuk Produktivitas Profesional',
    description: 'Manfaatkan alat-alat AI untuk meningkatkan efisiensi kerja, mulai dari otomatisasi tugas, analisis data, hingga pembuatan konten pemasaran.',
  },
];

export default function EKursusPage() {
  const [showAll, setShowAll] = useState(false);
  const displayedCourses = showAll ? allCourses : allCourses.slice(0, 4);

  return (
    <Layout>
      {/* BUNGKUS KONTEN DENGAN PASSWORDPROTECT */}
      <PasswordProtect>
        <div className={pageStyles.staticPageContainer}>
          <h1>Selamat Datang di E-Kursus AI Studio+</h1>
          <p>Tingkatkan keahlian Anda dalam dunia AI, mulai dari dasar hingga menjadi seorang ahli rekayasa prompt. Pilih kursus yang sesuai dengan minat Anda di bawah ini.</p>
          
          <div className={styles.courseGrid}>
            {displayedCourses.map((course, index) => (
              <div className={styles.courseCard} key={index}>
                <div className={styles.courseCardIcon}>{course.icon}</div>
                <h3 className={styles.courseCardTitle}>{course.title}</h3>
                <p className={styles.courseCardDescription}>{course.description}</p>
                <button className={styles.courseCardButton} disabled>Segera Hadir</button>
              </div>
            ))}
          </div>

          {!showAll && allCourses.length > 4 && (
            <div className={styles.showMoreContainer}>
              <button 
                onClick={() => setShowAll(true)} 
                className={styles.showMoreButton}
              >
                Tampilkan Lebih Banyak
              </button>
            </div>
          )}
        </div>
      </PasswordProtect>
    </Layout>
  );
}