// app/components/Layout.tsx
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from "next-auth/react";
import * as Dialog from '@radix-ui/react-dialog';
import styles from '../Home.module.css';
import { Sun, Moon, Monitor, Menu, X, LoaderCircle, Github } from 'lucide-react';
import AuthButtons from './AuthButtons';
import Image from "next/image";

// Buat Context untuk menyediakan fungsi ke komponen anak
export const AppContext = createContext<{ handleLoginTrigger: () => void } | null>(null);

// Buat custom hook untuk mempermudah penggunaan context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext harus digunakan di dalam AppProvider');
  }
  return context;
};

type Theme = 'system' | 'light' | 'dark';
type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) setTheme(savedTheme);
    else setTheme('system');
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = (currentTheme: Theme) => {
      const isDark = 
        currentTheme === 'dark' || 
        (currentTheme === 'system' && mediaQuery.matches);
      root.classList.toggle('dark', isDark);
    };

    applyTheme(theme);
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  const handleSignIn = async (provider: 'google' | 'github') => {
      setLoadingProvider(provider);
      await signIn(provider, { callbackUrl: '/' });
  };

  const handleLoginTrigger = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    setIsLoginDialogOpen(true);
  };

  const ThemeSwitcher = () => (
    <div className={styles.themeSwitchContainer}>
      <button onClick={() => handleThemeChange('light')} className={`${styles.themeSwitchButton} ${theme === 'light' ? styles.activeTheme : ''}`}><Sun size={16} /></button>
      <button onClick={() => handleThemeChange('system')} className={`${styles.themeSwitchButton} ${theme === 'system' ? styles.activeTheme : ''}`}><Monitor size={16} /></button>
      <button onClick={() => handleThemeChange('dark')} className={`${styles.themeSwitchButton} ${theme === 'dark' ? styles.activeTheme : ''}`}><Moon size={16} /></button>
    </div>
  );

  return (
    <AppContext.Provider value={{ handleLoginTrigger }}>
      <div className={styles.pageWrapper}>
        <header className={styles.fixedHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <Link href="/" className={styles.logoLink}>
                <h1 className={styles.title}>AI <span>Studio</span>+</h1>
              </Link>
              <nav className={styles.navLinks}>
                <Link href="/docs">Dokumentasi</Link>
                <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
              </nav>
            </div>
            
            <div className={styles.headerRight}>
              <div className={styles.desktopAuth}>
                <AuthButtons onLoginTrigger={handleLoginTrigger} />
              </div>
              <ThemeSwitcher />
              <button className={styles.hamburgerMenu} onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
            </div>
          </div>
        </header>
        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.mobileMenuOverlay}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={styles.mobileMenuContent}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.mobileMenuHeader}>
                  <h2>Menu</h2>
                  <button className={styles.mobileMenuCloseButton} onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={28} />
                  </button>
                </div>
                <nav className={styles.mobileNavLinks}>
                  <Link href="/docs">Dokumentasi</Link>
                  <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
                </nav>
                <ThemeSwitcher />
                <div className={styles.mobileAuthContainer}>
                  <AuthButtons onLoginTrigger={handleLoginTrigger} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className={styles.mainContent}>
          {children}
        </main>

        <Dialog.Root open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <Dialog.Portal>
              <Dialog.Overlay className={styles.dialogOverlay} />
              <Dialog.Content className={styles.dialogContent}>
                  <Dialog.Title className={styles.dialogTitle}>Login ke AI Studio+</Dialog.Title>
                  <Dialog.Description className={styles.dialogDescription}>
                      Pilih provider pilihan Anda untuk melanjutkan.
                  </Dialog.Description>
                  <div className={styles.dialogAuthOptions}>
                      <button onClick={() => handleSignIn('google')} className={styles.authButtonWide} disabled={!!loadingProvider}>
                          {loadingProvider === 'google' ? <LoaderCircle size={20} className={styles.loadingIcon} /> : <Image src="/google-icon.svg" alt="Google Icon" width={20} height={20} className={styles.authIcon} />}
                          <span>{loadingProvider === 'google' ? 'Mengarahkan...' : 'Lanjutkan dengan Google'}</span>
                      </button>
                      <button onClick={() => handleSignIn('github')} className={styles.authButtonWide} disabled={!!loadingProvider}>
                          {loadingProvider === 'github' ? <LoaderCircle size={20} className={styles.loadingIcon} /> : <Github className={styles.authIcon} />}
                          <span>{loadingProvider === 'github' ? 'Mengarahkan...' : 'Lanjutkan dengan GitHub'}</span>
                      </button>
                  </div>
                  <Dialog.Close asChild>
                      <button className={styles.dialogCloseButton} aria-label="Close"><X size={20} /></button>
                  </Dialog.Close>
              </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </AppContext.Provider>
  );
}