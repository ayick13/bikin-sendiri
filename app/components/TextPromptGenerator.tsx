// app/components/TextPromptGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from '../Home.module.css'; 
import { Wand2, Copy, Check, LoaderCircle, Bot, Pilcrow, SlidersHorizontal, ChevronDown, Dices, Settings } from 'lucide-react';
import CustomSelect from './CustomSelect';

type AIModel = { id: string; name: string; };

export default function TextPromptGenerator() {
  const [systemPrompt, setSystemPrompt] = useState(
    'Anda adalah seorang ahli rekayasa prompt untuk generator gambar AI. Tugas Anda adalah mengambil masukan sederhana dari pengguna dan mengembangkannya menjadi prompt yang kaya, detail, dan deskriptif. Jangan bertanya. Jangan jelaskan proses Anda. Hanya hasilkan prompt akhir yang telah disempurnakan sebagai satu paragraf atau lebih berisi kata kunci dan frasa yang dipisahkan koma.'
  );
  const [prompt, setPrompt] = useState('');
  const [details, setDetails] = useState('');
  const [model, setModel] = useState('openai');
  const [temperature, setTemperature] = useState(0.7);
  const [seed, setSeed] = useState<number | ''>('');
  const [topP, setTopP] = useState(1.0);
  const [freqPenalty, setFreqPenalty] = useState(0.0);
  
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/get-models');
        if (!response.ok) throw new Error('Failed to load models');
        const models = await response.json();
        if (models && models.length > 0) {
            setAvailableModels(models);
            setModel(models[0].id);
        }
      } catch (error) {
        console.error("Error fetching models, using fallback:", error);
      } finally {
        setModelsLoaded(true);
      }
    };
    fetchModels();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setResult('');
    setError('');
    setIsCopied(false);

    const combinedPrompt = details ? `${prompt}\n\n## Detail Tambahan:\n${details}` : prompt;

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt: combinedPrompt, 
            model, 
            temperature,
            system: systemPrompt,
            seed,
            top_p: topP,
            frequency_penalty: freqPenalty
        }),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server responded with status ${response.status}`);
        } catch (jsonError) {
          throw new Error(`An error occurred. Server responded with status ${response.status}`);
        }
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to read response body.");
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonString = line.substring(6);
            if (jsonString.trim() === '[DONE]') { setIsLoading(false); return; };
            try {
              const parsed = JSON.parse(jsonString);
              const textChunk = parsed.choices?.[0]?.delta?.content;
              if (textChunk) {
                setResult((prev) => prev + textChunk);
              }
            } catch (e) { /* Abaikan chunk yang tidak valid */ }
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };
  
  const generateRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  const modelOptions = availableModels.map(m => ({ value: m.id, label: m.name }));
  const fallbackModelOption = [{ value: 'openai', label: 'OpenAI (Default)' }];

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
            <label htmlFor="systemPrompt" className={styles.label}><Settings size={16}/> System Prompt (Peran AI)</label>
            <textarea id="systemPrompt" value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} placeholder="Contoh: Anda adalah seorang penulis cerita fiksi ilmiah yang puitis." rows={4} className={styles.textarea} />
        </div>
        <div className={styles.formGroup}>
            <label htmlFor="prompt" className={styles.label}><Pilcrow size={16}/> Prompt Utama</label>
            <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Contoh: kucing astronot" rows={2} className={styles.textarea} required />
        </div>
        <div className={styles.formGroup}>
            <label htmlFor="details" className={styles.label}><Bot size={16}/> Detail Tambahan</label>
            <textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Contoh: memakai helm kaca, mengambang di luar angkasa" rows={2} className={styles.textarea} />
        </div>
        <details className={styles.advancedSettings}>
    {/* PERBAIKI: Tambahkan class ke summary dan ikon */}
    <summary className={styles.summaryButton}>
        <SlidersHorizontal size={16}/>
        Pengaturan Lanjutan
        <ChevronDown size={20} className={styles.summaryIcon} />
    </summary>
    <div className={styles.controlsGrid}>
              <div className={styles.select}>
                <label htmlFor="model" className={styles.label}>Model</label>
                <CustomSelect
                  placeholder={!modelsLoaded ? "Memuat model..." : "Pilih model"}
                  options={modelsLoaded && modelOptions.length > 0 ? modelOptions : fallbackModelOption}
                  value={model}
                  onValueChange={setModel}
                  disabled={!modelsLoaded}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="seed" className={styles.label}>Seed</label>
                <div className={styles.seedContainer}>
                    <input id="seed" type="number" value={seed} onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : '')} placeholder="Angka acak" className={styles.input}/>
                    <button type="button" onClick={generateRandomSeed} aria-label="Generate random seed"><Dices size={18}/></button>
                </div>
              </div>
            </div>
            <div className={styles.controlsGrid}>
                <div className={styles.sliderContainer}>
                  <label htmlFor="temperature" className={styles.label}>Temperature: {temperature}</label>
                  <input id="temperature" type="range" min="0" max="2" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className={styles.slider}/>
                </div>
                <div className={styles.sliderContainer}>
                  <label htmlFor="topP" className={styles.label}>Top P: {topP}</label>
                  <input id="topP" type="range" min="0" max="1" step="0.05" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} className={styles.slider}/>
                </div>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="freqPenalty" className={styles.label}>Frequency Penalty: {freqPenalty}</label>
                <input id="freqPenalty" type="range" min="-2.0" max="2.0" step="0.1" value={freqPenalty} onChange={(e) => setFreqPenalty(parseFloat(e.target.value))} className={styles.slider}/>
            </div>
        </details>
        <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? <LoaderCircle size={22} className={styles.loadingIcon} /> : <Wand2 size={22} />}
            <span>{isLoading ? 'Generating...' : 'Generate Text'}</span>
        </button>
      </form>
      {(error || result) && (
        <div className={styles.resultCard}>
          <h2 className={styles.resultHeader}><Bot size={24}/> AI Generated Text</h2>
          {error ? ( <p style={{color: "var(--error-color)"}}><strong>Error:</strong> {error}</p> ) 
          : ( <div className={`${styles.resultText} ${isLoading ? '' : styles.done}`}>{result}</div> )}
          {result && !isLoading && (
            <button onClick={handleCopy} className={`${styles.button} ${styles.copyButton} ${isCopied ? styles.copied : ''}`}>
                {isCopied ? <Check size={20} /> : <Copy size={20} />}
                <span>{isCopied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}