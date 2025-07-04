// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validasi input dasar
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Semua kolom harus diisi.' }, { status: 400 });
    }

    // Konfigurasi transporter Nodemailer menggunakan App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Email Anda dari .env.local
        pass: process.env.GMAIL_APP_PASSWORD, // App Password Anda dari .env.local
      },
    });

    // Opsi email yang akan dikirim
    const mailOptions = {
      from: `"${name}" <${process.env.GMAIL_USER}>`, // Alamat email Anda
      to: process.env.GMAIL_USER, // Kirim ke alamat email Anda sendiri
      replyTo: email, // Set 'reply-to' agar Anda bisa langsung membalas ke email pengirim
      subject: `Pesan Baru dari Formulir Kontak: ${name}`,
      html: `
        <h2>Pesan Baru dari AI Studio+</h2>
        <p><strong>Nama Pengirim:</strong> ${name}</p>
        <p><strong>Email Pengirim:</strong> ${email}</p>
        <hr>
        <h3>Pesan:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Kirim email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Pesan berhasil terkirim!' });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Gagal mengirim pesan.' }, { status: 500 });
  }
}