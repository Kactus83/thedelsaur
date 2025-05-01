<#
.SYNOPSIS
  Injecte les variables d’environnement du .env dans le service App Runner `iddlesaur-backend`
  et attend la fin de l’opération.
#>
[CmdletBinding()] param()
$ErrorActionPreference = 'Stop'
Write-Host "== deploy-env.ps1 : injection des env vars ==" -ForegroundColor Cyan

# 1) Charge le .env
$envFile = Join-Path $PSScriptRoot '.env.prod'
if (-not (Test-Path $envFile)) {
    Write-Error ".env introuvable dans $PSScriptRoot"
    exit 1
}
$runtimeEnv = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][A-Za-z0-9_]+)\s*=\s*(.*)$') {
        $runtimeEnv[$matches[1]] = $matches[2]
    }
}

# 2) Récupère l'ARN et la config actuelle du service
$serviceName = 'iddlesaur-backend'
$serviceArn = aws apprunner list-services `
  --query "ServiceSummaryList[?ServiceName=='$serviceName'].ServiceArn | [0]" `
  --output text

if (-not $serviceArn) {
    Write-Error "Service '$serviceName' introuvable"
    exit 1
}

$svcDesc = aws apprunner describe-service `
  --service-arn $serviceArn --output json | ConvertFrom-Json

$srcCfg   = $svcDesc.Service.SourceConfiguration
$imageCfg = $srcCfg.ImageRepository.ImageConfiguration
$imageRepoType = $srcCfg.ImageRepository.ImageRepositoryType
$imageId  = $srcCfg.ImageRepository.ImageIdentifier
$accessRoleArn = $srcCfg.AuthenticationConfiguration.AccessRoleArn
$autoDeploy   = $srcCfg.AutoDeploymentsEnabled

# 3) Construit le payload JSON
$payload = @{
    ServiceArn          = $serviceArn
    SourceConfiguration = @{
        ImageRepository = @{
            ImageRepositoryType = $imageRepoType
            ImageIdentifier     = $imageId
            ImageConfiguration  = @{
                Port                         = $imageCfg.Port
                RuntimeEnvironmentVariables = $runtimeEnv
            }
        }
        AuthenticationConfiguration = @{
            AccessRoleArn = $accessRoleArn
        }
        AutoDeploymentsEnabled = $autoDeploy
    }
}

$jsonFile = Join-Path $PSScriptRoot 'update-env.json'
$payload | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonFile -Encoding ASCII

# 4) Appelle UpdateService pour injecter les vars
Write-Host "[App Runner] UpdateService (env vars)…" -NoNewline
aws apprunner update-service --cli-input-json file://$jsonFile | Out-Null
Write-Host " OK" -ForegroundColor Green

# 5) Attend que l'opération soit terminée
Write-Host "⏳ Attente de la fin de l'opération…" -NoNewline
do {
    Start-Sleep -Seconds 10
    $status = aws apprunner describe-service `
      --service-arn $serviceArn --query "Service.Status" --output text
    Write-Host "." -NoNewline
} while ($status -eq 'OPERATION_IN_PROGRESS')
