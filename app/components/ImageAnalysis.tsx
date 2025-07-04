// app/components/ImageAnalysis.tsx
'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import styles from '../Home.module.css';
import { Eye, Lock, Upload, Bot, LoaderCircle, XCircle, LogIn } from 'lucide-react';
import { useAppContext } from './Layout'; // Import hook

export default function ImageAnalysis() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const { handleLoginTrigger } = useAppContext(); // Gunakan hook

  const [question, setQuestion] = useState('What is in this image?');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) { // Batas ukuran 4MB
      toast.error('Ukuran gambar maksimal adalah 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setQuestion('What is in this image?');
    setImageBase64(null);
    setResult('');
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageBase64 || !question || isLoading) return;

    setIsLoading(true);
    setResult('');
    const loadingToast = toast.loading('AI sedang menganalisis gambar...');

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, question }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menganalisis gambar.');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Gagal membaca stream.");
      const decoder = new TextDecoder();
      while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonString = line.substring(6);
              if (jsonString.trim() === '[DONE]') break;
              try {
                const parsed = JSON.parse(jsonString);
                const textChunk = parsed.choices?.[0]?.delta?.content;
                if (textChunk) setResult(prev => prev + textChunk);
              } catch (err) { /* Abaikan */ }
            }
          }
      }
      toast.dismiss(loadingToast);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit} className={styles.form} style={{ position: 'relative' }} autoComplete="off">
        {!isLoggedIn && (
          <div className={styles.loginOverlay}>
            <Lock size={48} />
            <p>Login untuk mengakses fitur Analisis Gambar ini.</p>
            <button
              type="button"
              onClick={handleLoginTrigger}
              className={styles.loginOverlayButton}
            >
              <LogIn size={18} />
              Login Sekarang
            </button>
          </div>
        )}
        <fieldset className={!isLoggedIn ? styles.fieldsetDisabled : ''} disabled={!isLoggedIn || isLoading}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="image-upload">Unggah Gambar</label>
            <div className={styles.uploadContainer}>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handleFileChange}
                ref={fileInputRef}
                id="image-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" className={styles.uploadButton} style={{ minWidth: 0 }}>
                <Upload size={18} />
                <span>Pilih Gambar</span>
              </label>
              {imageBase64 && (
                <div className={styles.previewContainer}>
                  <Image src={imageBase64} alt="Preview" width={80} height={80} style={{ objectFit: 'cover', borderRadius: '8px' }}/>
                  <button type="button" onClick={handleClear} className={styles.clearUploadButton} title="Hapus Gambar"><XCircle size={20}/></button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="question" className={styles.label}>Pertanyaan Anda</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ajukan pertanyaan tentang gambar..."
              rows={3}
              className={styles.textarea}
              required
            />
          </div>
          <button type="submit" className={styles.button} disabled={isLoading || !isLoggedIn || !imageBase64}>
            {isLoading ? <LoaderCircle size={22} className={styles.loadingIcon} /> : <Eye size={22} />}
            <span>{isLoading ? 'Menganalisis...' : 'Analisis Gambar'}</span>
          </button>
        </fieldset>
      </form>

      {(isLoading || result) && (
        <motion.div 
            className={styles.resultCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <h2 className={styles.resultHeader}><Bot size={24}/> Hasil Analisis AI</h2>
          <div className={`${styles.resultText} ${isLoading ? '' : styles.done}`}>
            {result}
          </div>
        </motion.div>
      )}
    </>
  );
}