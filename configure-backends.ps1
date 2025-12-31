# Script de configuration automatique des backends IPTV
# Usage: .\configure-backends.ps1

Write-Host "`n🚀 CONFIGURATION AUTOMATIQUE DES BACKENDS IPTV`n" -ForegroundColor Cyan

# Fonction pour valider une URL
function Test-BackendUrl {
    param([string]$url, [string]$backendName)
    
    if ([string]::IsNullOrWhiteSpace($url)) {
        return $false
    }
    
    Write-Host "🔍 Test de $backendName : $url" -ForegroundColor Yellow
    
    try {
        $testUrl = if ($backendName -eq "Cloudflare") {
            "$url`?url=https://httpbin.org/get"
        } elseif ($backendName -eq "Vercel") {
            "$url`?url=https://httpbin.org/get"
        } elseif ($backendName -eq "Netlify") {
            "$url`?url=https://httpbin.org/get"
        } else {
            $url
        }
        
        $response = Invoke-WebRequest -Uri $testUrl -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $backendName fonctionne !" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ $backendName ne répond pas : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    
    return $false
}

# Demander les URLs
Write-Host "📝 Entre tes URLs de backends déployés (laisse vide pour ignorer)" -ForegroundColor Cyan
Write-Host ""

# Cloudflare
Write-Host "🟦 CLOUDFLARE WORKER" -ForegroundColor Blue
Write-Host "   Exemple: https://xpengmedia-iptv-proxy.abc123.workers.dev" -ForegroundColor Gray
$cloudflareUrl = Read-Host "   URL Cloudflare (ou Enter pour ignorer)"
$cloudflareValid = $false
if (![string]::IsNullOrWhiteSpace($cloudflareUrl)) {
    $cloudflareValid = Test-BackendUrl -url $cloudflareUrl -backendName "Cloudflare"
}

Write-Host ""

# Vercel
Write-Host "🟩 VERCEL EDGE" -ForegroundColor Green
Write-Host "   Exemple: https://xpengmedia-abc123.vercel.app/api/proxy" -ForegroundColor Gray
Write-Host "   ⚠️ N'oublie pas d'ajouter /api/proxy à la fin !" -ForegroundColor Yellow
$vercelUrl = Read-Host "   URL Vercel (ou Enter pour ignorer)"
$vercelValid = $false
if (![string]::IsNullOrWhiteSpace($vercelUrl)) {
    # Ajouter /api/proxy si manquant
    if (-not $vercelUrl.EndsWith("/api/proxy")) {
        Write-Host "   ℹ️ Ajout automatique de /api/proxy" -ForegroundColor Yellow
        $vercelUrl = $vercelUrl.TrimEnd('/') + "/api/proxy"
    }
    $vercelValid = Test-BackendUrl -url $vercelUrl -backendName "Vercel"
}

Write-Host ""

# Netlify
Write-Host "🟧 NETLIFY FUNCTIONS" -ForegroundColor DarkYellow
Write-Host "   Exemple: https://xpengmedia.netlify.app/.netlify/functions/proxy" -ForegroundColor Gray
Write-Host "   ⚠️ N'oublie pas d'ajouter /.netlify/functions/proxy à la fin !" -ForegroundColor Yellow
$netlifyUrl = Read-Host "   URL Netlify (ou Enter pour ignorer)"
$netlifyValid = $false
if (![string]::IsNullOrWhiteSpace($netlifyUrl)) {
    # Ajouter /.netlify/functions/proxy si manquant
    if (-not $netlifyUrl.EndsWith("/.netlify/functions/proxy")) {
        Write-Host "   ℹ️ Ajout automatique de /.netlify/functions/proxy" -ForegroundColor Yellow
        $netlifyUrl = $netlifyUrl.TrimEnd('/') + "/.netlify/functions/proxy"
    }
    $netlifyValid = Test-BackendUrl -url $netlifyUrl -backendName "Netlify"
}

Write-Host ""

# Vérifier si au moins un backend est configuré
if (-not $cloudflareValid -and -not $vercelValid -and -not $netlifyValid) {
    Write-Host "⚠️ Aucun backend valide configuré." -ForegroundColor Yellow
    Write-Host "   Le player utilisera les proxies publics uniquement." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continuer quand même ? (o/n)"
    if ($continue -ne "o" -and $continue -ne "O") {
        Write-Host "❌ Configuration annulée." -ForegroundColor Red
        exit
    }
}

# Résumé
Write-Host "`n📊 RÉSUMÉ DE LA CONFIGURATION" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
if ($cloudflareValid) {
    Write-Host "✅ Cloudflare Worker : $cloudflareUrl" -ForegroundColor Green
} else {
    Write-Host "⭕ Cloudflare Worker : Non configuré" -ForegroundColor Gray
}
if ($vercelValid) {
    Write-Host "✅ Vercel Edge       : $vercelUrl" -ForegroundColor Green
} else {
    Write-Host "⭕ Vercel Edge       : Non configuré" -ForegroundColor Gray
}
if ($netlifyValid) {
    Write-Host "✅ Netlify Functions : $netlifyUrl" -ForegroundColor Green
} else {
    Write-Host "⭕ Netlify Functions : Non configuré" -ForegroundColor Gray
}
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host ""
$confirm = Read-Host "Confirmer et appliquer la configuration ? (o/n)"
if ($confirm -ne "o" -and $confirm -ne "O") {
    Write-Host "❌ Configuration annulée." -ForegroundColor Red
    exit
}

# Lire le fichier
Write-Host "`n🔧 Configuration du player..." -ForegroundColor Cyan
$playerPath = "public\iptv-player.html"
$content = Get-Content $playerPath -Raw -Encoding UTF8

# Remplacer les URLs
$cloudflareValue = if ($cloudflareValid) { "'$cloudflareUrl'" } else { "null" }
$vercelValue = if ($vercelValid) { "'$vercelUrl'" } else { "null" }
$netlifyValue = if ($netlifyValid) { "'$netlifyUrl'" } else { "null" }

# Pattern pour Cloudflare
$content = $content -replace "const CLOUDFLARE_PROXY = null;.*", "const CLOUDFLARE_PROXY = $cloudflareValue;  // Configuré automatiquement"

# Pattern pour Vercel
$content = $content -replace "const VERCEL_PROXY = null;.*", "const VERCEL_PROXY = $vercelValue;      // Configuré automatiquement"

# Pattern pour Netlify
$content = $content -replace "const NETLIFY_PROXY = null;.*", "const NETLIFY_PROXY = $netlifyValue;     // Configuré automatiquement"

# Sauvegarder
Set-Content $playerPath -Value $content -Encoding UTF8 -NoNewline

Write-Host "✅ Fichier $playerPath mis à jour !" -ForegroundColor Green

# Git commit et push
Write-Host "`n📦 Commit et push des modifications..." -ForegroundColor Cyan
git add $playerPath

$commitMsg = "Configure backends: "
$backends = @()
if ($cloudflareValid) { $backends += "Cloudflare" }
if ($vercelValid) { $backends += "Vercel" }
if ($netlifyValid) { $backends += "Netlify" }

if ($backends.Count -gt 0) {
    $commitMsg += $backends -join ", "
} else {
    $commitMsg += "No backends (public proxies only)"
}

git commit -m $commitMsg

Write-Host "🚀 Push vers GitHub..." -ForegroundColor Cyan
git push

# Déployer
Write-Host "`n🌐 Déploiement sur GitHub Pages..." -ForegroundColor Cyan
npm run deploy

Write-Host "`n✨ CONFIGURATION TERMINÉE !" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🎉 Ton player IPTV est maintenant configuré !" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 URL de test:" -ForegroundColor Yellow
Write-Host "   https://dlnraja.github.io/xpengmedia/iptv-player.html?debug=1" -ForegroundColor White
Write-Host ""
Write-Host "📊 Backends configurés:" -ForegroundColor Yellow
if ($cloudflareValid) {
    Write-Host "   ✅ Cloudflare Worker (priorité 1)" -ForegroundColor Green
}
if ($vercelValid) {
    Write-Host "   ✅ Vercel Edge (priorité 2)" -ForegroundColor Green
}
if ($netlifyValid) {
    Write-Host "   ✅ Netlify Functions (priorité 3)" -ForegroundColor Green
}
if (-not $cloudflareValid -and -not $vercelValid -and -not $netlifyValid) {
    Write-Host "   ⭕ Proxies publics uniquement (5 proxies)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "🎬 Teste maintenant sur ta XPENG !" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
