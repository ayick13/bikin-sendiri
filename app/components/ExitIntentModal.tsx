// app/components/ExitIntentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../Home.module.css';
import { HandCoins, X } from 'lucide-react';
import Image from 'next/image';

export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      // Periksa jika mouse bergerak ke bagian atas viewport
      if (e.clientY < 10) {
        // Periksa localStorage untuk memastikan modal tidak terlalu sering muncul
        const lastShown = localStorage.getItem('exitIntentShown');
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

        if (!lastShown || now - parseInt(lastShown) > oneDay) {
          setIsOpen(true);
          localStorage.setItem('exitIntentShown', now.toString());
        }
      }
    };

    // Tambahkan event listener ke dokumen
    document.addEventListener('mouseout', handleMouseOut);

    // Hapus event listener saat komponen dibongkar
    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.exitIntentOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.exitIntentModal}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button onClick={() => setIsOpen(false)} className={styles.exitIntentCloseButton} aria-label="Tutup">
              <X size={24} />
            </button>
            <div className={styles.exitIntentHeader}>
              <HandCoins size={40} className={styles.exitIntentIcon} />
              <h2>Tunggu Sebentar!</h2>
            </div>
            <p className={styles.exitIntentText}>
              Menyukai aplikasi ini? Dukung pengembangan AI Studio+ agar terus gratis dan menjadi lebih baik dengan donasi kecil melalui Saweria.
            </p>
            <div className={styles.saweriaContainer}>
              {/* Ganti dengan gambar QR code Anda di folder public */}
              <Image 
                src="/saweria_qr.png" 
                alt="QR Code Saweria untuk donasi"
                width={180}
                height={180}
                style={{ borderRadius: '8px' }}
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/180x180/e5e7eb/4b5563?text=QR+Code'; }}
              />
              <a 
                href="https://saweria.co/ariftirtana" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.saweriaButton}
              >
                Dukung di Saweria.co
              </a>
            </div>
            <button onClick={() => setIsOpen(false)} className={styles.exitIntentDismissButton}>
              Lain kali saja
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
