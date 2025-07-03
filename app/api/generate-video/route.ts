// app/api/generate-video/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Ambil semua data dari body request
    const {
      subject,
      action,
      mood,
      style,
      color,
      artisticStyle,
      timeAndWeather,
      filmEffects,
      camera,
      cameraMovement,
      lens,
      lighting,
      quality,
    } = await request.json();

    // Validasi input dasar
    if (!subject || !action) {
      return NextResponse.json({ error: 'Subject and Action are required' }, { status: 400 });
    }

    // Buat System Prompt (Peran AI) yang dinamis berdasarkan input pengguna
    // Ini adalah kunci untuk mengarahkan AI agar kreatif
    const systemPrompt = `You are a world-class cinematographer and film director. Your task is to take the user's structured ideas and expand them into a single, rich, detailed, and highly cinematic video prompt. Combine all the elements into a cohesive, comma-separated paragraph. Do not ask questions or explain yourself. Only output the final, enhanced prompt.

Here are the user's ideas to guide you:
-   **Core Idea**: A scene about '${subject}' who is '${action}'.
-   **Overall Mood**: The mood should be '${mood}'.
-   **Visual Style**: The visual style is '${style}'.
-   **Color Palette**: Emphasize a color palette of '${color}'.
-   **Artistic Influence**: Draw inspiration from '${artisticStyle}'.
-   **Environment**: The setting is characterized by '${timeAndWeather}' with '${lighting}'.
-   **Camera Work**: Use a '${camera}' shot with '${cameraMovement}', filmed on a '${lens}' lens.
-   **Final Polish**: Add effects like '${filmEffects}' and ensure the final quality is '${quality}'.

Based on this, generate a creative and descriptive prompt.`;

    // Prompt utama untuk AI hanya berisi instruksi untuk memulai
    const mainPrompt = "Based on the detailed system instructions, generate the cinematic prompt now.";

    const apiToken = process.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      console.error("Vercel Error: Environment variable POLLINATIONS_API_TOKEN not found.");
      return NextResponse.json({ error: 'Server configuration error: API token is missing.' }, { status: 500 });
    }

    // Menggunakan model default 'openai', bisa juga diganti jika perlu
    const params = new URLSearchParams({
      model: 'openai', 
      temperature: '0.8', // Sedikit lebih tinggi untuk kreativitas
      stream: 'true',
      system: systemPrompt,
    });

    const url = `https://text.pollinations.ai/${encodeURIComponent(mainPrompt)}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${apiToken}` },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Pollinations API Error: Status ${response.status} - Body: ${errorBody}`);
      return NextResponse.json({ error: `API Error: ${errorBody}` }, { status: response.status });
    }
    
    // Kirim response sebagai stream
    return new Response(response.body, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    console.error("Internal Server Error in generate-video:", error.message);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}