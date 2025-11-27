#!/bin/bash

# Script para ejecutar backend y frontend simultáneamente
# Uso: ./run-dev.sh

echo "🚀 Iniciando Physoft - Backend + Frontend"
echo "=========================================="

# Función para manejar señales de interrupción
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill 0
    exit 0
}

# Capturar señales de interrupción
trap cleanup SIGINT SIGTERM

# Verificar que estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto Physoft"
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado"
    exit 1
fi

echo "✅ Verificando dependencias..."

# Instalar dependencias del backend si no existen
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    cd backend
    npm install
    cd ..
fi

# Instalar dependencias del frontend si no existen
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    cd frontend
    npm install
    cd ..
fi

echo "✅ Dependencias verificadas"
echo ""

# Verificar que la base de datos existe
if [ ! -f "backend/prisma/dev.db" ]; then
    echo "🗄️ Configurando base de datos..."
    cd backend
    npx prisma generate
    npx prisma migrate dev --name init
    cd ..
fi

echo "🚀 Iniciando servicios..."
echo ""

# Iniciar backend en background
echo "🔧 Iniciando backend (puerto 3000)..."
cd backend && npm run dev &
BACKEND_PID=$!

# Esperar un poco para que el backend inicie
sleep 3

# Verificar que el backend está corriendo
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend iniciado correctamente"
else
    echo "❌ Error al iniciar el backend"
    exit 1
fi

# Iniciar frontend en background
echo "🎨 Iniciando frontend (puerto 5173)..."
cd ..
cd frontend && npm run dev &
FRONTEND_PID=$!

# Esperar un poco para que el frontend inicie
sleep 3

# Verificar que el frontend está corriendo
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "✅ Frontend iniciado correctamente"
else
    echo "❌ Error al iniciar el frontend"
    exit 1
fi

echo ""
echo "🎉 ¡Physoft está ejecutándose!"
echo "================================"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3000"
echo "🗄️  Database: SQLite (backend/prisma/dev.db)"
echo ""
echo "Presiona Ctrl+C para detener ambos servicios"
echo ""

# Mantener el script corriendo
wait</content>
<parameter name="filePath">d:\UPB\Physoft\run-dev.sh