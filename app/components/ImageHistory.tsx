// app/components/ImageHistory.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from '../Home.module.css';
import { History, Telescope } from 'lucide-react';

// Tipe data HistoryItem yang sudah diperbaiki
type HistoryItem = {
    id: string;
    imageUrl: string;
    prompt: string;
    seed: number | ''; // FIX: Menambahkan properti 'seed'
};

type ImageHistoryProps = {
    history: HistoryItem[];
    onViewHistory: (item: HistoryItem) => void;
};

export default function ImageHistory({ history, onViewHistory }: ImageHistoryProps) {
  if (history.length === 0) {
    return (
        <motion.div 
            className={styles.emptyStateCard}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
        >
            <Telescope size={48} className={styles.emptyStateIcon} />
            <h3 className={styles.emptyStateTitle}>Riwayat Anda Kosong</h3>
            <p className={styles.emptyStateText}>
                Gambar yang Anda buat akan muncul di sini agar Anda dapat melihatnya kembali.
            </p>
        </motion.div>
    );
  }

  return (
    <motion.div 
        className={styles.historyContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <h3 className={styles.historyTitle}><History size={18} /> Riwayat Gambar</h3>
        <div className={styles.historyGrid}>
            {history.map(item => (
                <div key={item.id} className={styles.historyItem} onClick={() => onViewHistory(item)} title={`Lihat: "${item.prompt}"`}>
                    <Image src={item.imageUrl} alt={item.prompt} width={100} height={100} style={{ objectFit: 'cover' }} />
                </div>
            ))}
        </div>
    </motion.div>
  );
}