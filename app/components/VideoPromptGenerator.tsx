// app/components/VideoPromptGenerator.tsx

'use client';

import { useState } from 'react';
import styles from '../Home.module.css';
import { Film, Clapperboard, Camera, Palette, Sparkles, Wand2, Copy, Check } from 'lucide-react';

export default function VideoPromptGenerator() {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    
    // State untuk semua parameter video
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
        
        // Gabungkan semua parameter menjadi satu prompt yang koheren
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
                        <select value={mood} onChange={e => setMood(e.target.value)} className={styles.select}>
                            <option>Cinematic</option><option>Dramatic</option><option>Eerie</option><option>Nostalgic</option><option>Epic</option><option>Dreamy</option>
                        </select>
                        <select value={style} onChange={e => setStyle(e.target.value)} className={styles.select}>
                            <option>Realistic</option><option>Anime</option><option>Claymation</option><option>Documentary</option><option>Found Footage</option><option>Vintage Film</option>
                        </select>
                    </div>
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} placeholder="Palet warna..." className={styles.input} style={{marginTop: '1rem'}}/>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}><Camera size={16}/> Advanced Setting (Camera)</label>
                    <div className={styles.controlsGrid}>
                        <select value={camera} onChange={e => setCamera(e.target.value)} className={styles.select}>
                           <option>Dynamic drone shot</option><option>Extreme close-up</option><option>Wide shot</option><option>First-person view (FPV)</option><option>Handheld shot</option>
                        </select>
                         <select value={lens} onChange={e => setLens(e.target.value)} className={styles.select}>
                           <option>35mm</option><option>50mm</option><option>85mm Portrait</option><option>Telephoto lens</option><option>Wide-angle lens</option>
                        </select>
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