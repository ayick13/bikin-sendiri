// app/components/AuthButtons.tsx
'use client';

import { useSession, signOut } from "next-auth/react";
import styles from '../Home.module.css';
import { LogIn, LogOut } from "lucide-react"; 
import Image from "next/image";

type AuthButtonsProps = {
  // Hanya menerima satu prop untuk memicu pembukaan dialog di parent
  onLoginTrigger: () => void;
};

export default function AuthButtons({ onLoginTrigger }: AuthButtonsProps) {
    const { data: session, status } = useSession();

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

    // Tombol login sekarang hanya memanggil fungsi dari props, tanpa logika dialog
    return (
        <button onClick={onLoginTrigger} className={styles.authButton}>
            <LogIn size={16} />
            <span>Login</span>
        </button>
    );
}