// app/components/AuthButtons.tsx
'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import styles from '../Home.module.css';
import { LogIn, LogOut } from "lucide-react";
import Image from "next/image";

export default function AuthButtons() {
    const { data: session, status } = useSession();

        if (status === "loading") {
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

                                                                                                                                                                                                                                                                                                                                                return (
                                                                                                                                                                                                                                                                                                                                                        <button onClick={() => signIn('google')} className={styles.authButton}>
                                                                                                                                                                                                                                                                                                                                                                    <LogIn size={16} />
                                                                                                                                                                                                                                                                                                                                                                                Sign In
                                                                                                                                                                                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                                                                                            }