// app/api/generate-text/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, temperature } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiToken = process.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      console.error("API Token not found on Vercel");
      return NextResponse.json({ error: 'Server configuration error: API token is missing.' }, { status: 500 });
    }

    const params = new URLSearchParams({
      model: model || 'openai',
      temperature: temperature || '0.7',
      stream: 'true',
    });
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${apiToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pollinations API Error:", errorText);
      return NextResponse.json({ error: `API Error: ${errorText}` }, { status: response.status });
    }

    // --- PERUBAHAN UTAMA DI SINI ---
    // Kita tidak perlu fungsi helper. Langsung kembalikan body dari respons Pollinations.
    // Server modern (seperti Vercel) akan secara otomatis menyalurkan (stream) ini ke frontend.
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error: any) {
    console.error("Internal Server Error:", error.message);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}