$ErrorActionPreference = "Stop"
$wabDir = Join-Path $PSScriptRoot "plasmic-studio-src\platform\wab"

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   KHOI CHAY TRON GOI PLASMIC STUDIO (WINDOWS LOCAL)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $wabDir)) {
    Write-Host "LOI: Khong tim thay thu muc WAB tai: $wabDir" -ForegroundColor Red
    exit 1
}

# 1. Kiem tra ket noi Database PostgreSQL
Write-Host "[1/2] Kiem tra ket noi PostgreSQL (Port 5432)..." -ForegroundColor Yellow
$tcpClient = New-Object System.Net.Sockets.TcpClient
$dbReady = $false

try {
    $asyncResult = $tcpClient.BeginConnect("127.0.0.1", 5432, $null, $null)
    $success = $asyncResult.AsyncWaitHandle.WaitOne(2000, $false)
    if ($success -and $tcpClient.Connected) {
        $dbReady = $true
        Write-Host "  -> PostgreSQL CONG 5432 HOAT DONG TOT!" -ForegroundColor Green
        Write-Host ""
    }
} catch {
    $dbReady = $false
} finally {
    $tcpClient.Close()
    $tcpClient.Dispose()
}

if (-not $dbReady) {
    Write-Host "  [CANH BAO] PostgreSQL chua duoc bat tren may (cong 5432 khong phan hoi)." -ForegroundColor Red
    Write-Host "  Hay bat PostgreSQL truoc khi khoi chay Studio." -ForegroundColor Yellow
    exit 1
}

# 2. Khoi tao du lieu mau neu chua co
Push-Location $wabDir
try {
    Write-Host "[2/3] Khoi tao du lieu mau (user, team, workspace)..." -ForegroundColor Yellow
    node -r esbuild-register -r dotenv/config src/wab/server/db/DbInit.ts 2>$null
    Write-Host "  -> Du lieu khoi tao san sang!" -ForegroundColor Green
    Write-Host ""
} catch {
    # Bo qua neu da khoi tao roi
} finally {
    Pop-Location
}

# 2.5 Build canvas packages neu chua co
$clientPkgs = Join-Path $PSScriptRoot "plasmic-studio-src\platform\canvas-packages\build\client.js"
if (-not (Test-Path $clientPkgs)) {
    Write-Host "[2.5/3] Dang build canvas packages..." -ForegroundColor Yellow
    node (Join-Path $PSScriptRoot "build-canvas-pkgs.cjs")
}

# 3. Khoi chay tron goi: Backend (Port 3004) + Frontend Visual Editor (Port 3003)
Write-Host "[3/3] Dang khoi chay song song Studio Backend + Frontend..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  =======================================================" -ForegroundColor Green
Write-Host "  -> PLASMIC STUDIO UI : http://localhost:3003" -ForegroundColor Green
Write-Host "  -> PLASMIC BACKEND   : http://localhost:3004" -ForegroundColor Cyan
Write-Host "  =======================================================" -ForegroundColor Green
Write-Host "  Nhan Ctrl + C de dung toan bo server." -ForegroundColor Gray
Write-Host ""

Push-Location $wabDir
try {
    $env:PORT = "3003"
    $env:BACKEND_PORT = "3004"
    $env:NODE_ENV = "development"

    $backendCmd = "node -r esbuild-register -r dotenv/config src/wab/server/main.ts"
    $frontendCmd = "pnpm rsbuild dev"

    npx concurrently --names "BACKEND,FRONTEND" --prefix-colors "blue,green" $backendCmd $frontendCmd
} finally {
    Pop-Location
}
