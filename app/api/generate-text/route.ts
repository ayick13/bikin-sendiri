// app/api/generate-text/route.ts

import { NextRequest } from 'next/server';

// Fungsi untuk mengubah stream dari API Pollinations menjadi stream yang bisa dibaca client
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // 1. Ambil prompt dan parameter baru dari request body
    const { prompt, model, temperature } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    // 2. Ambil token API dari Vercel Environment Variables
    const apiToken = process.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      return new Response(JSON.stringify({ error: 'API token is not configured' }), { status: 500 });
    }

    // 3. Bangun URL dengan parameter baru
    const encodedPrompt = encodeURIComponent(prompt);
    const params = new URLSearchParams({
      model: model || 'openai', // Default ke openai jika tidak dispesifikasikan
      temperature: temperature || '0.7', // Default temperature
      stream: 'true', // Aktifkan streaming
    });
    const url = `https://text.pollinations.ai/${encodedPrompt}?${params.toString()}`;

    // 4. Siapkan header otentikasi
    const headers = {
      'Authorization': `Bearer ${apiToken}`,
    };

    // 5. Panggil API Pollinations dan dapatkan respons sebagai stream
    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `Pollinations API Error: ${errorText}` }), { status: response.status });
    }

    // 6. Alirkan (stream) respons langsung kembali ke client
    const stream = iteratorToStream(response.body!.getReader());

    return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An internal server error occurred' }), { status: 500 });
  }
}