import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return NextResponse.json({ error: 'GOOGLE_AI_API_KEY is not set' }, { status: 500 })
  }

  const { query } = await request.json()
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ answer: text })
  } catch (error: any) {
    console.error('AI request failed:', error.message)
    return NextResponse.json({ error: `AI request failed: ${error.message}` }, { status: 500 })
  }
}