# Electron Packaging - Instrucciones Rápidas

## 🚀 Comandos para Empaquetar

```powershell
# Desde C:\Dani\Proyectos\Physoft

# 1. Instalar dependencias de Electron
npm install

# 2. Build frontend y backend
npm run build:all

# 3. Crear instalador
npm run make:win
```

## 📁 Resultado

El instalador estará en:
```
C:\Dani\Proyectos\Physoft\out\make\squirrel.windows\x64\Physoft-1.0.0 Setup.exe
```

## ⚠️ Nota sobre el Icono

El icono PNG funciona para la ventana de la app, pero para el instalador de Windows necesitas un archivo `.ico`.

**Opción 1: Usar PNG (actual)**
- ✅ Funciona para la ventana de la app
- ❌ No aparece en el instalador

**Opción 2: Convertir a ICO**
- Usa una herramienta online: https://convertio.co/es/png-ico/
- Sube `physoft.png`
- Descarga como `icon.ico`
- Guarda en `electron/assets/icon.ico`

## 🔧 Archivos Creados

1. ✅ `package.json` - Configuración principal
2. ✅ `electron/main.js` - Proceso principal de Electron
3. ✅ `forge.config.js` - Configuración de empaquetado
4. ✅ `electron/assets/icon.png` - Icono de la app
5. ✅ Backend health endpoint - `/api/health`

## 📦 Tamaño Esperado

- Instalador: ~150-200 MB
- Incluye: Chromium + Node.js + tu código + dependencias

¡Listo para empaquetar! 🎉
