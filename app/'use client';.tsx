'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function AdvancedGenerator() {
  // State untuk form inputs
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('openai');
  const [temperature, setTemperature] = useState(0.7);

  // State untuk hasil dan UI
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Efek untuk mengubah tema pada body
  useEffect(() => {
    document.body.className = isDarkMode ? styles.dark : '';
  }, [isDarkMode]);

  // Fungsi untuk menangani streaming response
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setResult('');
    setError('');
    setIsCopied(false);

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, temperature }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch response');
      }

      // Membaca stream dari respons
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setResult((prev) => prev + chunk);
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
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ''}`}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            AI Text <span>Pro</span>
          </h1>
          <label className={styles.toggleSwitch}>
            <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="prompt" className={styles.label}>
              Your Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Jelaskan cara kerja fotosintesis dengan analogi sederhana..."
              rows={5}
              className={styles.textarea}
              required
            />
          </div>

          <div className={styles.controlsGrid}>
            <div className={styles.select}>
              <label htmlFor="model" className={styles.label}>Model</label>
              <select id="model" value={model} onChange={(e) => setModel(e.target.value)} className={styles.select}>
                <option value="openai">OpenAI (Cepat)</option>
                <option value="mistral">Mistral (Kreatif)</option>
              </select>
            </div>
            <div className={styles.sliderContainer}>
              <label htmlFor="temperature" className={styles.label}>Temperature: {temperature}</label>
              <input
                id="temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>
          
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? <div className={styles.spinner}></div> : 'Generate Text'}
          </button>
        </form>

        {(error || result) && (
          <div className={styles.resultCard}>
            <h2 className={styles.resultHeader}>✨ AI Generated Text</h2>
            {error ? (
              <p style={{color: "var(--error-color)"}}><strong>Error:</strong> {error}</p>
            ) : (
              <div className={`${styles.resultText} ${isLoading ? '' : styles.done}`}>
                {result}
              </div>
            )}
             {result && !isLoading && (
              <button onClick={handleCopy} className={`${styles.button} ${styles.copyButton} ${isCopied ? styles.copied : ''}`}>
                {isCopied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}