// app/docs/page.tsx
import Layout from '../components/Layout';
import styles from '../page.module.css';

export default function DocsPage() {
  return (
    <Layout>
      <div className={styles.staticPageContainer}>
        <h1>Dokumentasi AI Studio+</h1>
        <p>Panduan untuk menggunakan berbagai fitur di platform kami.</p>

        <section>
          <h2>Creator Prompt Teks & Video</h2>
          <p>Fitur ini membantu Anda membuat prompt yang kaya dan deskriptif. Cukup masukkan ide dasar Anda, dan AI akan mengembangkannya menjadi prompt yang lebih baik untuk digunakan pada generator gambar atau video.</p>
        </section>

        <section>
          <h2>Generate Gambar</h2>
          <p>Ubah teks menjadi gambar. Anda dapat mengatur berbagai parameter seperti model AI, ukuran gambar, dan "seed" untuk mereproduksi hasil. Gambar yang Anda buat akan disimpan dalam riwayat sesi browser Anda untuk akses cepat.</p>
        </section>
        
        <section>
          <h2>Analisis Gambar</h2>
          <p>Unggah gambar, dan AI akan memberikan deskripsi teks tentang apa yang ada di dalam gambar tersebut. Ini berguna untuk memahami konten visual atau membuat deskripsi alternatif (alt text).</p>
        </section>
        
        <section>
          <h2>Text-to-Audio</h2>
          <p>Fitur ini mengubah teks yang Anda masukkan menjadi audio yang dapat didengar. Anda dapat memilih dari berbagai jenis suara untuk mempersonalisasi hasilnya. Audio yang dihasilkan dapat diputar langsung dan diunduh.</p>
        </section>
        
        <section>
          <h2>Tema Tampilan</h2>
          <p>Aplikasi ini mendukung mode terang dan gelap. Anda dapat memilih tema secara manual atau membiarkannya mengikuti pengaturan sistem operasi Anda untuk kenyamanan visual.</p>
        </section>
      </div>
    </Layout>
  );
}