// app/api/analyze-image/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image, question, model = 'openai' } = await request.json();

    if (!image || !question) {
      return NextResponse.json({ error: 'Gambar dan pertanyaan harus diisi' }, { status: 400 });
    }

    const apiToken = process.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const payload = {
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: question },
            { type: 'image_url', image_url: { url: image } }
          ],
        },
      ],
      stream: true, // Kita gunakan stream untuk respons yang lebih cepat
    };

    const response = await fetch("https://text.pollinations.ai/openai", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        return NextResponse.json({ error: `API Error: ${errorBody}` }, { status: response.status });
    }

    return new Response(response.body, {
      headers: { 'Content-Type': 'text/event-stream' },
    });

  } catch (error: any) {
    console.error("Internal Server Error in analyze-image:", error.message);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}