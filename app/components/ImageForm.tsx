// app/components/ImageForm.tsx
'use client';

import { 
    ImageIcon, Wand2, Settings, LoaderCircle, Lock, Dices, 
    XCircle, Sparkles, ChevronDown 
} from 'lucide-react';
import styles from '../Home.module.css';
import PresetButton from './PresetButton';

// Mendefinisikan semua props yang dibutuhkan oleh form
type ImageFormProps = {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  model: string;
  setModel: (value: string) => void;
  availableModels: { id: string }[];
  modelsLoading: boolean;
  seed: number | '';
  setSeed: (value: number | '') => void;
  generateRandomSeed: () => void;
  width: number;
  setWidth: (value: number) => void;
  height: number;
  setHeight: (value: number) => void;
  setPresetSize: (w: number, h: number) => void;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  isEnhancing: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleEnhancePrompt: () => void;
  handleClear: () => void;
};

export default function ImageForm({
  prompt, setPrompt, negativePrompt, setNegativePrompt, model, setModel, 
  availableModels, modelsLoading, seed, setSeed, generateRandomSeed,
  width, setWidth, height, setHeight, setPresetSize, isPrivate, setIsPrivate,
  isLoggedIn, isLoading, isEnhancing, handleSubmit, handleEnhancePrompt, handleClear
}: ImageFormProps) {
  return (
    <form onSubmit={handleSubmit} className={styles.form} style={{ position: 'relative' }} autoComplete="off">
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
              <ChevronDown size={20} className={styles.summaryIcon} />
          </summary>
          <div className={styles.formGroup} style={{marginTop: '1.5rem'}}>
            <label htmlFor="negative-prompt" className={styles.label}>Negative Prompt (Opsional)</label>
            <input id="negative-prompt" type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="Contoh: teks, watermark..." className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Preset Ukuran</label>
            <div className={styles.presetContainer}>
                <PresetButton label="Square" width={1024} height={1024} onClick={setPresetSize} />
                <PresetButton label="Portrait" width={1024} height={1792} onClick={setPresetSize} />
                <PresetButton label="Landscape" width={1792} height={1024} onClick={setPresetSize} />
            </div>
          </div>
          <div className={styles.controlsGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="model-image" className={styles.label}>Model</label>
              <select id="model-image" value={model} onChange={(e) => setModel(e.target.value)} className={styles.input} disabled={modelsLoading}>
                {modelsLoading ? (
                    <option>Memuat model...</option>
                ) : (
                  availableModels.length > 0 ? (availableModels.map(m => <option key={m.id} value={m.id}>{m.id}</option>)) : (<option value="flux">flux</option>)
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
  );
}