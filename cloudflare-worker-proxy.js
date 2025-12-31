/**
 * Cloudflare Worker - IPTV Proxy CORS
 * Permet aux navigateurs web d'accéder aux serveurs IPTV HTTP depuis une page HTTPS
 */

export default {
  async fetch(request, env, ctx) {
    // Autoriser uniquement les requêtes depuis ton domaine
    const allowedOrigins = [
      'https://dlnraja.github.io',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    const origin = request.headers.get('Origin');
    
    // Gérer les requêtes OPTIONS (preflight CORS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
    
    // Récupérer l'URL cible depuis le paramètre
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    
    if (!targetUrl) {
      return new Response(JSON.stringify({ 
        error: 'Missing url parameter',
        usage: '?url=http://your-iptv-server.com/player_api.php?...'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*'
        }
      });
    }
    
    try {
      // Faire la requête vers le serveur IPTV
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'User-Agent': 'XPENGMedia-Player/1.0',
          'Accept': 'application/json'
        }
      });
      
      // Récupérer le contenu
      const content = await response.text();
      
      // Vérifier si c'est du JSON valide
      let jsonContent;
      try {
        jsonContent = JSON.parse(content);
      } catch (e) {
        return new Response(JSON.stringify({
          error: 'Invalid JSON response from IPTV server',
          content: content.substring(0, 500)
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin || '*'
          }
        });
      }
      
      // Retourner la réponse avec headers CORS
      return new Response(JSON.stringify(jsonContent), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Cache-Control': 'public, max-age=300' // Cache 5 minutes
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Failed to fetch from IPTV server',
        message: error.message,
        target: targetUrl
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*'
        }
      });
    }
  }
};
