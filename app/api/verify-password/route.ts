// app/api/verify-password/route.ts
import { NextRequest, NextResponse } from 'next/server';

const attempts = new Map<string, { count: number, expiry: number }>();
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

async function verifyTurnstile(token: string, ip: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error('Environment variable TURNSTILE_SECRET_KEY belum diatur.');
    return { success: false, message: 'Konfigurasi server salah.' };
  }
  
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: secretKey,
      response: token,
      remoteip: ip,
    }),
  });
  return response.json();
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  
  try {
    const { password, turnstileToken } = await request.json();

    if (typeof password !== 'string' || typeof turnstileToken !== 'string') {
      return NextResponse.json({ success: false, message: 'Format permintaan tidak valid' }, { status: 400 });
    }

    const now = Date.now();
    let attempt = attempts.get(ip);

    if (!attempt) {
      attempt = { count: 0, expiry: 0 };
      attempts.set(ip, attempt);
    }
    
    if (attempt.expiry > now) {
      const timeLeft = Math.ceil((attempt.expiry - now) / 1000);
      return NextResponse.json(
        { success: false, message: `Terlalu banyak percobaan. Coba lagi dalam ${timeLeft} detik.` },
        { status: 429 }
      );
    }

    const turnstileResponse = await verifyTurnstile(turnstileToken, ip);
    if (!turnstileResponse.success) {
      return NextResponse.json({ success: false, message: 'Verifikasi keamanan gagal.' }, { status: 403 });
    }
    
    const correctPassword = process.env.EKURSUS_PASSWORD;
    if (!correctPassword) {
      console.error('Environment variable EKURSUS_PASSWORD tidak ditemukan!');
      return NextResponse.json({ error: 'Konfigurasi server bermasalah.' }, { status: 500 });
    }

    const isMatch = password === correctPassword;

    if (isMatch) {
      attempts.delete(ip);
      return NextResponse.json({ success: true });
    } else {
      attempt.count++;
      if (attempt.count >= RATE_LIMIT_COUNT) {
        attempt.expiry = now + RATE_LIMIT_WINDOW_MS;
      }
      attempts.set(ip, attempt);
      return NextResponse.json({ success: false, message: 'Password salah' }, { status: 401 });
    }

  } catch (error) {
    console.error("Error in verify-password API:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal.' }, { status: 500 });
  }
}