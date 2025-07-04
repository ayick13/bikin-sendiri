// app/components/TextToAudioGenerator.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../Home.module.css';
import { Volume2, Wand2, LoaderCircle, Lock, Download } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { Toaster, toast } from 'react-hot-toast';

const voiceOptions = [
  { value: 'alloy', label: 'Alloy' },
  { value: 'echo', label: 'Echo' },
  { value: 'fable', label: 'Fable' },
  { value: 'onyx', label: 'Onyx' },
  { value: 'nova', label: 'Nova' },
  { value: 'shimmer', label: 'Shimmer' },
];

export default function TextToAudioGenerator() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [prompt, setPrompt] = useState('Hello, world! This is a test of the text-to-audio generation.');
  const [voice, setVoice] = useState('nova');
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoggedIn || isLoading || !prompt) {
      if (!prompt) toast.error("Teks tidak boleh kosong!");
      return;
    }

    setIsLoading(true);
    setAudioSrc(null);
    const loadingToast = toast.loading('AI sedang memproses audio...');

    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, voice }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menghasilkan audio.');
      }

      const result = await response.json();
      const base64Audio = result?.choices?.[0]?.message?.audio?.data;

      if (!base64Audio) {
        throw new Error('Data audio tidak ditemukan dalam respons API.');
      }

      const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;
      setAudioSrc(audioDataUrl);
      toast.dismiss(loadingToast);
      toast.success('Audio berhasil dibuat!');

    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAudio = () => {
    if (audioSrc) {
      const link = document.createElement('a');
      link.href = audioSrc;
      const fileName = `${prompt.substring(0, 20).replace(/\s/g, '_') || 'audio'}.mp3`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Audio diunduh!');
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit} className={styles.form} style={{ position: 'relative' }} autoComplete="off">
        {/* ... form content ... */}
        {!isLoggedIn && (
          <div className={styles.loginOverlay}>
            <Lock size={48} />
            <p>Login untuk mengakses fitur Text-to-Audio ini.</p>
          </div>
        )}
        <fieldset className={!isLoggedIn ? styles.fieldsetDisabled : ''} disabled={!isLoggedIn || isLoading}>
          <div className={styles.formGroup}>
            <label htmlFor="prompt-audio" className={styles.label}>
              <Volume2 size={16} /> Teks untuk Audio
            </label>
            <textarea
              id="prompt-audio"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Masukkan teks yang ingin diubah menjadi suara..."
              rows={5}
              className={styles.textarea}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="voice-select" className={styles.label}>Pilih Suara</label>
            <CustomSelect
              placeholder="Pilih model suara"
              options={voiceOptions}
              value={voice}
              onValueChange={setVoice}
              disabled={isLoading}
            />
          </div>

          <button type="submit" className={styles.button} disabled={isLoading || !isLoggedIn}>
            {isLoading ? <LoaderCircle size={22} className={styles.loadingIcon} /> : <Wand2 size={22} />}
            <span>{isLoading ? 'Generating...' : 'Generate Audio'}</span>
          </button>
        </fieldset>
      </form>

      {audioSrc && (
        <div className={styles.resultCard}>
          <h2 className={styles.resultHeader}><Volume2 size={24} /> Hasil Audio</h2>
          <audio controls src={audioSrc} style={{ width: '100%' }}>
            Your browser does not support the audio element.
          </audio>
          
          {/* PERUBAHAN DI SINI: Gunakan class yang lebih spesifik */}
          <div className={styles.audioResultActions}>
            <button onClick={handleDownloadAudio} className={styles.actionButton} title="Unduh Audio">
              <Download size={16} /> Unduh Audio
            </button>
          </div>

        </div>
      )}
    </>
  );
}