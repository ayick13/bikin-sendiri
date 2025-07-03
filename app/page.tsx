'use client';

import { useState } from 'react';

export default function TextPromptGenerator() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResult('');
    setError('');
    setIsCopied(false);

    try {
      // Panggil backend internal Anda, bukan API eksternal
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data.result);

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
    <main style={{ fontFamily: 'sans-serif', maxWidth: '700px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>📝 Generator Teks AI</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="prompt" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Masukkan Prompt Anda
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Contoh: Tulis sebuah puisi tentang hujan di kota Gresik"
            rows={5}
            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: isLoading ? '#ccc' : '#0070f3', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          {isLoading ? 'Memproses...' : 'Buat Teks'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ff4d4f', borderRadius: '4px', backgroundColor: '#fff1f0', color: '#cf1322' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
          <h2 style={{ marginTop: '0', fontSize: '18px' }}>✨ Hasil Teks:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit', fontSize: '16px' }}>
            {result}
          </pre>
          <button 
            onClick={handleCopy}
            style={{ 
              width: '100%',
              padding: '10px', 
              fontSize: '16px', 
              color: 'white',
              backgroundColor: isCopied ? '#28a745' : '#17a2b8',
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            {isCopied ? 'Berhasil Disalin!' : 'Salin Teks'}
          </button>
        </div>
      )}
    </main>
  );
}