// app/components/SupportToast.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../Home.module.css';
import { HandCoins, X } from 'lucide-react';

export default function SupportToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Tampilkan notifikasi setelah 15 detik
    const timer = setTimeout(() => {
      // Hanya tampilkan jika belum pernah ditutup di sesi ini
      const hasBeenDismissed = sessionStorage.getItem('supportToastDismissed');
      if (!hasBeenDismissed) {
        setIsVisible(true);
      }
    }, 15000); // 15 detik

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Tandai bahwa notifikasi sudah ditutup untuk sesi ini
    sessionStorage.setItem('supportToastDismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.supportToast}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        >
          <div className={styles.toastIcon}>
            <HandCoins size={24} />
          </div>
          <div className={styles.toastContent}>
            <h4 className={styles.toastTitle}>Suka dengan AI Studio+?</h4>
            <p className={styles.toastText}>
              Dukung kami dengan donasi kecil di{' '}
              <a href="https://saweria.co/ayick13" target="_blank" rel="noopener noreferrer">
                Saweria.co
              </a>
            </p>
          </div>
          <button onClick={handleDismiss} className={styles.toastCloseButton} aria-label="Tutup">
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
