// app/components/VideoPromptGenerator.tsx
'use client';

import { useState } from 'react';
import styles from '../Home.module.css';
import { 
    Film, Clapperboard, Camera, Palette, Sparkles, Wand2, Copy, Check, 
    Sun, Aperture, Brush, Lock, Bot, Video, Star, Layers, BrainCircuit, 
    Film as FilmIcon, Rocket, LoaderCircle // FIX: LoaderCircle ditambahkan di sini
} from 'lucide-react';
import CustomSelect from './CustomSelect';
import { useSession } from 'next-auth/react';
import ComingSoon from './ComingSoon';

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

// Komponen Form Generator yang sudah ada
const DefaultVideoGenerator = () => {
    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;

    // State untuk input form
    const [subject, setSubject] = useState('Ironman Naik Pesawat');
    const [action, setAction] = useState('Disetai badai dan petir yang menggelegar, Ironman terbang dengan pesawat jet tempur melewati langit yang gelap. Pesawatnya berkilau di bawah cahaya kilat, menciptakan kontras dramatis dengan awan badai yang mengancam di sekitarnya.');
    const [mood, setMood] = useState('Cinematic');
    const [style, setStyle] = useState('Realistic');
    const [color, setColor] = useState('dengan kilatan cahaya kuning dan biru yang dramatis');
    const [artisticStyle, setArtisticStyle] = useState('dalam gaya film superhero modern, dengan fokus pada detail dan efek visual yang dramatis');
    const [timeAndWeather, setTimeAndWeather] = useState('Heavy rain');
    const [filmEffects, setFilmEffects] = useState('film grain, subtle lens flare');
    const [camera, setCamera] = useState('Dynamic drone shot');
    const [cameraMovement, setCameraMovement] = useState('Fast tracking shot');
    const [lens, setLens] = useState('35mm');
    const [lighting, setLighting] = useState('dramatic backlighting from the clouds');
    const [quality, setQuality] = useState('4K, photorealistic, high detail, sharp focus');

    // State untuk hasil, loading, error, dan copy
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const generateVideoPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLoggedIn || isLoading) return;
        setIsLoading(true);
        setResult('');
        setError('');
        setIsCopied(false);
        try {
            const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject, action, mood, style, color, artisticStyle,
                    timeAndWeather, filmEffects, camera, cameraMovement,
                    lens, lighting, quality
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server responded with status ${response.status}`);
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
                            if (textChunk) setResult((prev) => prev + textChunk);
                        } catch (e) { /* Abaikan */ }
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
        <>
            <form onSubmit={generateVideoPrompt} className={styles.form} style={{ position: 'relative' }} autoComplete="off">
                {!isLoggedIn && (
                    <div className={styles.loginOverlay}>
                        <Lock size={48} />
                        <p>Login untuk mengakses fitur ini.</p>
                    </div>
                )}
                <fieldset className={!isLoggedIn ? styles.fieldsetDisabled : ''} disabled={!isLoggedIn || isLoading}>
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
                                <label className={styles.label}><Sun size={14}/> Waktu & Cuaca</label>
                                <CustomSelect options={timeAndWeatherOptions} value={timeAndWeather} onValueChange={setTimeAndWeather} placeholder="Pilih Waktu/Cuaca" />
                            </div>
                            <div>
                                <label className={styles.label}><Aperture size={14}/> Gaya Artistik</label>
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
                    <button type="submit" className={styles.button} disabled={isLoading || !isLoggedIn}>
                        {isLoading ? <LoaderCircle size={22} className={styles.loadingIcon} /> : <Wand2 size={22} />}
                        <span>{isLoading ? 'Generating...' : 'Generate with AI'}</span>
                    </button>
                </fieldset>
            </form>
            {(isLoading || error || result) && (
                <div className={styles.resultCard}>
                    <h2 className={styles.resultHeader}><Bot size={24}/> AI Generated Video Prompt</h2>
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
};


export default function VideoPromptGenerator() {
  const [activeModel, setActiveModel] = useState('default');

  const renderContent = () => {
    switch (activeModel) {
      case 'veo':
        return <ComingSoon title="Google Veo 3" description="Model video generasi berikutnya dari Google, menjanjikan kualitas sinematik dan pemahaman konteks yang luar biasa. Fitur ini akan segera terintegrasi." />;
      case 'capcut':
        return <ComingSoon title="CapCut" description="Model video generasi CapCut yang menjanjikan kualitas editing dan  konteks yang luar biasa. Fitur ini akan segera terintegrasi." />;
        case 'kling':
        return <ComingSoon title="Kling AI" description="Generator video dari Kuaishou Technology yang mampu menghasilkan video full HD hingga 2 menit dengan gerakan kompleks dan realistis. Nantikan kehadirannya." />;
      case 'sora':
        return <ComingSoon title="OpenAI Sora" description="Model AI dari OpenAI yang dapat menciptakan adegan realistis dan imajinatif dari instruksi teks, menghasilkan video berkualitas tinggi." />;
      case 'lumiere':
        return <ComingSoon title="Google Lumiere" description="Model difusi teks-ke-video yang dirancang untuk mensintesis video yang bergerak secara realistis, beragam, dan koheren." />;
      case 'runway':
        return <ComingSoon title="Runway Gen-3 Alpha" description="Generasi terbaru dari RunwayML yang menawarkan peningkatan fidelitas, konsistensi, dan kecepatan dalam pembuatan video dari teks." />;
      case 'lora':
        return <ComingSoon title="Lora & TensorArt" description="Integrasi dengan model LoRA (Low-Rank Adaptation) dari TensorArt untuk kustomisasi gaya karakter dan objek yang mendalam pada video Anda. Segera hadir." />;
      case 'default':
      default:
        return <DefaultVideoGenerator />;
    }
  };

  return (
    <div>
      <div className={styles.subTabContainer}>
        <button className={`${styles.subTab} ${activeModel === 'default' ? styles.activeSubTab : ''}`} onClick={() => setActiveModel('default')}>
          <Video size={16} /> Default
        </button>
        <button className={`${styles.subTab} ${activeModel === 'veo' ? styles.activeSubTab : ''}`} onClick={() => setActiveModel('veo')}>
          <Star size={16} /> Google Veo 3 <span className={styles.comingSoonBadge}>Coming Soon</span>
        </button>
        <button className={`${styles.subTab} ${activeModel === 'capcut' ? styles.activeSubTab : ''}`} onClick={() => setActiveModel('capcut')}>
          <Clapperboard size={16} /> CapCut <span className={styles.comingSoonBadge}>Coming Soon</span>
        </button>
        <button className={`${styles.subTab} ${activeModel === 'kling' ? styles.activeSubTab : ''}`} onClick={() => setActiveModel('kling')}>
          <Star size={16} /> Kling AI <span className={styles.comingSoonBadge}>Coming Soon</span>
        </button>
        <button className={`${styles.subTab} ${activeModel === 'sora' ? styles.activeSubTab : ''}`} onClick={() => setActiveModel('sora')}>
          <BrainCircuit size={16} /> Sora <span className={styles.comingSoonBadge}>Coming Soon</span>
        </button>
        <button className={`${styles.subTab} ${activeModel === 'lumiere' ? styles.activeSubTab : ''}`} onClick={() => setActiveModel('lumiere')}>
          <FilmIcon size={16} /> Lumiere <span className={styles.comingSoonBadge}>Coming Soon</span>
        </button>
        <button className={`${styles.subTab} ${activeModel === 'runway' ? styles.activeSubTab : ''}`} onClick={() => setActiveModel('runway')}>
          <Rocket size={16} /> Runway Gen-3 <span className={styles.comingSoonBadge}>Coming Soon</span>
        </button>
        <button className={`${styles.subTab} ${activeModel === 'lora' ? styles.activeSubTab : ''}`} onClick={() => setActiveModel('lora')}>
          <Layers size={16} /> Lora / TensorArt <span className={styles.comingSoonBadge}>Coming Soon</span>
        </button>
      </div>
      <div className={styles.subTabContent}>
        {renderContent()}
      </div>
    </div>
  );
}
