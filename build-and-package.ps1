# Physoft - Script de Build y Empaquetado
# Ejecuta: .\build-and-package.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  PHYSOFT - BUILD & PACKAGE" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar errores
function Check-LastExitCode {
    param($message)
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: $message" -ForegroundColor Red
        exit 1
    }
}

# 1. Verificar que estamos en la carpeta correcta
if (!(Test-Path "package.json")) {
    Write-Host "❌ ERROR: package.json no encontrado. Asegúrate de estar en la carpeta Physoft/" -ForegroundColor Red
    exit 1
}

Write-Host "📂 Directorio actual: $PWD" -ForegroundColor Yellow
Write-Host ""

# 2. Build Frontend
Write-Host "🎨 [1/4] Building Frontend..." -ForegroundColor Green
Set-Location frontend

# Limpiar dist anterior
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
    Write-Host "   ✓ Limpiado frontend/dist/" -ForegroundColor Gray
}

# Build
npm run build
Check-LastExitCode "Build de frontend falló"

# Verificar que se generó dist/
if (!(Test-Path "dist/index.html")) {
    Write-Host "❌ ERROR: frontend/dist/index.html no se generó" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Frontend build completado" -ForegroundColor Green
Set-Location ..
Write-Host ""

# 3. Build Backend
Write-Host "⚙️  [2/4] Building Backend..." -ForegroundColor Green
Set-Location backend

# Verificar .env
if (!(Test-Path ".env")) {
    Write-Host "⚠️  ADVERTENCIA: .env no encontrado en backend/" -ForegroundColor Yellow
}

# Generar Prisma Client
Write-Host "   - Generando Prisma Client..." -ForegroundColor Gray
npx prisma generate
Check-LastExitCode "Prisma generate falló"

# Limpiar dist anterior
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
    Write-Host "   ✓ Limpiado backend/dist/" -ForegroundColor Gray
}

# Build
npm run build
Check-LastExitCode "Build de backend falló"

# Verificar que se generó dist/
if (!(Test-Path "dist/index.js")) {
    Write-Host "❌ ERROR: backend/dist/index.js no se generó" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Backend build completado" -ForegroundColor Green
Set-Location ..
Write-Host ""

# 4. Verificar archivos necesarios
Write-Host "🔍 [3/4] Verificando estructura..." -ForegroundColor Green

$checks = @(
    @{Path="electron/main.js"; Name="Electron Main"},
    @{Path="frontend/dist/index.html"; Name="Frontend Build"},
    @{Path="backend/dist/index.js"; Name="Backend Build"},
    @{Path="backend/.env"; Name="Backend .env"}
)

$allOk = $true
foreach ($check in $checks) {
    if (Test-Path $check.Path) {
        Write-Host "   ✓ $($check.Name)" -ForegroundColor Gray
    } else {
        Write-Host "   ✗ $($check.Name) - NO ENCONTRADO" -ForegroundColor Red
        $allOk = $false
    }
}

if (!$allOk) {
    Write-Host ""
    Write-Host "❌ Algunos archivos necesarios no se encontraron" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Todos los archivos presentes" -ForegroundColor Green
Write-Host ""

# 5. Empaquetar
Write-Host "📦 [4/4] Empaquetando aplicación..." -ForegroundColor Green

# Limpiar dist anterior
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
    Write-Host "   ✓ Limpiado dist/" -ForegroundColor Gray
}

npm run dist:win
Check-LastExitCode "Empaquetado falló"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  ✅ BUILD COMPLETADO" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 6. Mostrar resultado
if (Test-Path "dist/win-unpacked/Physoft.exe") {
    Write-Host "🎉 Aplicación empaquetada exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Ubicación del .exe:" -ForegroundColor Yellow
    Write-Host "   $PWD\dist\win-unpacked\Physoft.exe" -ForegroundColor White
    Write-Host ""
    Write-Host "📦 Instalador:" -ForegroundColor Yellow
    Get-ChildItem "dist" -Filter "*.exe" | ForEach-Object {
        Write-Host "   $($_.FullName)" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "🚀 Para ejecutar sin instalar:" -ForegroundColor Cyan
    Write-Host "   cd dist\win-unpacked" -ForegroundColor White
    Write-Host "   .\Physoft.exe" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Logs de la app en:" -ForegroundColor Cyan
    Write-Host "   C:\Users\$env:USERNAME\AppData\Roaming\physoft\app.log" -ForegroundColor White
} else {
    Write-Host "⚠️  El empaquetado completó pero no se encontró Physoft.exe" -ForegroundColor Yellow
    Write-Host "   Revisa la carpeta dist/ manualmente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
