// app/api/generate-audio/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, voice } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    if (!voice) {
        return NextResponse.json({ error: 'Voice is required' }, { status: 400 });
    }

    const apiToken = process.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      console.error("Vercel Error: Environment variable POLLINATIONS_API_TOKEN not found.");
      return NextResponse.json({ error: 'Server configuration error: API token is missing.' }, { status: 500 });
    }
    
    const payload = {
      model: "openai-audio",
      modalities: ["text", "audio"], 
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      audio: { 
        voice: voice,
        format: "mp3" // FIX: Menambahkan parameter format audio yang wajib
      },
      private: true
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
      console.error(`Pollinations API Error: Status ${response.status} - Body: ${errorBody}`);
      try {
        const errorJson = JSON.parse(errorBody);
        const detailedMessage = errorJson.details?.error?.message || errorJson.error || 'Unknown API Error';
        return NextResponse.json({ error: detailedMessage }, { status: response.status });
      } catch {
        return NextResponse.json({ error: errorBody }, { status: response.status });
      }
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Internal Server Error in generate-audio:", error.message);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}