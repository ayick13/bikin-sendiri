// app/components/AuthButtons.tsx
'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import * as Dialog from '@radix-ui/react-dialog';
import styles from '../Home.module.css';
import { LogIn, LogOut, LoaderCircle, X, Github } from "lucide-react"; 
import Image from "next/image"; // 1. Import komponen Image dari Next.js

export default function AuthButtons() {
    const { data: session, status } = useSession();
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

    const handleSignIn = async (provider: 'google' | 'github') => {
        setLoadingProvider(provider);
        await signIn(provider, { callbackUrl: '/' });
    };

    if (status === "loading") {
        return <div className={styles.authLoading} style={{ width: '90px' }}></div>;
    }

    if (session) {
        return (
            <div className={styles.authContainer}>
                {session.user?.image && (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || "User Avatar"}
                        width={32}
                        height={32}
                        className={styles.avatar}
                    />
                )}
                <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.authButton}>
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className={styles.authButton}>
                    <LogIn size={16} />
                    <span>Login</span>
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.dialogOverlay} />
                <Dialog.Content className={styles.dialogContent}>
                    <Dialog.Title className={styles.dialogTitle}>Login ke Prompt Studio</Dialog.Title>
                    <Dialog.Description className={styles.dialogDescription}>
                        Pilih provider pilihan Anda untuk melanjutkan.
                    </Dialog.Description>
                    
                    <div className={styles.dialogAuthOptions}>
                        <button
                            onClick={() => handleSignIn('google')}
                            className={styles.authButtonWide}
                            disabled={!!loadingProvider}
                        >
                            {/* 2. Gunakan komponen Image untuk memuat SVG dari folder public */}
                            {loadingProvider === 'google' ? <LoaderCircle size={20} className={styles.loadingIcon} /> : (
                                <Image
                                    src="/google-icon.svg"
                                    alt="Google Icon"
                                    width={20}
                                    height={20}
                                    className={styles.authIcon}
                                />
                            )}
                            <span>{loadingProvider === 'google' ? 'Mengarahkan...' : 'Lanjutkan dengan Google'}</span>
                        </button>
                        <button
                            onClick={() => handleSignIn('github')}
                            className={styles.authButtonWide}
                            disabled={!!loadingProvider}
                        >
                            {loadingProvider === 'github' ? <LoaderCircle size={20} className={styles.loadingIcon} /> : <Github className={styles.authIcon} />}
                            <span>{loadingProvider === 'github' ? 'Mengarahkan...' : 'Lanjutkan dengan GitHub'}</span>
                        </button>
                    </div>

                    <Dialog.Close asChild>
                        <button className={styles.dialogCloseButton} aria-label="Close">
                            <X size={20} />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}