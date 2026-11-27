# =============================================================================
# clone-and-setup.ps1 — Tự động clone toàn bộ mã nguồn Plasmic Studio từ GitHub
#                      vào máy local và chuẩn bị cấu hình (Password DB: 112233)
# =============================================================================
param (
    [string]$TargetDir = "$PSScriptRoot\plasmic-studio-src",
    [string]$RepoUrl = "https://github.com/plasmicapp/plasmic.git",
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "   TẢI VÀ THIẾT LẬP MÃ NGUỒN GỐC PLASMIC STUDIO (LOCAL)" -ForegroundColor Cyan
Write-Host "=======================================================`n" -ForegroundColor Cyan

# 1. Kiểm tra công cụ cần thiết
Write-Host "[1/5] Kiểm tra công cụ hệ thống..." -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "LỖI: Chưa cài Git. Hãy cài Git trước: https://git-scm.com/" -ForegroundColor Red
    exit 1
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "LỖI: Chưa cài Node.js. Hãy cài Node.js v18+: https://nodejs.org/" -ForegroundColor Red
    exit 1
}
if (-not (Get-Command yarn -ErrorAction SilentlyContinue)) {
    Write-Host "Chưa có Yarn, đang cài đặt qua npm..." -ForegroundColor Yellow
    npm install -g yarn
}
Write-Host "  -> Git, Node.js ($(node --version)), Yarn ($(yarn --version)) ĐÃ SẴN SÀNG.`n" -ForegroundColor Green

# 2. Clone mã nguồn đầy đủ từ GitHub
Write-Host "[2/5] Đang tải mã nguồn từ $RepoUrl về $TargetDir..." -ForegroundColor Yellow
Write-Host "  (Quá trình này kéo toàn bộ mã nguồn Studio về máy, mất vài phút)..." -ForegroundColor Gray

if (Test-Path "$TargetDir\.git") {
    Write-Host "  Thư mục $TargetDir đã tồn tại mã nguồn, bỏ qua bước clone." -ForegroundColor Green
} else {
    git clone --depth 1 --branch $Branch $RepoUrl $TargetDir
    Write-Host "  -> ĐÃ TẢI XONG TOÀN BỘ MÃ NGUỒN VỀ LOCAL!`n" -ForegroundColor Green
}

# 3. Tạo cấu hình .env cho Studio (platform/wab)
Write-Host "[3/5] Cấu hình file .env cho Plasmic Studio (platform\wab)..." -ForegroundColor Yellow
$wabEnvPath = "$TargetDir\platform\wab\.env"

$envContent = @"
NODE_ENV=development
PORT=3003
PUBLIC_URL=http://localhost:3003

# PostgreSQL Database (Local)
PLASMIC_DB_USER=plasmic
PLASMIC_DB_PASSWORD=112233
PLASMIC_DB_NAME=plasmic

DATABASE_URL=postgresql://plasmic:112233@127.0.0.1:5432/plasmic
DATABASE_URI=postgres://plasmic:112233@127.0.0.1:5432/plasmic
WAB_DBNAME=plasmic
WAB_DBPASSWORD=112233

# Storage & Secrets
S3_ENDPOINT=
S3_BUCKET=
JWT_SECRET=plasmic_local_jwt_secret_dev
SESSION_SECRET=plasmic_local_session_secret_dev
"@

Set-Content -Path $wabEnvPath -Value $envContent -Encoding UTF8
Write-Host "  -> Đã tạo $wabEnvPath với mật khẩu DB: 112233`n" -ForegroundColor Green

# 4. Hướng dẫn khởi tạo Database
Write-Host "[4/5] Khởi tạo Database PostgreSQL local:" -ForegroundColor Yellow
Write-Host "  Nếu bạn đã cài PostgreSQL, mở SQL Shell (psql) và chạy:" -ForegroundColor Cyan
Write-Host "    CREATE ROLE plasmic LOGIN PASSWORD '112233';" -ForegroundColor White
Write-Host "    CREATE DATABASE plasmic OWNER plasmic;" -ForegroundColor White
Write-Host "    \c plasmic" -ForegroundColor White
Write-Host "    CREATE EXTENSION IF NOT EXISTS ""uuid-ossp"";" -ForegroundColor White
Write-Host "    CREATE EXTENSION IF NOT EXISTS ""pgcrypto"";`n" -ForegroundColor White

# 5. Cài đặt thư viện dependencies
Write-Host "[5/5] Cài đặt dependencies (Yarn workspaces)..." -ForegroundColor Yellow
Write-Host "  Chuyển vào thư mục: $TargetDir" -ForegroundColor Gray
Push-Location $TargetDir
try {
    yarn install
    Write-Host "  -> Cài đặt hoàn tất!`n" -ForegroundColor Green
} catch {
    Write-Host "  Cảnh báo trong quá trình yarn install, bạn có thể chạy lại thủ công sau." -ForegroundColor Yellow
} finally {
    Pop-Location
}

Write-Host "=======================================================" -ForegroundColor Green
Write-Host " HOÀN TẤT! Để chạy Plasmic Studio trên máy local:" -ForegroundColor Green
Write-Host "   Chạy lệnh: .\infra\plasmic\run-local.ps1" -ForegroundColor Cyan
Write-Host "   Hoặc:" -ForegroundColor Gray
Write-Host "     cd $TargetDir\platform\wab" -ForegroundColor White
Write-Host "     yarn dev" -ForegroundColor White
Write-Host "   Truy cập Studio tại: http://localhost:3003" -ForegroundColor White
Write-Host "=======================================================`n" -ForegroundColor Green
