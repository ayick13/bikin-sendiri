// app/kontak/page.tsx
'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../Home.module.css';
import pageStyles from '../page.module.css';
import { Mail, Send, LoaderCircle, CheckCircle, TriangleAlert } from 'lucide-react';

export default function KontakPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setFeedbackMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFeedbackMessage(data.message);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setFeedbackMessage(data.error || 'Terjadi kesalahan.');
      }
    } catch (err) {
      setStatus('error');
      setFeedbackMessage('Gagal terhubung ke server.');
    }
  };

  return (
    <Layout>
      <div className={pageStyles.staticPageContainer}>
        <h1>Hubungi Kami</h1>
        <p>Punya pertanyaan, masukan, atau ide untuk kolaborasi? Isi formulir di bawah ini dan kami akan segera menghubungi Anda kembali.</p>
        
        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Nama Lengkap</label>
            <input 
              type="text" 
              id="name" 
              className={styles.input} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Alamat Email</label>
            <input 
              type="email" 
              id="email" 
              className={styles.input} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>Pesan Anda</label>
            <textarea 
              id="message" 
              rows={6} 
              className={styles.textarea} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className={styles.button} disabled={status === 'loading'}>
            {status === 'loading' ? <LoaderCircle size={22} className={styles.loadingIcon} /> : <Send size={22} />}
            <span>{status === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}</span>
          </button>

          {feedbackMessage && (
            <div className={`${styles.feedbackBox} ${status === 'success' ? styles.successBox : styles.errorBox}`}>
              {status === 'success' ? <CheckCircle size={20} /> : <TriangleAlert size={20} />}
              {feedbackMessage}
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
}