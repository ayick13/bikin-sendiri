// app/components/ComingSoon.tsx
'use client';

import { motion } from 'framer-motion';
import styles from '../Home.module.css';
import { Sparkles, Construction } from 'lucide-react';

type ComingSoonProps = {
  title: string;
  description: string;
};

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <motion.div
      className={styles.comingSoonContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.comingSoonIconWrapper}>
        <Construction size={48} className={styles.comingSoonIcon} />
        <Sparkles size={24} className={styles.comingSoonSparkle} />
      </div>
      <h3 className={styles.comingSoonTitle}>{title}</h3>
      <p className={styles.comingSoonText}>{description}</p>
      <button className={styles.notifyButton} disabled>
        Akan Segera Hadir
      </button>
    </motion.div>
  );
}
