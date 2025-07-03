// app/api/generate-text/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Ambil prompt dari request body yang dikirim oleh frontend
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 2. Ambil token API dari Vercel Environment Variables (aman)
    const apiToken = process.env.POLLINATIONS_API_TOKEN;

    if (!apiToken) {
        return NextResponse.json({ error: 'API token is not configured' }, { status: 500 });
    }

    // 3. Encode prompt agar aman untuk URL dan siapkan URL Pollinations
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://text.pollinations.ai/${encodedPrompt}`;

    // 4. Siapkan header untuk otentikasi
    // Sesuai dokumentasi, metode Header adalah yang direkomendasikan
    const headers = {
      'Authorization': `Bearer ${apiToken}`
    };

    // 5. Panggil API Pollinations dari backend Anda
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      // Jika ada error dari API Pollinations, teruskan pesannya
      const errorText = await response.text();
      return NextResponse.json({ error: `Pollinations API Error: ${errorText}` }, { status: response.status });
    }

    // 6. Dapatkan hasil teks dan kirim kembali ke frontend
    const textResult = await response.text();
    return NextResponse.json({ result: textResult });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}