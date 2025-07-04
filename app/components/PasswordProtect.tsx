// app/components/PasswordProtect.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from '../Home.module.css';
import { KeyRound, LogIn, TriangleAlert, Eye, EyeOff } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

type PasswordProtectProps = {
  children: React.ReactNode;
};

export default function PasswordProtect({ children }: PasswordProtectProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  
  // State baru untuk menyimpan site key yang diambil dari API
  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string | null>(null);

  useEffect(() => {
    // Ambil status login dari session storage
    const unlockedStatus = sessionStorage.getItem('eKursusUnlocked');
    if (unlockedStatus === 'true') {
      setIsUnlocked(true);
    }

    // Ambil site key dari API kita
    async function fetchSiteKey() {
      try {
        const response = await fetch('/api/get-turnstile-key');
        if (!response.ok) throw new Error('Gagal mengambil kunci verifikasi');
        const data = await response.json();
        setTurnstileSiteKey(data.siteKey);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat komponen verifikasi keamanan.');
      }
    }

    fetchSiteKey();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!turnstileToken) {
      setError('Harap selesaikan verifikasi keamanan (captcha).');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, turnstileToken }),
      });
      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem('eKursusUnlocked', 'true');
        setIsUnlocked(true);
      } else {
        setError(data.message || 'Gagal memverifikasi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className={styles.passwordFormContainer}>
      <KeyRound size={48} className={styles.passwordFormIcon} />
      <h2 className={styles.passwordFormTitle}>Verifikasi Akses</h2>
      <p className={styles.passwordFormDescription}>
        Selesaikan verifikasi keamanan dan masukkan password untuk melanjutkan.
      </p>
      <form onSubmit={handleSubmit} className={styles.passwordForm}>
        <div style={{ alignSelf: 'center', height: '65px' }}>
          {/* Tampilkan Turnstile HANYA JIKA siteKey sudah didapatkan */}
          {turnstileSiteKey ? (
            <Turnstile
              siteKey={turnstileSiteKey}
              onSuccess={setTurnstileToken}
              options={{ theme: 'auto' }}
            />
          ) : (
            <p className={styles.passwordFormDescription}>Memuat verifikasi...</p>
          )}
        </div>
        <div className={styles.passwordInputContainer}>
          <input
                        id="password-input" // Tambahkan id
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password..."
                        className={styles.passwordInput}
                        required
                    />
          <button
            type="button"
            className={styles.passwordVisibilityToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <button type="submit" className={styles.passwordButton} disabled={isLoading || !turnstileSiteKey}>
          {isLoading ? 'Memverifikasi...' : 'Buka Akses'}
          {!isLoading && <LogIn size={18} />}
        </button>
      </form>
      {error && (
        <p className={styles.passwordFormError}>
          <TriangleAlert size={16} /> {error}
        </p>
      )}
    </div>
  );
}