// app/api/get-models/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiToken = process.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json({ error: 'API token is not configured' }, { status: 500 });
    }

    const response = await fetch("https://text.pollinations.ai/models", {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models from Pollinations API');
    }

    const modelsData = await response.json();
    
    // --- LOGIKA BARU YANG SUDAH DIPERBAIKI ---
    // API mengembalikan objek, bukan array. Kita ubah objek tersebut menjadi array.
    const activeModels = Object.entries(modelsData)
      // value adalah objek detail model, key adalah ID model
      .filter(([key, value]: [string, any]) => 
        // Filter hanya model yang aktif dan bukan model untuk audio
        value.active === true && value.type === 'openai-like'
      )
      .map(([key, value]: [string, any]) => ({
        id: key,                  // Gunakan key objek sebagai ID (misal: "openai")
        name: value.name || key,  // Gunakan nama dari data, atau ID jika nama tidak ada
      }));

    return NextResponse.json(activeModels);

  } catch (error: any) {
    console.error("Error fetching models:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
