// app/components/VideoPromptGenerator.tsx
'use client';

import { useState } from 'react';
import styles from '../Home.module.css';
// Tambahkan 'Lock' ke daftar impor ikon
import { Film, Clapperboard, Camera, Palette, Sparkles, Wand2, Copy, Check, Sun, Wind, Aperture, Brush, Lock } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { useSession } from 'next-auth/react'; // Import useSession

// Opsi untuk CustomSelect
const moodOptions = [
  { value: 'Cinematic', label: 'Cinematic' },
  { value: 'Epic', label: 'Epic' },
  { value: 'Dreamy', label: 'Dreamy' },
  { value: 'Dark', label: 'Dark' },
  { value: 'Light', label: 'Light' },
  { value: 'Surreal', label: 'Surreal' },
  { value: 'Playful', label: 'Playful' },
  { value: 'Other', label: 'Other' },
];
const styleOptions = [
  { value: 'Realistic', label: 'Realistic' },
  { value: 'Anime', label: 'Anime' },
  { value: 'Cartoon', label: 'Cartoon' },
  { value: '3D', label: '3D' },
  { value: 'Watercolor', label: 'Watercolor' },
  { value: 'Pixel Art', label: 'Pixel Art' },
  { value: 'Other', label: 'Other' },
];
const cameraOptions = [
  { value: 'Dynamic drone shot', label: 'Dynamic drone shot' },
  { value: 'Close up', label: 'Close up' },
  { value: 'Wide angle', label: 'Wide angle' },
  { value: 'POV', label: 'POV' },
  { value: 'Tracking shot', label: 'Tracking shot' },
  { value: 'Static', label: 'Static' },
  { value: 'Other', label: 'Other' },
];
const cameraMovementOptions = [
  { value: 'Fast tracking shot', label: 'Fast tracking shot' },
  { value: 'Slow pan', label: 'Slow pan' },
  { value: 'Zoom in', label: 'Zoom in' },
  { value: 'Zoom out', label: 'Zoom out' },
  { value: 'Handheld', label: 'Handheld' },
  { value: 'Steadicam', label: 'Steadicam' },
  { value: 'Other', label: 'Other' },
];
const timeAndWeatherOptions = [
  { value: 'Golden hour', label: 'Golden hour' },
  { value: 'Night', label: 'Night' },
  { value: 'Heavy rain', label: 'Heavy rain' },
  { value: 'Foggy', label: 'Foggy' },
  { value: 'Clear sky', label: 'Clear sky' },
  { value: 'Snowy', label: 'Snowy' },
  { value: 'Other', label: 'Other' },
];
const lensOptions = [
  { value: '35mm', label: '35mm' },
  { value: '50mm', label: '50mm' },
  { value: '85mm', label: '85mm' },
  { value: 'Wide', label: 'Wide' },
  { value: 'Telephoto', label: 'Telephoto' },
  { value: 'Fisheye', label: 'Fisheye' },
  { value: 'Other', label: 'Other' },
];

export default function VideoPromptGenerator() {
    // Ambil data sesi dari NextAuth
    const { data: session, status } = useSession();
    // Tentukan apakah pengguna sudah login
    const isLoggedIn = !!session?.user;

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
        // Hanya lanjutkan jika pengguna sudah login
        if (!isLoggedIn) return;

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
            <form onSubmit={generateVideoPrompt} className={styles.form} style={{ position: 'relative' }} autoComplete="off">
                {!isLoggedIn && (
                    <div className={styles.loginOverlay}>
                        <Lock size={48} />
                        <p>Login untuk mengakses fitur Generator Video ini.</p>
                    </div>
                )}
                <fieldset className={!isLoggedIn ? styles.fieldsetDisabled : ''} disabled={!isLoggedIn}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="subject"><Clapperboard size={16}/> Basic Setting</label>
                        <input id="subject" type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subjek utama..." className={styles.input} autoFocus={isLoggedIn} required />
                        <label className={styles.label} htmlFor="action" style={{marginTop: '1rem', fontWeight: 400}}>(Aksi/Adegan)</label>
                        <textarea id="action" value={action} onChange={e => setAction(e.target.value)} placeholder="Aksi/Adegan..." rows={2} className={styles.textarea} style={{marginTop: '0.5rem'}} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}><Palette size={16}/> Mood & Style</label>
                        <div className={styles.controlsGrid}>
                            <CustomSelect options={moodOptions} value={mood} onValueChange={setMood} placeholder="Pilih Mood" />
                            <CustomSelect options={styleOptions} value={style} onValueChange={setStyle} placeholder="Pilih Style" />
                        </div>
                        <label className={styles.label} htmlFor="color" style={{marginTop: '1rem', fontWeight: 400}}>(Palet warna)</label>
                        <input id="color" type="text" value={color} onChange={e => setColor(e.target.value)} placeholder="Palet warna..." className={styles.input} style={{marginTop: '0.5rem'}} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}><Brush size={16}/> Artistic & Environment</label>
                        <div className={styles.controlsGrid}>
                            <div>
                                <label htmlFor="timeAndWeather" className={styles.label}><Sun size={14}/> Waktu & Cuaca</label>
                                <CustomSelect options={timeAndWeatherOptions} value={timeAndWeather} onValueChange={setTimeAndWeather} placeholder="Pilih Waktu/Cuaca" />
                            </div>
                            <div>
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
                            <input id="lighting" type="text" value={lighting} onChange={e => setLighting(e.target.value)} placeholder="Pencahayaan..." className={styles.input} />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}><Sparkles size={16}/> Effects & Quality</label>
                        <div className={styles.controlsGrid}>
                            <input id="filmEffects" type="text" value={filmEffects} onChange={e => setFilmEffects(e.target.value)} placeholder="Efek film (film grain, dll)..." className={styles.input} />
                            <input id="quality" type="text" value={quality} onChange={e => setQuality(e.target.value)} placeholder="Detail kualitas..." className={styles.input} />
                        </div>
                    </div>

                    <button type="submit" className={styles.button}><Wand2 size={22} /><span>Generate Prompt</span></button>
                </fieldset>
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