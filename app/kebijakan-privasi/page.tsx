// app/kebijakan-privasi/page.tsx
import Layout from '../components/Layout';
import styles from '../page.module.css';

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className={styles.staticPageContainer}>
        <h1>Kebijakan Privasi</h1>
        <p>Terakhir diperbarui: 5 Juli 2025</p>
        
        <section>
          <h2>Pendahuluan</h2>
          <p>Selamat datang di AI Studio+. Kami menghargai privasi Anda dan berkomitmen untuk melindunginya. Kebijakan Privasi ini menjelaskan jenis informasi yang kami kumpulkan dari Anda atau yang Anda berikan saat mengunjungi situs web kami dan praktik kami untuk mengumpulkan, menggunakan, memelihara, melindungi, dan mengungkap informasi tersebut.</p>
        </section>

        <section>
          <h2>Informasi yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan beberapa jenis informasi, termasuk:</p>
          <ul>
            <li><strong>Informasi yang Anda Berikan:</strong> Ini termasuk teks prompt, gambar yang diunggah, dan pilihan pengaturan yang Anda masukkan saat menggunakan alat kami.</li>
            <li><strong>Informasi Login:</strong> Jika Anda memilih untuk login, kami menggunakan NextAuth untuk mengelola sesi Anda. Kami hanya menyimpan informasi dasar yang diperlukan untuk otentikasi.</li>
            <li><strong>Informasi Penggunaan:</strong> Kami dapat mengumpulkan data anonim tentang interaksi Anda dengan situs, seperti tab mana yang paling sering digunakan, untuk meningkatkan layanan kami.</li>
          </ul>
        </section>

        <section>
          <h2>Bagaimana Kami Menggunakan Informasi Anda</h2>
          <p>Kami menggunakan informasi yang kami kumpulkan untuk:</p>
          <ul>
            <li>Menyediakan, mengoperasikan, dan memelihara layanan kami.</li>
            <li>Memproses permintaan Anda dan mengirimkan hasilnya kepada Anda.</li>
            <li>Meningkatkan, mempersonalisasi, dan memperluas layanan kami.</li>
            <li>Memahami dan menganalisis bagaimana Anda menggunakan layanan kami.</li>
          </ul>
        </section>
        
        <section>
          <h2>Pihak Ketiga</h2>
          <p>Layanan kami berinteraksi dengan API pihak ketiga (seperti Pollinations.ai) untuk memproses permintaan AI Anda. Kami mengirimkan prompt Anda ke layanan ini, tetapi kami tidak membagikan informasi pribadi Anda yang dapat diidentifikasi. Harap tinjau kebijakan privasi mereka untuk memahami bagaimana mereka menangani data.</p>
        </section>

        <section>
          <h2>Keamanan Data</h2>
          <p>Kami telah menerapkan langkah-langkah yang dirancang untuk mengamankan informasi Anda dari kehilangan yang tidak disengaja dan dari akses, penggunaan, perubahan, dan pengungkapan yang tidak sah. Namun, transmisi informasi melalui internet tidak sepenuhnya aman.</p>
        </section>
      </div>
    </Layout>
  );
}