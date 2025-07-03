// app/components/VideoPromptGenerator.tsx
'use client';

import { useState } from 'react';
import styles from '../Home.module.css';
import { Film, Clapperboard, Camera, Palette, Sparkles, Wand2, Copy, Check } from 'lucide-react';
import CustomSelect from './CustomSelect';

const moodOptions = [
  { value: 'Cinematic', label: 'Cinematic' },
  { value: 'Dramatic', label: 'Dramatic' },
  { value: 'Eerie', label: 'Eerie' },
  { value: 'Nostalgic', label: 'Nostalgic' },
  { value: 'Epic', label: 'Epic' },
  { value: 'Dreamy', label: 'Dreamy' },
];

const styleOptions = [
  { value: 'Realistic', label: 'Realistic' },
  { value: 'Anime', label: 'Anime' },
  { value: 'Claymation', label: 'Claymation' },
  { value: 'Documentary', label: 'Documentary' },
  { value: 'Found Footage', label: 'Found Footage' },
  { value: 'Vintage Film', label: 'Vintage Film' },
];

const cameraOptions = [
    { value: 'Dynamic drone shot', label: 'Dynamic drone shot' },
    { value: 'Extreme close-up', label: 'Extreme close-up' },
    { value: 'Wide shot', label: 'Wide shot' },
    { value: 'First-person view (FPV)', label: 'First-person view (FPV)' },
    { value: 'Handheld shot', label: 'Handheld shot' },
];

const lensOptions = [
    { value: '35mm', label: '35mm' },
    { value: '50mm', label: '50mm' },
    { value: '85mm Portrait', label: '85mm Portrait' },
    { value: 'Telephoto lens', label: 'Telephoto lens' },
    { value: 'Wide-angle lens', label: 'Wide-angle lens' },
];

export default function VideoPromptGenerator() {
    const [result, setResult] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    
    const [subject, setSubject] = useState('a majestic eagle');
    const [action, setAction] = useState('soaring through a thunderstorm');
    const [mood, setMood] = useState('Cinematic');
    const [style, setStyle] = useState('Realistic');
    const [color, setColor] = useState('dark and moody colors with flashes of lightning');
    const [camera, setCamera] = useState('Dynamic drone shot');
    const [lens, setLens] = useState('35mm');
    const [lighting, setLighting] = useState('dramatic backlighting from the clouds');
    const [quality, setQuality] = useState('4K, photorealistic, high detail, sharp focus');

    const generateVideoPrompt = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fullPrompt = `${subject}, ${action}, ${mood} atmosphere, ${style} style, ${color}, ${camera}, shot on ${lens} lens, ${lighting}, ${quality}`;
        setResult(fullPrompt);
        setIsCopied(false);
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
        <>
            <form onSubmit={generateVideoPrompt} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}><Clapperboard size={16}/> Basic Setting</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subjek utama..." className={styles.input} />
                    <textarea value={action} onChange={e => setAction(e.target.value)} placeholder="Aksi/Adegan..." rows={2} className={styles.textarea} style={{marginTop: '1rem'}}/>
                </div>
                
                <div className={styles.formGroup}>
                    <label className={styles.label}><Palette size={16}/> Mood & Style</label>
                    <div className={styles.controlsGrid}>
                        <CustomSelect options={moodOptions} value={mood} onValueChange={setMood} placeholder="Pilih Mood" />
                        <CustomSelect options={styleOptions} value={style} onValueChange={setStyle} placeholder="Pilih Style" />
                    </div>
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} placeholder="Palet warna..." className={styles.input} style={{marginTop: '1rem'}}/>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}><Camera size={16}/> Advanced Setting (Camera)</label>
                    <div className={styles.controlsGrid}>
                       <CustomSelect options={cameraOptions} value={camera} onValueChange={setCamera} placeholder="Pilih Tipe Shot" />
                       <CustomSelect options={lensOptions} value={lens} onValueChange={setLens} placeholder="Pilih Lensa" />
                    </div>
                    <input type="text" value={lighting} onChange={e => setLighting(e.target.value)} placeholder="Pencahayaan..." className={styles.input} style={{marginTop: '1rem'}} />
                </div>
                
                <div className={styles.formGroup}>
                     <label className={styles.label}><Sparkles size={16}/> Quality & Details</label>
                     <textarea value={quality} onChange={e => setQuality(e.target.value)} placeholder="Detail kualitas..." rows={2} className={styles.textarea}/>
                </div>

                <button type="submit" className={styles.button}><Wand2 size={22} /><span>Generate Prompt</span></button>
            </form>
            {result && (
                <div className={styles.resultCard}>
                    <h2 className={styles.resultHeader}><Film size={24}/> Video Prompt Result</h2>
                    <div className={styles.resultText}>{result}</div>
                    <button onClick={handleCopy} className={`${styles.button} ${styles.copyButton} ${isCopied ? styles.copied : ''}`}>
                        {isCopied ? <Check size={20} /> : <Copy size={20} />}
                        <span>{isCopied ? 'Copied!' : 'Copy to Clipboard'}</span>
                    </button>
                </div>
            )}
        </>
    );
}