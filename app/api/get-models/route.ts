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
    
    // Kita asumsikan data yang relevan ada di dalam 'openai-like' dan kita filter yang aktif
    const activeModels = modelsData['openai-like']?.filter((m: any) => m.active) || [];

    return NextResponse.json(activeModels);

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}