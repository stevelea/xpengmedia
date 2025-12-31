# Script de déploiement automatique des backends IPTV
# Usage: .\deploy-backend.ps1 [cloudflare|vercel|netlify]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('cloudflare','vercel','netlify','all')]
    [string]$Backend
)

Write-Host "🚀 Déploiement du backend IPTV: $Backend" -ForegroundColor Cyan

function Deploy-Cloudflare {
    Write-Host "`n🟦 Déploiement Cloudflare Workers..." -ForegroundColor Blue
    
    if (!(Get-Command wrangler -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Wrangler n'est pas installé. Installation..." -ForegroundColor Yellow
        npm install -g wrangler
    }
    
    Write-Host "📦 Connexion à Cloudflare..." -ForegroundColor Cyan
    wrangler login
    
    Write-Host "🚀 Déploiement..." -ForegroundColor Cyan
    wrangler deploy
    
    Write-Host "✅ Cloudflare Worker déployé !" -ForegroundColor Green
    Write-Host "➡️  URL: https://xpengmedia-iptv-proxy.VOTRE-ID.workers.dev" -ForegroundColor Yellow
}

function Deploy-Vercel {
    Write-Host "`n🟩 Déploiement Vercel Edge Functions..." -ForegroundColor Green
    
    # Créer le dossier api si nécessaire
    if (!(Test-Path "api")) {
        New-Item -ItemType Directory -Path "api" | Out-Null
    }
    
    # Copier le fichier
    if (Test-Path "vercel-proxy.js") {
        Copy-Item "vercel-proxy.js" "api\proxy.js" -Force
        Write-Host "✅ Fichier proxy.js créé dans api/" -ForegroundColor Green
    }
    
    if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Vercel CLI n'est pas installé. Installation..." -ForegroundColor Yellow
        npm install -g vercel
    }
    
    Write-Host "📦 Connexion à Vercel..." -ForegroundColor Cyan
    vercel login
    
    Write-Host "🚀 Déploiement..." -ForegroundColor Cyan
    vercel --prod
    
    Write-Host "✅ Vercel Edge déployé !" -ForegroundColor Green
    Write-Host "➡️  URL: https://xpengmedia-VOTRE-ID.vercel.app/api/proxy" -ForegroundColor Yellow
}

function Deploy-Netlify {
    Write-Host "`n🟧 Déploiement Netlify Functions..." -ForegroundColor DarkYellow
    
    # Installer les dépendances
    if (Test-Path "netlify\functions") {
        Push-Location "netlify\functions"
        
        if (!(Test-Path "node_modules")) {
            Write-Host "📦 Installation des dépendances..." -ForegroundColor Cyan
            npm install
        }
        
        Pop-Location
    }
    
    if (!(Get-Command netlify -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Netlify CLI n'est pas installé. Installation..." -ForegroundColor Yellow
        npm install -g netlify-cli
    }
    
    Write-Host "📦 Connexion à Netlify..." -ForegroundColor Cyan
    netlify login
    
    Write-Host "🚀 Déploiement..." -ForegroundColor Cyan
    netlify deploy --prod
    
    Write-Host "✅ Netlify Functions déployé !" -ForegroundColor Green
    Write-Host "➡️  URL: https://xpengmedia.netlify.app/.netlify/functions/proxy" -ForegroundColor Yellow
}

# Déploiement selon le choix
switch ($Backend) {
    "cloudflare" {
        Deploy-Cloudflare
    }
    "vercel" {
        Deploy-Vercel
    }
    "netlify" {
        Deploy-Netlify
    }
    "all" {
        Write-Host "🔥 Déploiement de TOUS les backends..." -ForegroundColor Magenta
        Deploy-Cloudflare
        Deploy-Vercel
        Deploy-Netlify
    }
}

Write-Host "`n✨ Déploiement terminé !" -ForegroundColor Green
Write-Host "`n📝 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Copie l'URL de ton proxy" -ForegroundColor White
Write-Host "2. Colle-la dans public/iptv-player.html ligne ~852:" -ForegroundColor White
Write-Host "   const CLOUDFLARE_PROXY = 'https://TON-URL';" -ForegroundColor Yellow
Write-Host "3. Déploie le player:" -ForegroundColor White
Write-Host "   git add . && git commit -m 'Add backend proxy' && git push && npm run deploy" -ForegroundColor Yellow
