/**
 * Vercel Edge Function - IPTV Proxy CORS
 * Déploiement: vercel --prod
 */

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new Response(
      JSON.stringify({
        error: 'Missing url parameter',
        usage: '?url=http://your-iptv-server.com/...',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'User-Agent': 'XPENGMedia-Player/1.0',
        'Accept': 'application/json, text/plain, */*',
      },
    });

    const content = await response.text();

    // Try to parse as JSON
    let jsonContent;
    try {
      jsonContent = JSON.parse(content);
    } catch (e) {
      // If not JSON, return raw content
      return new Response(content, {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': response.headers.get('content-type') || 'text/plain',
        },
      });
    }

    return new Response(JSON.stringify(jsonContent), {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch from IPTV server',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
