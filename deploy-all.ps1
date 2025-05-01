<#
.SYNOPSIS
  Orchestrateur : db → images → env → apprunner
#>
[CmdletBinding()] param()
$ErrorActionPreference = 'Stop'
Write-Host "=== Lancement deploy-all.ps1 ===" -ForegroundColor Cyan

# ←–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# Génère un tag unique (timestamp) et le passe aux sous-scripts
$tag = Get-Date -Format 'yyyyMMddHHmmss'
$env:TAG = $tag
Write-Host "🕒 Utilisation du tag : $tag" -ForegroundColor Cyan
# ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– →

# 1) Provisionnement DB
& "$PSScriptRoot\deploy-db.ps1"

# 2) Optionnel : nettoyage Docker complet
$ansClean = Read-Host -Prompt 'Voulez-vous nettoyer Docker (conteneurs, images, volumes, réseaux, cache) ? (O/n)'
if ($ansClean -match '^[Oo]') {
    Write-Host "🧹 Nettoyage Docker en cours…" -ForegroundColor Yellow
    docker container prune -f
    docker image prune -a -f
    docker volume prune -f
    docker network prune -f
    docker builder prune -af
    Write-Host "✅ Docker nettoyé." -ForegroundColor Green
} else {
    Write-Host "⏭️  Nettoyage Docker SKIPPÉ." -ForegroundColor Cyan
}

# 3) Build & Push Images
& "$PSScriptRoot\deploy-images.ps1"

# 4) Inject Env & Déploiement App Runner
& "$PSScriptRoot\deploy-apprunner.ps1"

Write-Host "`n🎉 Déploiement COMPLET !" -ForegroundColor Green
exit 0
