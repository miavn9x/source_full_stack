$ErrorActionPreference = "Stop"
$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

if (-not (Test-Path $psqlPath)) {
    $found = Get-ChildItem -Path "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $psqlPath = $found.FullName
    } else {
        Write-Host "Khong tim thay psql.exe tren may." -ForegroundColor Red
        exit 1
    }
}

$createDbSql = Join-Path $PSScriptRoot "create-db.sql"
$initExtSql = Join-Path $PSScriptRoot "init-extensions.sql"

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   KHOI TAO USER VA DATABASE PLASMIC (MAT KHAU: 112233)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Dang ket noi vao PostgreSQL bang user 'postgres'..." -ForegroundColor Yellow
Write-Host "Nhap mat khau cua user 'postgres' khi duoc hoi:`n" -ForegroundColor Gray

# Chay file create-db.sql
& $psqlPath -U postgres -h 127.0.0.1 -f $createDbSql

Write-Host ""
Write-Host "Dang bat extensions cho database 'plasmic'..." -ForegroundColor Yellow
Write-Host "Nhap lai mat khau cua 'postgres' neu duoc hoi:`n" -ForegroundColor Gray

# Chay file init-extensions.sql tren database plasmic
& $psqlPath -U postgres -h 127.0.0.1 -d plasmic -f $initExtSql

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host " DA TAO THANH CONG USER PLASMIC (PASS: 112233) & DB PLASMIC!" -ForegroundColor Green
Write-Host " Bay gio ban chi can chay lenh:" -ForegroundColor White
Write-Host "   .\infra\plasmic\start-studio.ps1" -ForegroundColor Cyan
Write-Host "=======================================================`n" -ForegroundColor Green
