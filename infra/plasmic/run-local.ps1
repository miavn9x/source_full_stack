# =============================================================================
# run-local.ps1 — Khởi chạy Plasmic Studio WAB từ mã nguồn local (Port 3003)
# =============================================================================
$targetWab = "$PSScriptRoot\plasmic-studio-src\platform\wab"

if (-not (Test-Path $targetWab)) {
    Write-Host "LỖI: Chưa tìm thấy mã nguồn Plasmic Studio tại: $targetWab" -ForegroundColor Red
    Write-Host "Hãy chạy script tải mã nguồn trước: .\infra\plasmic\clone-and-setup.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Đang khởi chạy Plasmic Studio từ mã nguồn local..." -ForegroundColor Cyan
Write-Host "Thư mục: $targetWab" -ForegroundColor Gray
Write-Host "URL Studio: http://localhost:3003" -ForegroundColor Green
Write-Host "Nhấn Ctrl + C để dừng.`n" -ForegroundColor Yellow

Push-Location $targetWab
try {
    $env:PORT = "3003"
    yarn dev
} finally {
    Pop-Location
}
