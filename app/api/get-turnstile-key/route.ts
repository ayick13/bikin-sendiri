// app/api/get-turnstile-key/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const siteKey = process.env.TURNSTILE_SITE_KEY;

  if (!siteKey) {
    console.error('Environment variable TURNSTILE_SITE_KEY belum diatur.');
    return NextResponse.json({ error: 'Konfigurasi server bermasalah.' }, { status: 500 });
  }

  return NextResponse.json({ siteKey });
}