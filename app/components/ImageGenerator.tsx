// app/components/ImageGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from '../Home.module.css';
import { Image as ImageIcon, Wand2, Settings, LoaderCircle, Lock, Dices, XCircle, Sparkles } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import PresetButton from './PresetButton';

type ImageModel = { id: string; };

export default function ImageGenerator() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  // State
  const [prompt, setPrompt] = useState('A beautiful sunset over the ocean');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [model, setModel] = useState('flux');
  const [seed, setSeed] = useState<number | ''>(() => Math.floor(Math.random() * 100000));
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [isPrivate, setIsPrivate] = useState(false);
  
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState('');
  const [availableModels, setAvailableModels] = useState<ImageModel[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('https://image.pollinations.ai/models');
        if (!response.ok) throw new Error('Gagal memuat model gambar');
        const modelsData = await response.json();
        const models = modelsData.map((id: string) => ({ id }));
        setAvailableModels(models);
      } catch (err: any) {
        console.error(err.message);
        toast.error('Gagal mengambil daftar model AI.');
      }
    };
    fetchModels();
  }, []);

  const handleClear = () => {
      setPrompt('');
      setNegativePrompt('');
      setImageUrl('');
      setError('');
      toast('Prompt dan gambar dibersihkan!', { icon: '🧹' });
  };

  // --- FUNGSI ENHANCE YANG DIPERBAIKI ---
  const handleEnhancePrompt = async () => {
      if (!prompt || isEnhancing) return;
      
      setIsEnhancing(true);
      const enhancingToast = toast.loading('AI sedang menyempurnakan prompt...');
      
      // System prompt khusus untuk AI gambar
      const systemPromptForImage = `You are an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Your task is to take the user's simple input and expand it into a rich, detailed, and descriptive prompt. Do not ask questions or explain your process. Only output the final, enhanced prompt as a single paragraph of comma-separated keywords and phrases, ready to be used for image generation.`;
      
      try {
          // Menggunakan API yang sama dengan Creator Teks Prompt
          const response = await fetch('/api/generate-text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  prompt: prompt,
                  system: systemPromptForImage, // Mengirim peran AI yang spesifik
                  model: 'openai' // Kita gunakan model teks yang cepat
              }),
          });

          if (!response.ok) throw new Error('Gagal menyempurnakan prompt.');

          const reader = response.body?.getReader();
          if (!reader) throw new Error("Gagal membaca stream.");
          const decoder = new TextDecoder();
          
          setPrompt(''); // Kosongkan prompt sebelum diisi stream

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
                    if (textChunk) {
                      setPrompt(prev => prev + textChunk);
                    }
                  } catch (e) { /* Abaikan chunk tidak valid */ }
                }
              }
          }
          toast.dismiss(enhancingToast);
          toast.success('Prompt berhasil disempurnakan!');
      } catch (err: any) {
          toast.dismiss(enhancingToast);
          toast.error(err.message);
      } finally {
          setIsEnhancing(false);
      }
  };

  const generateImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoggedIn || isLoading) return;

    setIsLoading(true);
    setImageUrl('');
    setError('');
    const loadingToast = toast.loading('AI sedang menggambar...');

    const fullPrompt = negativePrompt ? `${prompt} --neg ${negativePrompt}` : prompt;
    
    const params = new URLSearchParams({
      model,
      width: width.toString(),
      height: height.toString(),
      seed: seed.toString(),
      referrer: 'bikinsendiri.my.id',
      nologo: 'true',
      enhance: 'true',
      safe: 'false',
      private: isPrivate.toString(),
    });

    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?${params.toString()}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText || 'Gagal menghasilkan gambar.'}`);
        }
        const imageBlob = await response.blob();
        if (!imageBlob.type.startsWith('image/')) {
            throw new Error('Respons dari API bukan gambar yang valid.');
        }
        const localUrl = URL.createObjectURL(imageBlob);
        setImageUrl(localUrl);
        toast.dismiss(loadingToast);
        toast.success('Gambar berhasil dibuat!');
    } catch (err: any) {
        setError(err.message);
        toast.dismiss(loadingToast);
        toast.error(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
        setIsLoading(false);
    }
  };

  const generateRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);
    toast(`Seed baru: ${newSeed}`);
  };

  const setPresetSize = (pWidth: number, pHeight: number) => {
      setWidth(pWidth);
      setHeight(pHeight);
      toast(`Ukuran diatur ke: ${pWidth}x${pHeight}`);
  }
  
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={generateImage} className={styles.form} style={{ position: 'relative' }} autoComplete="off">
        {!isLoggedIn && (
          <div className={styles.loginOverlay}>
            <Lock size={48} />
            <p>Login untuk mengakses fitur Generate Gambar ini.</p>
          </div>
        )}
        <fieldset className={!isLoggedIn ? styles.fieldsetDisabled : ''} disabled={!isLoggedIn || isLoading || isEnhancing}>
          <div className={styles.formGroup}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                <label htmlFor="prompt-image" className={styles.label}>
                    <ImageIcon size={16} /> Prompt Gambar
                </label>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                   <button type="button" onClick={handleEnhancePrompt} className={styles.enhanceButton} disabled={!prompt || isEnhancing}>
                        {isEnhancing ? <LoaderCircle size={16} className={styles.loadingIcon} /> : <Sparkles size={16} />}
                        {isEnhancing ? 'Meningkatkan...' : 'Tingkatkan dg AI'}
                   </button>
                   <button type="button" onClick={handleClear} className={styles.clearButton}>
                        <XCircle size={16} /> Bersihkan
                   </button>
                </div>
            </div>
            <textarea
              id="prompt-image"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: seekor kucing astronot, memakai helm kaca..."
              rows={4}
              className={styles.textarea}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="negative-prompt" className={styles.label}>Negative Prompt (Opsional)</label>
            <input
              id="negative-prompt"
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Contoh: teks, watermark, kualitas buruk"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Preset Ukuran</label>
            <div className={styles.presetContainer}>
                <PresetButton label="Square" width={1024} height={1024} onClick={setPresetSize} />
                <PresetButton label="Portrait" width={1024} height={1792} onClick={setPresetSize} />
                <PresetButton label="Landscape" width={1792} height={1024} onClick={setPresetSize} />
            </div>
          </div>
          
          <details className={styles.advancedSettings}>
            <summary><Settings size={16} /> Pengaturan Lanjutan</summary>
            
            <div className={styles.controlsGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="model-image" className={styles.label}>Model</label>
                <select id="model-image" value={model} onChange={(e) => setModel(e.target.value)} className={styles.input}>
                  {availableModels.length > 0 ? (
                    availableModels.map(m => <option key={m.id} value={m.id}>{m.id}</option>)
                  ) : (
                    <option value="flux">flux (memuat...)</option>
                  )}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="seed-image" className={styles.label}>Seed</label>
                 <div className={styles.seedContainer}>
                    <input id="seed-image" type="number" value={seed} onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : '')} placeholder="Angka acak" className={styles.input}/>
                    <button type="button" onClick={generateRandomSeed} aria-label="Generate random seed"><Dices size={18}/></button>
                </div>
              </div>
            </div>
             <div className={styles.controlsGrid}>
                <div className={styles.formGroup}>
                    <label htmlFor="width-image" className={styles.label}>Lebar</label>
                    <input id="width-image" type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="height-image" className={styles.label}>Tinggi</label>
                    <input id="height-image" type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} className={styles.input} />
                </div>
            </div>

            <div className={styles.checkboxContainer}>
                <input
                    type="checkbox"
                    id="private-image"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className={styles.checkbox}
                />
                <label htmlFor="private-image">Jangan tampilkan di feed publik</label>
            </div>
          </details>

          <button type="submit" className={styles.button} disabled={isLoading || !isLoggedIn || isEnhancing}>
            {isLoading ? <LoaderCircle size={22} className={styles.loadingIcon} /> : <Wand2 size={22} />}
            <span>{isLoading ? 'Generating...' : 'Generate Gambar'}</span>
          </button>
        </fieldset>
      </form>
      
      {(isLoading || error || imageUrl) && (
        <div className={styles.resultCard}>
            <h2 className={styles.resultHeader}><ImageIcon size={24}/> Hasil Gambar</h2>
            {error && <p style={{color: "var(--error-color)"}}><strong>Error:</strong> {error}</p>}
            
            {isLoading && !imageUrl &&(
                <div className={styles.imageLoadingContainer}>
                    <LoaderCircle size={48} className={styles.loadingIcon} />
                    <p>AI sedang menggambar, mohon tunggu...</p>
                </div>
            )}
            
            {imageUrl && !error && (
                <div className={styles.imageResultContainer}>
                   <Image 
                        src={imageUrl} 
                        alt={prompt}
                        width={512}
                        height={512}
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                        key={imageUrl}
                    />
                </div>
            )}
        </div>
      )}
    </>
  );
}