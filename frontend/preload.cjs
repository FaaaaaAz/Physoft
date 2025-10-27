const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Aquí expondremos las APIs de SQLite más adelante
  platform: process.platform,
  
  // API para detección de conexión
  isOnline: () => navigator.onLine,
  
  // Listeners para eventos de conexión
  onOnline: (callback) => {
    window.addEventListener('online', callback);
  },
  onOffline: (callback) => {
    window.addEventListener('offline', callback);
  }
});
