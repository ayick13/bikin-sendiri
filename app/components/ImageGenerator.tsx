// app/components/ImageGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import styles from '../Home.module.css';
import { 
    Image as ImageIcon, Wand2, Settings, LoaderCircle, Lock, Dices, 
    XCircle, Sparkles, ZoomIn, X, Copy, Download, Repeat 
} from 'lucide-react';
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

  const handleEnhancePrompt = async () => {
      if (!prompt || isEnhancing) return;
      setIsEnhancing(true);
      const enhancingToast = toast.loading('AI sedang menyempurnakan prompt...');
      const systemPromptForImage = `You are an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Your task is to take the user's simple input and expand it into a rich, detailed, and descriptive prompt. Do not ask questions or explain your process. Only output the final, enhanced prompt as a single paragraph of comma-separated keywords and phrases, ready to be used for image generation.`;
      try {
          const response = await fetch('/api/generate-text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt, system: systemPromptForImage, model: 'openai' }),
          });
          if (!response.ok) throw new Error('Gagal menyempurnakan prompt.');
          const reader = response.body?.getReader();
          if (!reader) throw new Error("Gagal membaca stream.");
          const decoder = new TextDecoder();
          setPrompt(''); 
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
                    if (textChunk) setPrompt(prev => prev + textChunk);
                  } catch (e) { /* Abaikan */ }
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

  const generateImage = async (newSeed?: number) => {
    if (!isLoggedIn || isLoading) return;
    setIsLoading(true);
    setImageUrl('');
    setError('');
    const loadingToast = toast.loading('AI sedang menggambar...');
    const currentSeed = newSeed || seed || Math.floor(Math.random() * 1000000);
    if(newSeed) { setSeed(newSeed); } else if (!seed) { setSeed(currentSeed); }
    const fullPrompt = negativePrompt ? `${prompt} --neg ${negativePrompt}` : prompt;
    const params = new URLSearchParams({
      model,
      width: width.toString(),
      height: height.toString(),
      seed: currentSeed.toString(),
      referrer: 'bikinsendiri.my.id',
      nologo: 'true',
      enhance: 'true',
      safe: 'false',
      private: isPrivate.toString(),
    });
    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?${params.toString()}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API Error: ${response.status} - Gagal menghasilkan gambar.`);
        const imageBlob = await response.blob();
        if (!imageBlob.type.startsWith('image/')) throw new Error('Respons dari API bukan gambar.');
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
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      generateImage();
  };

  const handleVariations = () => {
    toast('Membuat variasi dengan seed baru...', { icon: '🎨' });
    const newSeed = Math.floor(Math.random() * 1000000);
    generateImage(newSeed);
  };
  
  const handleCopyPrompt = () => {
      navigator.clipboard.writeText(prompt);
      toast.success('Prompt disalin ke clipboard!');
  };
  
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${prompt.substring(0, 30).replace(/\s/g, '_')}_${seed}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Gambar diunduh!');
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
  };
  
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit} className={styles.form} style={{ position: 'relative' }} autoComplete="off">
        {/* ... (isi form tidak berubah) ... */}
        <fieldset className={!isLoggedIn ? styles.fieldsetDisabled : ''} disabled={!isLoggedIn || isLoading || isEnhancing}>
          <div className={styles.formGroup}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                <label htmlFor="prompt-image" className={styles.label}>
                    <ImageIcon size={16} /> Prompt Gambar
                </label>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                   <button type="button" onClick={handleEnhancePrompt} className={styles.iconButton} disabled={!prompt || isEnhancing} title="Tingkatkan dengan AI">
                        {isEnhancing ? <LoaderCircle size={18} className={styles.loadingIcon} /> : <Sparkles size={18} />}
                   </button>
                   <button type="button" onClick={handleClear} className={styles.iconButton} title="Bersihkan Prompt">
                        <XCircle size={18} />
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
            <input id="negative-prompt" type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="Contoh: teks, watermark, kualitas buruk" className={styles.input} />
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
                  {availableModels.length > 0 ? (availableModels.map(m => <option key={m.id} value={m.id}>{m.id}</option>)) : (<option value="flux">flux (memuat...)</option>)}
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
                <input type="checkbox" id="private-image" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className={styles.checkbox} />
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
                <Dialog.Root>
                    <div className={styles.imageResultContainer}>
                       <Image 
                            src={imageUrl} 
                            alt={prompt}
                            width={512}
                            height={512}
                            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                            key={imageUrl}
                        />
                         <Dialog.Trigger asChild>
                            <button className={styles.zoomButton} title="Perbesar Gambar">
                                <ZoomIn size={20} />
                            </button>
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
                             {/* FIX: Menambahkan Dialog.Title yang tersembunyi */}
                            <Dialog.Title className={styles.visuallyHidden}>Gambar Diperbesar</Dialog.Title>
                            
                            <Image 
                                src={imageUrl} 
                                alt={`Zoomed in: ${prompt}`}
                                layout="fill"
                                objectFit="contain"
                            />
                            <Dialog.Close asChild>
                                <button className={styles.zoomCloseButton} title="Tutup"><X size={28} /></button>
                            </Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            )}
        </div>
      )}
    </>
  );
}