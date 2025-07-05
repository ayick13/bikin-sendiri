// app/components/ImageGenerator.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import styles from '../Home.module.css';
import {
    Image as ImageIcon, Wand2, Settings, LoaderCircle, Lock, Dices,
    XCircle, Sparkles, ZoomIn, X, Copy, Download, Repeat, History, KeyRound, LogIn
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import PresetButton from './PresetButton';
import { useAppContext } from './Layout';

// Tipe data yang ada
type ImageModel = { id: string; };
type HistoryItem = {
    id: string;
    imageUrl: string;
    prompt: string;
    seed: number | '';
};

// Fungsi bantuan localStorage
const LOCAL_STORAGE_KEY = 'imageHistory';
const MAX_HISTORY_ITEMS = 10;
const LOCAL_STORAGE_LIMIT_MB = 4.5; // Batas aman (dari 5MB)

const getHistoryFromStorage = (): HistoryItem[] => {
    try {
        const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
        return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
        console.error("Gagal memuat riwayat dari localStorage", e);
        return [];
    }
};

const saveHistoryToStorage = (history: HistoryItem[]) => {
    try {
        const historyString = JSON.stringify(history);
        if (new Blob([historyString]).size > LOCAL_STORAGE_LIMIT_MB * 1024 * 1024) {
            toast.error("Penyimpanan riwayat penuh. Item terlama akan dihapus untuk memberi ruang.");
            let trimmedHistory = [...history];
            while (new Blob([JSON.stringify(trimmedHistory)]).size > LOCAL_STORAGE_LIMIT_MB * 1024 * 1024 && trimmedHistory.length > 0) {
                trimmedHistory.pop();
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmedHistory));
            return;
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, historyString);
    } catch (e) {
        console.error("Gagal menyimpan riwayat ke localStorage", e);
        toast.error("Gagal menyimpan riwayat. Mungkin penyimpanan browser Anda penuh.");
    }
};


export default function ImageGenerator() {
    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;
    const { handleLoginTrigger } = useAppContext();

    // State Form
    const [prompt, setPrompt] = useState('A majestic lion in a futuristic city, neon lights');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [model, setModel] = useState('flux');
    const [seed, setSeed] = useState<number | ''>('');
    const [width, setWidth] = useState(1024);
    const [height, setHeight] = useState(1024);
    const [isPrivate, setIsPrivate] = useState(false);

    // State UI & Data
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [error, setError] = useState('');
    const [availableModels, setAvailableModels] = useState<ImageModel[]>([]);
    const [modelsLoading, setModelsLoading] = useState(true);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isZoomed, setIsZoomed] = useState(false);

    // State baru untuk DALL-E 3
    const [isDalleModalOpen, setIsDalleModalOpen] = useState(false);
    const [openaiApiKey, setOpenaiApiKey] = useState('');
    const [tempApiKey, setTempApiKey] = useState(''); // Untuk input di modal
    const [isKeyValidating, setIsKeyValidating] = useState(false);


    useEffect(() => {
        setHistory(getHistoryFromStorage());
        const fetchModels = async () => {
            setModelsLoading(true);
            try {
                const response = await fetch('https://image.pollinations.ai/models');
                if (!response.ok) throw new Error('Gagal memuat model gambar');
                const modelsData = await response.json();
                const pollinationModels = modelsData.map((id: string) => ({ id }));
                // Menambahkan DALL-E 3 secara manual
                setAvailableModels([...pollinationModels, { id: 'dall-e-3' }]);
            } catch (err: any) {
                toast.error('Gagal mengambil daftar model AI.');
                setAvailableModels([{ id: 'flux' }, { id: 'dall-e-3' }]);
            } finally {
                setModelsLoading(false);
            }
        };

        // Memuat kunci API dari session storage jika ada
        const storedApiKey = sessionStorage.getItem('openai_api_key');
        if (storedApiKey) {
            setOpenaiApiKey(storedApiKey);
        }

        fetchModels();
    }, []);

    const handleModelChange = (selectedModel: string) => {
        if (selectedModel === 'dall-e-3') {
            setIsDalleModalOpen(true);
        } else {
            setModel(selectedModel);
        }
    };
    
    const handleApiKeySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsKeyValidating(true);
        setError('');

        if (!tempApiKey.startsWith('sk-')) {
            toast.error('Format API Key tidak valid. Seharusnya dimulai dengan "sk-".');
            setIsKeyValidating(false);
            return;
        }

        setOpenaiApiKey(tempApiKey);
        sessionStorage.setItem('openai_api_key', tempApiKey);
        toast.success('API Key disimpan untuk sesi ini!');
        setModel('dall-e-3');
        setIsDalleModalOpen(false);
        setIsKeyValidating(false);
    };

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
            setPrompt(''); 
            const decoder = new TextDecoder();
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
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

    const generateImage = useCallback(async (options: { forceNewSeed: boolean } = { forceNewSeed: false }) => {
        if (!isLoggedIn || isLoading || !prompt) {
            if (!prompt) toast.error("Prompt tidak boleh kosong!");
            if (!isLoggedIn) handleLoginTrigger();
            return;
        };
        
        if (model === 'dall-e-3' && !openaiApiKey) {
            toast.error("API Key OpenAI diperlukan untuk menggunakan DALL-E 3.");
            setIsDalleModalOpen(true);
            return;
        }

        setIsLoading(true);
        setImageUrl('');
        setError('');
        const loadingToast = toast.loading('AI sedang menggambar...');

        const currentSeed = options.forceNewSeed || !seed
            ? Math.floor(Math.random() * 1000000)
            : seed;
        if (model !== 'dall-e-3') {
            setSeed(currentSeed);
        }

        try {
            let base64data;

            if (model === 'dall-e-3') {
                const response = await fetch('/api/generate-dalle-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt,
                        apiKey: openaiApiKey,
                        size: `${width}x${height}` // Gunakan state ukuran yang ada
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Gagal menghasilkan gambar dengan DALL-E 3');
                }
                const result = await response.json();
                base64data = result.b64_json;
            } else {
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

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`Gagal menghasilkan gambar (Error: ${response.status})`);
                }
                const imageBlob = await response.blob();
                if (!imageBlob.type.startsWith('image/')) {
                    throw new Error('Respons dari API bukan file gambar yang valid.');
                }
                
                base64data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(imageBlob);
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = (error) => reject(new Error("Gagal mengonversi gambar."));
                });
            }

            const finalImageUrl = model === 'dall-e-3' ? `data:image/png;base64,${base64data}` : base64data;
            setImageUrl(finalImageUrl);
            toast.dismiss(loadingToast);
            toast.success('Gambar berhasil dibuat!');

            setHistory(prevHistory => {
                const newHistoryItem: HistoryItem = { id: new Date().toISOString(), imageUrl: finalImageUrl, prompt, seed: model === 'dall-e-3' ? '' : currentSeed };
                const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS);
                saveHistoryToStorage(updatedHistory);
                return updatedHistory;
            });

        } catch (err: any) {
            const errorMessage = err.message || 'Terjadi kesalahan yang tidak diketahui.';
            setError(errorMessage);
            toast.dismiss(loadingToast);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn, isLoading, model, width, height, prompt, negativePrompt, isPrivate, seed, openaiApiKey, handleLoginTrigger]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        generateImage({ forceNewSeed: !seed });
    };

    const handleVariations = () => {
        if (model === 'dall-e-3') {
            toast('Membuat variasi baru...', { icon: '🎨' });
            generateImage({ forceNewSeed: true }); // DALL-E tidak pakai seed, jadi ini akan selalu baru
        } else {
            toast('Membuat variasi dengan seed baru...', { icon: '🎨' });
            generateImage({ forceNewSeed: true });
        }
    };

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(prompt);
        toast.success('Prompt disalin ke clipboard!');
    };

    const handleDownload = () => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        const downloadSeed = model === 'dall-e-3' ? 'dalle3' : seed;
        link.download = `${prompt.substring(0, 30).replace(/\s/g, '_')}_${downloadSeed}.png`;
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

    const viewHistoryImage = (item: HistoryItem) => {
        setImageUrl(item.imageUrl);
        setPrompt(item.prompt);
        setSeed(item.seed);
        toast('Memuat gambar dari riwayat.');
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <form onSubmit={handleSubmit} className={styles.form} style={{ position: 'relative' }} autoComplete="off">
                {!isLoggedIn && (
                    <div className={styles.loginOverlay}>
                        <Lock size={48} />
                        <p>Login untuk mengakses fitur Generate Gambar ini.</p>
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
                <fieldset className={!isLoggedIn ? styles.fieldsetDisabled : ''} disabled={!isLoggedIn || isLoading || isEnhancing}>
                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label htmlFor="prompt-image" className={styles.label}>
                                <ImageIcon size={16} /> Prompt Gambar
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="button" onClick={handleEnhancePrompt} className={styles.iconButton} disabled={!prompt || isEnhancing} title="Tingkatkan dengan AI">
                                    {isEnhancing ? <LoaderCircle size={18} className={styles.loadingIcon} /> : <Sparkles size={18} />}
                                </button>
                                <button type="button" onClick={handleClear} className={styles.iconButton} title="Bersihkan Prompt">
                                    <XCircle size={18} />
                                </button>
                            </div>
                        </div>
                        <textarea id="prompt-image" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Contoh: seekor kucing astronot..." rows={4} className={styles.textarea} required />
                    </div>

                    <details className={styles.advancedSettings}>
                        <summary className={styles.summaryButton}>
                            <Settings size={16} />
                            Pengaturan Lanjutan
                        </summary>

                        <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                            <label htmlFor="negative-prompt" className={styles.label}>Negative Prompt (Opsional)</label>
                            <input id="negative-prompt" type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="Contoh: teks, watermark..." className={styles.input} disabled={model === 'dall-e-3'}/>
                             {model === 'dall-e-3' && <small style={{marginTop: '0.5rem', display: 'block'}}>Negative prompt tidak didukung untuk DALL-E 3.</small>}
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Preset Ukuran</label>
                            <div className={styles.presetContainer}>
                                <PresetButton label="Square" width={1024} height={1024} onClick={setPresetSize} />
                                <PresetButton label="Portrait" width={1024} height={1792} onClick={setPresetSize} disabled={model === 'dall-e-3'} />
                                <PresetButton label="Landscape" width={1792} height={1024} onClick={setPresetSize} disabled={model === 'dall-e-3'} />
                            </div>
                             {model === 'dall-e-3' && <small style={{marginTop: '0.5rem', display: 'block'}}>DALL-E 3 saat ini hanya mendukung ukuran 1024x1024, 1024x1792, and 1792x1024.</small>}
                        </div>

                        <div className={styles.controlsGrid}>
                            <div className={styles.formGroup}>
                                <label htmlFor="model-image" className={styles.label}>Model</label>
                                <select id="model-image" value={model} onChange={(e) => handleModelChange(e.target.value)} className={styles.input} disabled={modelsLoading}>
                                    {modelsLoading ? (
                                        <option>Memuat model...</option>
                                    ) : (
                                        availableModels.map(m => <option key={m.id} value={m.id}>{m.id}</option>)
                                    )}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="seed-image" className={styles.label}>Seed</label>
                                <div className={styles.seedContainer}>
                                    <input id="seed-image" type="number" value={seed} onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : '')} placeholder="Angka acak" className={styles.input} disabled={model === 'dall-e-3'} />
                                    <button type="button" onClick={generateRandomSeed} aria-label="Generate random seed" disabled={model === 'dall-e-3'}><Dices size={18} /></button>
                                </div>
                                {model === 'dall-e-3' && <small style={{marginTop: '0.5rem', display: 'block'}}>Seed tidak didukung untuk DALL-E 3.</small>}
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
                    <h2 className={styles.resultHeader}><ImageIcon size={24} /> Hasil Gambar</h2>
                    {error && <p style={{ color: "red" }}><strong>Error:</strong> {error}</p>}
                    {isLoading && !imageUrl && (<div className={styles.imageLoadingContainer}><LoaderCircle size={48} className={styles.loadingIcon} /><p>AI sedang menggambar...</p></div>)}
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
                </div>
            )}
            {history.length > 0 && (
                <div className={styles.historyContainer}>
                    <h3 className={styles.historyTitle}><History size={18} /> Riwayat Gambar</h3>
                    <div className={styles.historyGrid}>
                        {history.map(item => (
                            <div key={item.id} className={styles.historyItem} onClick={() => viewHistoryImage(item)} title={`Lihat: "${item.prompt}"`}>
                                <Image src={item.imageUrl} alt={item.prompt} width={100} height={100} style={{ objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Dialog.Root open={isDalleModalOpen} onOpenChange={(isOpen) => {
                setIsDalleModalOpen(isOpen);
                if (!isOpen && model === 'dall-e-3' && !openaiApiKey) {
                    setModel('flux');
                }
            }}>
              <Dialog.Portal>
                  <Dialog.Overlay className={styles.dialogOverlay} />
                  <Dialog.Content className={styles.dialogContent}>
                      <Dialog.Title className={styles.dialogTitle}>
                        <KeyRound size={24} style={{marginRight: '0.75rem'}}/>
                        Masukkan API Key OpenAI
                      </Dialog.Title>
                      <Dialog.Description className={styles.dialogDescription}>
                          Untuk menggunakan model DALL-E 3, Anda perlu memasukkan API key OpenAI Anda. Kunci ini hanya akan disimpan di browser Anda untuk sesi ini.
                      </Dialog.Description>
                      <form onSubmit={handleApiKeySubmit}>
                          <div className={styles.formGroup}>
                              <label htmlFor="api-key-input" className={styles.label}>OpenAI API Key</label>
                              <input
                                  id="api-key-input"
                                  type="password"
                                  value={tempApiKey}
                                  onChange={(e) => setTempApiKey(e.target.value)}
                                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                                  className={styles.input}
                                  required
                              />
                          </div>
                          <button type="submit" className={styles.button} disabled={isKeyValidating}>
                              {isKeyValidating ? <LoaderCircle size={22} className={styles.loadingIcon} /> : 'Simpan & Gunakan Model'}
                          </button>
                      </form>
                      <Dialog.Close asChild>
                          <button className={styles.dialogCloseButton} aria-label="Close"><X size={20} /></button>
                      </Dialog.Close>
                  </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}