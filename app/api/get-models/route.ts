// app/api/get-models/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiToken = process.env.POLLINATIONS_API_TOKEN;
    if (!apiToken) {
      console.error("Vercel Error: Environment variable POLLINATIONS_API_TOKEN not found.");
      return NextResponse.json({ error: 'Server configuration error: API token is missing.' }, { status: 500 });
    }

    const response = await fetch("https://text.pollinations.ai/models", {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Pollinations API Error: Status ${response.status} - Body: ${errorBody}`);
      throw new Error(`Failed to fetch models from Pollinations API. Status: ${response.status}`);
    }

    const modelsData = await response.json();
    
    // Logika filter yang lebih fleksibel, hanya berdasarkan status 'active'
    const activeModels = Object.entries(modelsData)
      .filter(([key, value]: [string, any]) => value.active === true)
      .map(([key, value]: [string, any]) => ({
        id: key,
        name: value.name || key,
      }));

    return NextResponse.json(activeModels);

  } catch (error: any) {
    console.error("Final Error in /api/get-models:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
