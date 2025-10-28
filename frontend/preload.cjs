const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  
  // API para detección de conexión
  isOnline: () => navigator.onLine,
  onOnline: (callback) => {
    window.addEventListener('online', callback);
  },
  onOffline: (callback) => {
    window.addEventListener('offline', callback);
  },
  
  // ============================================
  // APIs de Base de Datos (SQLite)
  // ============================================
  
  // Atletas
  db: {
    crearAtleta: (data) => ipcRenderer.invoke('db:crear-atleta', data),
    obtenerAtletas: () => ipcRenderer.invoke('db:obtener-atletas'),
    obtenerAtleta: (id) => ipcRenderer.invoke('db:obtener-atleta', id),
    actualizarAtleta: (id, data) => ipcRenderer.invoke('db:actualizar-atleta', id, data),
    eliminarAtleta: (id) => ipcRenderer.invoke('db:eliminar-atleta', id),
    
    // Análisis
    crearAnalisis: (data) => ipcRenderer.invoke('db:crear-analisis', data),
    obtenerAnalisis: (atletaId) => ipcRenderer.invoke('db:obtener-analisis', atletaId)
  }
});
