import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function handler(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')?.value

  const backendPath = pathname; // No longer stripping /api

  const url = new URL(backendPath, API_BASE_URL);
  url.search = search;

  const headers = new Headers(req.headers);
  headers.delete('host');
  
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  try {
    const response = await fetch(url.href, {
      method: req.method,
      headers,
      body: req.body,
      // @ts-expect-error
      duplex: 'half',
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');
    
    // Allow all origins for local development
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (response.status === 204) {
      return new NextResponse(null, { status: 204, headers: responseHeaders });
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await response.json().catch(() => null);
       if (body === null) {
        return new NextResponse('', { status: response.status, headers: responseHeaders });
      }
      return NextResponse.json(body, {
        status: response.status,
        headers: responseHeaders,
      });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'API proxy failed' },
      { status: 502 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
