const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./electron/database.cjs');

// Force the Chromium UI locale to English regardless of the OS locale, so
// native controls the app can't restyle via CSS (date picker popup, context
// menus, etc.) are always in English. Must be set before the app is ready.
app.commandLine.appendSwitch('lang', 'en-US');

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
    icon: path.join(__dirname, 'assets', 'icon.png') // Optional
  });

  // In development, load from Vite
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools(); // Open DevTools in development
  } else {
    // In production, load the build
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ============================================
// IPC Handlers for Database
// ============================================

// Athletes
ipcMain.handle('db:create-athlete', async (event, data) => {
  return await db.createAthlete(data);
});

ipcMain.handle('db:get-athletes', async () => {
  return await db.getAthletes();
});

ipcMain.handle('db:get-athlete', async (event, id) => {
  return await db.getAthleteById(id);
});

ipcMain.handle('db:update-athlete', async (event, id, data) => {
  return await db.updateAthlete(id, data);
});

ipcMain.handle('db:delete-athlete', async (event, id) => {
  return await db.deleteAthlete(id);
});

// Analysis
ipcMain.handle('db:create-analysis', async (event, data) => {
  return await db.createAnalysis(data);
});

ipcMain.handle('db:get-analysis', async (event, athleteId) => {
  return await db.getAnalysisByAthlete(athleteId);
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
