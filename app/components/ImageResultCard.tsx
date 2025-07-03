// app/components/ImageResultCard.tsx
'use client';

import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import styles from '../Home.module.css';
import { 
    ImageIcon, LoaderCircle, ZoomIn, X, Copy, Download, Repeat 
} from 'lucide-react';

// Props yang dibutuhkan oleh kartu hasil
type ImageResultCardProps = {
  imageUrl: string;
  prompt: string;
  error: string;
  isLoading: boolean;
  isZoomed: boolean;
  setIsZoomed: (value: boolean) => void;
  handleCopyPrompt: () => void;
  handleVariations: () => void;
  handleDownload: () => void;
};

export default function ImageResultCard({
  imageUrl, prompt, error, isLoading, isZoomed, setIsZoomed, 
  handleCopyPrompt, handleVariations, handleDownload
}: ImageResultCardProps) {
  if (!isLoading && !error && !imageUrl) return null;

  return (
    <motion.div 
        className={styles.resultCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <h2 className={styles.resultHeader}><ImageIcon size={24}/> Hasil Gambar</h2>
        {error && <p style={{color: "var(--error-color)"}}><strong>Error:</strong> {error}</p>}
        {isLoading && !imageUrl && (
            <div className={styles.imageLoadingContainer}>
                <LoaderCircle size={48} className={styles.loadingIcon} />
                <p>AI sedang menggambar...</p>
            </div>
        )}
        {imageUrl && !error && (
            <Dialog.Root open={isZoomed} onOpenChange={setIsZoomed}>
                <div className={styles.imageResultContainer}>
                   <Image src={imageUrl} alt={prompt} width={512} height={512} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} key={imageUrl} />
                   <Dialog.Trigger asChild>
                      <button className={styles.zoomButton} title="Perbesar Gambar"><ZoomIn size={20} /></button>
                   </Dialog.Trigger>
                </div>
                <div className={styles.actionButtonsContainer}>
                    <button onClick={handleCopyPrompt} className={styles.actionButton} title="Salin Prompt"><Copy size={16} /> Salin</button>
                    <button onClick={handleVariations} className={styles.actionButton} title="Buat Variasi"><Repeat size={16} /> Variasi</button>
                    <button onClick={handleDownload} className={styles.actionButton} title="Unduh Gambar"><Download size={16} /> Unduh</button>
                </div>
                <Dialog.Portal>
                    <Dialog.Overlay className={styles.zoomOverlay} />
                    <Dialog.Content className={styles.zoomContent}>
                        <Dialog.Title className={styles.visuallyHidden}>Gambar Diperbesar: {prompt}</Dialog.Title>
                        <Image src={imageUrl} alt={`Zoomed in: ${prompt}`} layout="fill" objectFit="contain" />
                        <Dialog.Close asChild>
                            <button className={styles.zoomCloseButton} title="Tutup"><X size={28} /></button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        )}
    </motion.div>
  );
}