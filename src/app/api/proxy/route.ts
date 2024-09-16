import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    })

    const headers = new Headers()
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers.append(key, value)
      }
    })

    // Remove headers that might cause issues
    headers.delete('x-frame-options')
    headers.delete('content-security-policy')

    return new NextResponse(response.data, {
      status: response.status,
      statusText: response.statusText,
      headers
    })
  } catch (error: any) {
    console.error('Proxy request failed:', error.message)
    return NextResponse.json({ error: `Proxy request failed: ${error.message}` }, { status: 500 })
  }
}