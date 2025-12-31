/**
 * Netlify Function - IPTV Proxy CORS
 * Déploiement: netlify deploy --prod
 */

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const targetUrl = event.queryStringParameters.url;

  if (!targetUrl) {
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Missing url parameter',
        usage: '?url=http://your-iptv-server.com/...',
      }),
    };
  }

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
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
      return {
        statusCode: response.status,
        headers: {
          ...headers,
          'Content-Type': response.headers.get('content-type') || 'text/plain',
        },
        body: content,
      };
    }

    return {
      statusCode: response.status,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
      body: JSON.stringify(jsonContent),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to fetch from IPTV server',
        message: error.message,
      }),
    };
  }
};
