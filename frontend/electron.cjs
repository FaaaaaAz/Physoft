const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./electron/database.cjs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, 'assets', 'icon.png') // Opcional
  });

  // En desarrollo, cargar desde Vite
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools(); // Abrir DevTools en desarrollo
  } else {
    // En producción, cargar el build
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ============================================
// IPC Handlers para Base de Datos
// ============================================

// Atletas
ipcMain.handle('db:crear-atleta', async (event, data) => {
  return await db.crearAtleta(data);
});

ipcMain.handle('db:obtener-atletas', async () => {
  return await db.obtenerAtletas();
});

ipcMain.handle('db:obtener-atleta', async (event, id) => {
  return await db.obtenerAtletaPorId(id);
});

ipcMain.handle('db:actualizar-atleta', async (event, id, data) => {
  return await db.actualizarAtleta(id, data);
});

ipcMain.handle('db:eliminar-atleta', async (event, id) => {
  return await db.eliminarAtleta(id);
});

// Análisis
ipcMain.handle('db:crear-analisis', async (event, data) => {
  return await db.crearAnalisis(data);
});

ipcMain.handle('db:obtener-analisis', async (event, atletaId) => {
  return await db.obtenerAnalisisPorAtleta(atletaId);
});

app.on('ready', () => {
  db.initDatabase();
  createWindow();
});

app.on('window-all-closed', () => {
  db.closeDatabase();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
