<#
.SYNOPSIS
  Provisionne la RDS, met à jour .env.prod et vérifie la connectivité.
#>
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
Write-Host "== deploy-db.ps1 ==" -ForegroundColor Cyan

# Choix de l'utilisateur pour sauter la phase DB
$ans = Read-Host -Prompt 'Voulez-vous exécuter la phase de provisioning RDS et vérification de la connectivité ? (O/n)'
if ($ans -match '^[nN]') {
    Write-Host "⚠️ Vous avez choisi de SAUTER la vérification DB. Assurez-vous manuellement que l’infra est prête !" -ForegroundColor Yellow
    exit 0
}

# 0) Variables et chemins
$root    = $PSScriptRoot
$envFile = Join-Path $root '.env.prod'

# 1) Charger .env.prod
if (-not (Test-Path $envFile)) {
    Write-Error ".env.prod introuvable à $envFile"
    exit 1
}
$lines = Get-Content $envFile | Where-Object { $_ -and ($_ -notmatch '^\s*#') }
$vars   = @{}
foreach ($l in $lines) {
    $kv = $l -split '=', 2
    if ($kv.Count -eq 2) { $vars[$kv[0]] = $kv[1] }
}
foreach ($v in 'MARIADB_DATABASE','MARIADB_USER','MARIADB_PASSWORD') {
    if (-not $vars.ContainsKey($v) -or [string]::IsNullOrWhiteSpace($vars[$v])) {
        Write-Error "Variable `$v` manquante ou vide dans .env.prod"
        exit 2
    }
}
$DB_NAME     = $vars['MARIADB_DATABASE']
$DB_USER     = $vars['MARIADB_USER']
$DB_PASSWORD = $vars['MARIADB_PASSWORD']
Write-Host "Variables chargées : MARIADB_DATABASE=$DB_NAME  MARIADB_USER=$DB_USER"

# 2) Terraform init/apply + capture de l’output JSON
Write-Host "`n[Terraform] init/apply dans infra\prod"
Push-Location (Join-Path $root 'infra\prod')

terraform init "-input=false"
terraform apply "-input=false" `
    -auto-approve `
    -var "db_name=$DB_NAME" `
    -var "db_user=$DB_USER" `
    -var "db_password=$DB_PASSWORD"

# On reste DANS infra\prod pour lire l’output
$tfJsonRaw = terraform output -json 2>$null
if (-not $tfJsonRaw) {
    Write-Error "Échec de lecture de l’output Terraform (json vide)"
    Pop-Location; exit 3
}
$tfJson = $tfJsonRaw | ConvertFrom-Json
if (-not $tfJson.PSObject.Properties.Match('db_endpoint')) {
    Write-Error "Output 'db_endpoint' introuvable dans Terraform"
    Pop-Location; exit 4
}

$endpoint = $tfJson.db_endpoint.value.Trim()
Pop-Location  # on revient à la racine

# 3) Vérifier l’endpoint et le splitter
Write-Host "`nEndpoint RDS = $endpoint"
if ($endpoint -notmatch '^(?<h>[^:]+):(?<p>\d+)$') {
    Write-Error "Format inattendu pour endpoint : $endpoint"
    exit 5
}
$dbHost = $Matches['h']
$port   = $Matches['p']

# 4) Mettre à jour .env.prod
Write-Host "`n[.env.prod] Mise à jour MARIADB_HOST/MARIADB_PORT"
(Get-Content $envFile) `
  -replace '^MARIADB_HOST=.*$', "MARIADB_HOST=$dbHost" `
  -replace '^MARIADB_PORT=.*$', "MARIADB_PORT=$port" |
  Set-Content -Encoding UTF8 $envFile
Select-String '^MARIADB_HOST=' , '^MARIADB_PORT=' $envFile |
  ForEach-Object { Write-Host "  $_.Line" }

# 5) Attendre l’ouverture du port (max ~1 min)
Write-Host "`n[Test] Connectivité réseau $dbHost`:$port"
for ($i = 0; $i -lt 12; $i++) {
    if ((Test-NetConnection -ComputerName $dbHost -Port $port).TcpTestSucceeded) {
        Write-Host "→ OK"
        break
    }
    Start-Sleep 5
}
if (-not (Test-NetConnection -ComputerName $dbHost -Port $port).TcpTestSucceeded) {
    Write-Error "Port $port injoignable sur $dbHost (vérifiez SG RDS)"
    exit 6
}

Write-Host "`n✅ RDS provisionnée et accessible !" -ForegroundColor Green
