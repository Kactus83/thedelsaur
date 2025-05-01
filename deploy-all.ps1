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

& "$PSScriptRoot\deploy-db.ps1"
& "$PSScriptRoot\deploy-images.ps1"
& "$PSScriptRoot\deploy-apprunner.ps1"

Write-Host "`n🎉 Déploiement COMPLET !" -ForegroundColor Green
exit 0
