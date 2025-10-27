// Tipos globales para Electron API
export {};

declare global {
  interface Window {
    electronAPI: {
      platform: string;
      isOnline: () => boolean;
      onOnline: (callback: () => void) => void;
      onOffline: (callback: () => void) => void;
      // Aquí añadiremos las APIs de SQLite más adelante
    };
  }
}
