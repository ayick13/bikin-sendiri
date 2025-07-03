// app/api/generate-text/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Ambil semua parameter baru dari body request
    const { prompt, model, temperature, system, seed, top_p, frequency_penalty } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiToken = process.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      console.error("Vercel Error: Environment variable POLLINATIONS_API_TOKEN not found.");
      return NextResponse.json({ error: 'Server configuration error: API token is missing.' }, { status: 500 });
    }

    // Bangun parameter URL dengan lebih dinamis
    const params = new URLSearchParams({
      model: model || 'openai',
      temperature: temperature?.toString() || '0.7',
      stream: 'true',
    });

    // Tambahkan parameter hanya jika ada nilainya
    if (system) params.append('system', system);
    if (seed) params.append('seed', seed.toString());
    if (top_p) params.append('top_p', top_p.toString());
    if (frequency_penalty) params.append('frequency_penalty', frequency_penalty.toString());

    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${apiToken}` },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Pollinations API Error: Status ${response.status} - Body: ${errorBody}`);
      return NextResponse.json({ error: `API Error: ${errorBody}` }, { status: response.status });
    }
    
    return new Response(response.body, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    console.error("Internal Server Error:", error.message);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
