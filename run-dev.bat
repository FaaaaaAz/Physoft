@echo off
REM Script para ejecutar backend y frontend simultáneamente en Windows
REM Uso: .\run-dev.bat

echo 🚀 Iniciando Physoft - Backend + Frontend
echo ==========================================

REM Verificar que estamos en el directorio correcto
if not exist "backend" (
    echo ❌ Error: Ejecuta este script desde la raíz del proyecto Physoft
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Error: Ejecuta este script desde la raíz del proyecto Physoft
    pause
    exit /b 1
)

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    pause
    exit /b 1
)

REM Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm no está instalado
    pause
    exit /b 1
)

echo ✅ Verificando dependencias...

REM Instalar dependencias del backend si no existen
if not exist "backend\node_modules" (
    echo 📦 Instalando dependencias del backend...
    cd backend
    npm install
    cd ..
)

REM Instalar dependencias del frontend si no existen
if not exist "frontend\node_modules" (
    echo 📦 Instalando dependencias del frontend...
    cd frontend
    npm install
    cd ..
)

echo ✅ Dependencias verificadas
echo.

REM Verificar que la base de datos existe
if not exist "backend\prisma\dev.db" (
    echo 🗄️ Configurando base de datos...
    cd backend
    npx prisma generate
    npx prisma migrate dev --name init
    cd ..
)

echo 🚀 Iniciando servicios...
echo.

REM Iniciar backend
echo 🔧 Iniciando backend (puerto 3000)...
start "Backend - Physoft" cmd /k "cd backend && npm run dev"

REM Esperar un poco para que el backend inicie
timeout /t 5 /nobreak >nul

REM Iniciar frontend
echo 🎨 Iniciando frontend (puerto 5173)...
start "Frontend - Physoft" cmd /k "cd frontend && npm run dev"

REM Esperar un poco para que el frontend inicie
timeout /t 3 /nobreak >nul

echo.
echo 🎉 ¡Physoft está ejecutándose!
echo ================================
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3000
echo 🗄️  Database: SQLite (backend/prisma/dev.db)
echo.
echo Las terminales se abrieron en ventanas separadas
echo Cierra las ventanas de comando para detener los servicios
echo.

pause</content>
<parameter name="filePath">d:\UPB\Physoft\run-dev.bat