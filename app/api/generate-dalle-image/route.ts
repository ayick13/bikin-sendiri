// app/api/generate-dalle-image/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey, size = '1024x1024' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API Key is required' }, { status: 400 });
    }

    const payload = {
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size,
      response_format: "b64_json", // Minta gambar dalam format base64
    };

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Menggunakan kunci API dari pengguna
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage = errorBody.error?.message || 'Gagal menghasilkan gambar dari OpenAI.';
        console.error("OpenAI API Error:", errorMessage);
        return NextResponse.json({ error: `OpenAI Error: ${errorMessage}` }, { status: response.status });
    }

    const data = await response.json();
    
    // Kirim kembali data gambar base64 ke client
    return NextResponse.json({ b64_json: data.data[0].b64_json });

  } catch (error: any) {
    console.error("Internal Server Error in generate-dalle-image:", error.message);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}