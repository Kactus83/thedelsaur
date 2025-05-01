<#
.SYNOPSIS
  Deploie backend + frontend sur App Runner, injecte .env.prod dans le même appel,
  et met à jour .env.prod avec leurs URL.
#>
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
Write-Host '== deploy-apprunner.ps1 ==' -ForegroundColor Cyan

# 0) Vérifier version AWS CLI (App Runner nécessite v2)
$cliVersion = (aws --version 2>&1)
if ($cliVersion -notmatch 'aws-cli\/2') {
    Write-Error "App Runner nécessite AWS CLI v2, trouve: $cliVersion"
    exit 1
}

# Récupération des variables de contexte
$root    = $PSScriptRoot
$envFile = Join-Path $root '.env.prod'
$account = aws sts get-caller-identity --query Account --output text
$region  = aws configure get region
$tag     = if ($env:TAG) { $env:TAG } else { 'latest' }

# === Nouvel ajout : lecture de .env.prod pour injection ===
$runtimeEnv = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -and -not $_.TrimStart().StartsWith('#') -and ($_ -match '^[A-Za-z0-9_]+=.*$')) {
        $parts = $_ -split '=',2
        $runtimeEnv[$parts[0].Trim()] = $parts[1].Trim()
    }
}
# Monte la chaîne "KEY1=Value1,KEY2=Value2,…"
$envPairs = (
    $runtimeEnv.GetEnumerator() |
    ForEach-Object { "$($_.Key)=$($_.Value)" }
) -join ','

# 0.1) ARN du rôle IAM qu’App Runner assumera pour accéder à ECR
$accessRoleArn = 'arn:aws:iam::645583760972:role/AppRunnerECRAccess'

function Invoke-AppRunnerService {
    param(
        [Parameter(Mandatory)][string] $Name,
        [Parameter(Mandatory)][int]    $Port
    )

    $fullName = "iddlesaur-$Name"
    $registry = "$account.dkr.ecr.$region.amazonaws.com"
    $imageRef = "${registry}/${fullName}:${tag}"

    Write-Host "`n[AppRunner] Deploy $fullName"

    # 1) Chercher l'ARN existant
    $arn = aws apprunner list-services `
        --query "ServiceSummaryList[?ServiceName=='$fullName'].ServiceArn|[0]" `
        --output text

    if ($arn -eq 'None' -or [string]::IsNullOrWhiteSpace($arn)) {
        # 2) Création du service (avec AuthConfig + env vars)
        $sourceConfig = "AuthenticationConfiguration={AccessRoleArn=$accessRoleArn},ImageRepository={ImageIdentifier=$imageRef,ImageRepositoryType=ECR,ImageConfiguration={Port=$Port,RuntimeEnvironmentVariables={$envPairs}}}"
        $arn = aws apprunner create-service `
            --service-name $fullName `
            --source-configuration $sourceConfig `
            --instance-configuration "Cpu=1024,Memory=2048" `
            --query "Service.ServiceArn" --output text

        if (-not $arn) {
            Write-Error "Échec création App Runner pour $fullName"
            exit 2
        }
    }
    else {
        # 3) Mise à jour du service (image + env vars)
        $sourceConfig = "ImageRepository={ImageIdentifier=$imageRef,ImageRepositoryType=ECR,ImageConfiguration={Port=$Port,RuntimeEnvironmentVariables={$envPairs}}}"
        aws apprunner update-service `
            --service-arn $arn `
            --source-configuration $sourceConfig `
            > $null 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Échec mise à jour App Runner pour $fullName"
            exit 3
        }
    }

    # 4) Attendre RUNNING ou FAIL, avec affichage clair
    $attempt = 0
    do {
        $status = aws apprunner describe-service --service-arn $arn --query "Service.Status" --output text
        $attempt++
        Write-Progress `
          -Activity "App Runner: $fullName" `
          -Status "Statut : $status (essai #$attempt)" `
          -PercentComplete ([Math]::Min($attempt * 5,100))

        if ($status -in @('CREATE_FAILED','UPDATE_FAILED')) {
            # En cas d’échec, récupérer la raison et sortir
            $reason = aws apprunner describe-service --service-arn $arn `
                       --query "Service.StatusReason" --output text
            Write-Error "❌ App Runner $fullName a échoué : $reason"
            exit 1
        }

        Start-Sleep 5
    } while ($status -ne 'RUNNING')

    # Supprimer la barre de progression
    Write-Progress -Activity "App Runner: $fullName" -Completed

    # 5) Récupérer l'URL publique
    $url = aws apprunner describe-service --service-arn $arn --query "Service.ServiceUrl" --output text

    # 6) MAJ .env.prod avec la nouvelle URL
    $pattern     = if ($Name -eq 'backend') { '^REACT_APP_API_URL' } else { '^FRONTEND_URL' }
    $replacement = if ($Name -eq 'backend') { "REACT_APP_API_URL=$url" } else { "FRONTEND_URL=$url" }
    (Get-Content $envFile) -replace $pattern, $replacement |
      Set-Content -Encoding UTF8 $envFile

    Write-Host "$fullName deployed -> $url"
}

# Déploiement des deux services
Invoke-AppRunnerService -Name 'backend'  -Port 3000
Invoke-AppRunnerService -Name 'frontend' -Port 80

# Affichage des URLs
Write-Host "`n[.env.prod] Services URLs :"
Select-String '^REACT_APP_API_URL|^FRONTEND_URL' $envFile |
  ForEach-Object { Write-Host "  $($_.Line)" }
