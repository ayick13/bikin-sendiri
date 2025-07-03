'use client';

import { useState, useEffect } from 'react';
// Pastikan nama file CSS ini sudah benar (misal: Home.module.css)
import styles from './Home.module.css'; 
import { Wand2, Copy, Check, Moon, Sun, LoaderCircle, Bot, Pilcrow } from 'lucide-react';

type AIModel = {
  id: string;
  name: string;
};

export default function AdvancedGenerator() {
  const [prompt, setPrompt] = useState('');
  const [details, setDetails] = useState('');
  const [model, setModel] = useState('openai'); // Model default sebagai fallback
  const [temperature, setTemperature] = useState(0.7);
  
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

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
        body: JSON.stringify({ prompt: combinedPrompt, model, temperature }),
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
            if (jsonString.trim() === '[DONE]') return;
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

  return (
    <div className={`${styles.container} ${isDarkMode ? 'dark' : ''}`}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>AI Text <span>Pro</span></h1>
          <label className={styles.toggleSwitch}>
            <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
            <span className={styles.toggleSlider}>
              {isDarkMode ? <Moon size={16} style={{margin: 'auto', color: '#1f2937'}}/> : <Sun size={16} style={{margin: 'auto', color: 'white'}}/>}
            </span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="prompt" className={styles.label}>
              <Pilcrow size={16} style={{ display: 'inline-block', marginRight: '0.5rem' }}/> Prompt Utama
            </label>
            <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Contoh: Tulis sebuah cerita pendek..." rows={5} className={styles.textarea} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="details" className={styles.label}>
              <Bot size={16} style={{ display: 'inline-block', marginRight: '0.5rem' }}/> Detail Tambahan
            </label>
            <textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Gaya penulisan lucu, sebutkan kucing bernama 'Oyen'." rows={3} className={styles.textarea} />
          </div>

          <div className={styles.controlsGrid}>
            <div className={styles.select}>
              <label htmlFor="model" className={styles.label}>Model</label>
              {/* --- PERUBAHAN UTAMA DI SINI --- */}
              <select id="model" value={model} onChange={(e) => setModel(e.target.value)} className={styles.select} disabled={!modelsLoaded}>
                {!modelsLoaded ? (
                  <option>Memuat model...</option>
                ) : availableModels.length > 0 ? (
                  availableModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)
                ) : (
                  // Tampilkan teks yang lebih baik saat fallback
                  <option value="openai">OpenAI</option>
                )}
              </select>
            </div>
            <div className={styles.sliderContainer}>
              <label htmlFor="temperature" className={styles.label}>Temperature: {temperature}</label>
              <input id="temperature" type="range" min="0" max="2" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className={styles.slider}/>
            </div>
          </div>
          
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? <LoaderCircle size={22} className={styles.loadingIcon} /> : <Wand2 size={22} />}
            <span>{isLoading ? 'Generating...' : 'Generate Text'}</span>
          </button>
        </form>

        {(error || result) && (
          <div className={styles.resultCard}>
            <h2 className={styles.resultHeader}><Bot size={24}/> AI Generated Text</h2>
            {error ? (
              <p style={{color: "var(--error-color)"}}><strong>Error:</strong> {error}</p>
            ) : (
              <div className={`${styles.resultText} ${isLoading ? '' : styles.done}`}>{result}</div>
            )}
            {result && !isLoading && (
              <button onClick={handleCopy} className={`${styles.button} ${styles.copyButton} ${isCopied ? styles.copied : ''}`}>
                {isCopied ? <Check size={20} /> : <Copy size={20} />}
                <span>{isCopied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
