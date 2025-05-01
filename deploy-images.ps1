<#
.SYNOPSIS
  Build & push Docker images (backend + frontend) dans AWS ECR,
  en isolant l'auth Docker pour eviter le helper ECR,
  et en verifiant si l'image locale existe pour eviter un rebuild inutile.
#>
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
Write-Host '== deploy-images.ps1 ==' -ForegroundColor Cyan

# 1) Pre-requis
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Error 'AWS CLI introuvable.'
    exit 1
}
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error 'Docker introuvable.'
    exit 1
}

# 2) Verifier AWS creds
Write-Host "`n[Test AWS] sts get-caller-identity..." -NoNewline
try {
    aws sts get-caller-identity --output text > $null
    Write-Host ' OK' -ForegroundColor Green
} catch {
    Write-Error 'Echec sts get-caller-identity.'
    exit 1
}

# 3) Recuperer compte et region
$account = (aws sts get-caller-identity --query Account --output text).Trim()
$region  = (aws configure get region).Trim()
if ([string]::IsNullOrEmpty($account) -or [string]::IsNullOrEmpty($region)) {
    Write-Error 'Impossible de recuperer account ou region.'
    exit 1
}
Write-Host "`nCompte AWS : $account    Region : $region"

# 4) Verifier acces ECR
$repos = @('iddlesaur-backend','iddlesaur-frontend')
foreach ($repo in $repos) {
    Write-Host "`n[Test AWS] describe-repositories $repo..." -NoNewline
    try {
        aws ecr describe-repositories --repository-names $repo --region $region > $null
        Write-Host ' OK' -ForegroundColor Green
    } catch {
        Write-Error "Pas d'acces describe-repositories sur $repo."
        exit 1
    }
}

# 5) Determiner le tag
if ($env:TAG) { $tag = $env:TAG } else { $tag = 'latest' }
Write-Host "`nTag Docker : $tag"

# 6) Creer les depots manquants
foreach ($repo in $repos) {
    Write-Host "`n[Verification ECR] depot $repo..." -NoNewline
    try {
        aws ecr describe-repositories --repository-names $repo --region $region > $null
        Write-Host ' existe' -ForegroundColor Green
    } catch {
        Write-Host ' manquant, creation...' -NoNewline
        try {
            aws ecr create-repository --repository-name $repo --region $region > $null
            Write-Host ' cree' -ForegroundColor Green
        } catch {
            Write-Error "Echec creation depot $repo."
            exit 1
        }
    }
}

# 7) Auth Docker -> ECR en mode isole
$registry = "$account.dkr.ecr.$region.amazonaws.com"

# a) creer dossier temporaire pour config
$tempConfig = Join-Path $env:TEMP 'docker-ecr-auth'
if (Test-Path $tempConfig) {
    Remove-Item $tempConfig -Recurse -Force
}
New-Item -ItemType Directory -Path $tempConfig | Out-Null

# b) ecrire un config.json minimal (ASCII, pas de BOM)
@'
{"credsStore":"desktop","auths":{}}
'@ | Set-Content -Path (Join-Path $tempConfig 'config.json') -Encoding ASCII

# c) basculer DOCKER_CONFIG
$oldConfig         = $env:DOCKER_CONFIG
$env:DOCKER_CONFIG = $tempConfig

# d) login
Write-Host "`n[Docker] Connexion a ECR $registry..." -NoNewline
$token = (& aws ecr get-login-password --region $region).Trim()
cmd.exe /c "echo $token | docker login --username AWS --password-stdin $registry" > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Docker login a echoue.'
    $env:DOCKER_CONFIG = $oldConfig
    exit 1
}
Write-Host ' OK' -ForegroundColor Green

# e) restaurer config d'origine
$env:DOCKER_CONFIG = $oldConfig

# 8) Build, tag et push avec verification locale
foreach ($img in $repos) {
    $name  = $img.Replace('iddlesaur-','')
    $image = "iddlesaur-$name"
    $path  = Join-Path $PSScriptRoot $name
    $full  = "$($registry)/$($image):$($tag)"

    # Verifier si l'image locale existe
    $localId = docker images -q "$($image):$($tag)" 2>$null
    if ($localId) {
        $ans = Read-Host "Image locale '$($image):$($tag)' DETECTEE. Rebuild ? (y/N)"
        if ($ans -notmatch '^[Yy]') {
            Write-Host "-> Skip build for $image" -ForegroundColor Yellow
            Write-Host "[Docker] Push existant $full..."
            docker tag $image $full
            docker push $full
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Echec push pour '$full'"
                exit 1
            }
            Write-Host "[OK] $full" -ForegroundColor Green
            continue
        }
    }

    # Build et push
    Write-Host "`n[Docker] Build $image depuis '$path'..."
    if (-not (Test-Path $path)) {
        Write-Error "Repertoire introuvable : $path"
        exit 1
    }
    docker build -t $image $path
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Echec build pour '$image'"
        exit 1
    }

    Write-Host "[Docker] Push $full..."
    docker tag $image $full
    docker push $full
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Echec push pour '$full'"
        exit 1
    }

    Write-Host "[OK] $full" -ForegroundColor Green
}

# 9) Message de fin
Write-Host '[FIN] Toutes les images ont ete poussees.' -ForegroundColor Cyan

exit 0
