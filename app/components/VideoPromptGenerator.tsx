// app/components/VideoPromptGenerator.tsx
'use client';

import { useState } from 'react';
import styles from '../Home.module.css';
// Ganti 'PaintBrush' menjadi 'Brush' di sini
import { Film, Clapperboard, Camera, Palette, Sparkles, Wand2, Copy, Check, Sun, Wind, Aperture, Brush } from 'lucide-react';
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

const cameraMovementOptions = [
    { value: 'Static shot', label: 'Static Shot' },
    { value: 'Slow pan left', label: 'Slow Pan Left' },
    { value: 'Fast tracking shot', label: 'Fast Tracking Shot' },
    { value: 'Handheld shaky camera', label: 'Handheld Shaky' },
    { value: 'Crane shot ascending', label: 'Crane Shot Ascending' },
    { value: 'Dolly zoom (Vertigo effect)', label: 'Dolly Zoom (Vertigo)' },
];

const timeAndWeatherOptions = [
    { value: 'Golden hour', label: 'Golden Hour' },
    { value: 'Blue hour', label: 'Blue Hour' },
    { value: 'Misty morning', label: 'Misty Morning' },
    { value: 'Heavy rain', label: 'Heavy Rain' },
    { value: 'Snowstorm', label: 'Snowstorm' },
    { value: 'Overcast day', label: 'Overcast Day' },
    { value: 'Night time', label: 'Night Time' },
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
    const [artisticStyle, setArtisticStyle] = useState('in the style of a nature documentary');
    const [timeAndWeather, setTimeAndWeather] = useState('Heavy rain');
    const [filmEffects, setFilmEffects] = useState('film grain, subtle lens flare');
    const [camera, setCamera] = useState('Dynamic drone shot');
    const [cameraMovement, setCameraMovement] = useState('Fast tracking shot');
    const [lens, setLens] = useState('35mm');
    const [lighting, setLighting] = useState('dramatic backlighting from the clouds');
    const [quality, setQuality] = useState('4K, photorealistic, high detail, sharp focus');

    const generateVideoPrompt = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const promptParts = [
            subject,
            action,
            artisticStyle,
            `${mood} atmosphere`,
            `${style} style`,
            color,
            timeAndWeather,
            `cinematography by ${camera}, ${cameraMovement}`,
            `shot on ${lens} lens`,
            lighting,
            filmEffects,
            quality,
        ];
        const fullPrompt = promptParts.filter(part => part && part.trim() !== '').join(', ');
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
                    {/* Ganti 'PaintBrush' menjadi 'Brush' di sini */}
                    <label className={styles.label}><Brush size={16}/> Artistic & Environment</label>
                     <div className={styles.controlsGrid}>
                        <div className={styles.select}>
                            <label htmlFor="timeAndWeather" className={styles.label}><Sun size={14}/> Waktu & Cuaca</label>
                            <CustomSelect options={timeAndWeatherOptions} value={timeAndWeather} onValueChange={setTimeAndWeather} placeholder="Pilih Waktu/Cuaca" />
                        </div>
                        <div className={styles.formGroup}>
                           <label htmlFor="artisticStyle" className={styles.label}><Aperture size={14}/> Gaya Artistik</label>
                           <input id="artisticStyle" type="text" value={artisticStyle} onChange={e => setArtisticStyle(e.target.value)} placeholder="In the style of..." className={styles.input} />
                        </div>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}><Camera size={16}/> Camera & Technicals</label>
                    <div className={styles.controlsGrid}>
                       <CustomSelect options={cameraOptions} value={camera} onValueChange={setCamera} placeholder="Pilih Tipe Shot" />
                       <CustomSelect options={cameraMovementOptions} value={cameraMovement} onValueChange={setCameraMovement} placeholder="Pilih Gerakan Kamera" />
                    </div>
                    <div className={styles.controlsGrid} style={{marginTop: '1rem'}}>
                        <CustomSelect options={lensOptions} value={lens} onValueChange={setLens} placeholder="Pilih Lensa" />
                        <input type="text" value={lighting} onChange={e => setLighting(e.target.value)} placeholder="Pencahayaan..." className={styles.input} />
                    </div>
                </div>
                
                <div className={styles.formGroup}>
                     <label className={styles.label}><Sparkles size={16}/> Effects & Quality</label>
                     <div className={styles.controlsGrid}>
                        <input type="text" value={filmEffects} onChange={e => setFilmEffects(e.target.value)} placeholder="Efek film (film grain, dll)..." className={styles.input} />
                        <input value={quality} onChange={e => setQuality(e.target.value)} placeholder="Detail kualitas..." className={styles.input} />
                     </div>
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