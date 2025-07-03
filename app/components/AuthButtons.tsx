// app/components/AuthButtons.tsx
'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import styles from '../Home.module.css';
import { LogIn, LogOut, LoaderCircle } from "lucide-react"; // Import LoaderCircle
import Image from "next/image";

export default function AuthButtons() {
    const { data: session, status } = useSession();
    const [isSigningIn, setIsSigningIn] = useState(false); // State baru untuk menangani loading awal

    // Tentukan apakah tombol harus dinonaktifkan
    const isDisabled = status === "loading" || isSigningIn;

    if (status === "loading") { // Biarkan div loading default untuk status NextAuth loading
        return <div className={styles.authLoading}></div>;
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
                <button onClick={() => signOut()} className={styles.authButton}>
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        );
    }

    // Fungsi untuk menangani klik Sign In
    const handleSignIn = async () => {
        setIsSigningIn(true); // Langsung set loading true saat diklik
        await signIn('google');
        // setIsSigningIn(false) mungkin tidak akan pernah tercapai jika signIn memicu redirect penuh
        // Namun, browser akan menangani redirect dan state ini akan direset pada pemuatan halaman baru.
    };

    return (
        <button onClick={handleSignIn} className={styles.authButton} disabled={isDisabled}>
            {isDisabled ? <LoaderCircle size={16} className={styles.loadingIcon} /> : <LogIn size={16} />}
            <span>{isDisabled ? 'Signing In...' : 'Sign In'}</span>
        </button>
    );
}