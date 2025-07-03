// app/api/enhance-prompt/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // System prompt khusus untuk AI agar menghasilkan deskripsi gambar yang kaya
    const systemPrompt = `You are an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Your task is to take the user's simple input and expand it into a rich, detailed, and descriptive prompt. Do not ask questions or explain your process. Only output the final, enhanced prompt as a single paragraph of comma-separated keywords and phrases, ready to be used for image generation.`;

    const apiToken = process.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    // Kita gunakan model teks 'openai' untuk tugas ini
    const params = new URLSearchParams({
      model: 'openai',
      temperature: '0.7',
      system: systemPrompt,
      stream: 'true', // Kita tetap gunakan stream agar UI terasa responsif
    });

    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${apiToken}` },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json({ error: `API Error: ${errorBody}` }, { status: response.status });
    }
    
    return new Response(response.body, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}