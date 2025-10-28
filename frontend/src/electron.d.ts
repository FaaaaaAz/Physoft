// Tipos globales para Electron API
export {};

// Tipos para Atleta
export interface Atleta {
  id: string;
  nombre: string;
  genero: string;
  disciplina: string;
  posicion?: string;
  somatotipo: string;
  altura: number;
  peso: number;
  edad: number;
  syncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deviceId?: string;
}

export interface CrearAtletaDTO {
  nombre: string;
  genero: string;
  disciplina: string;
  posicion?: string;
  somatotipo: string;
  altura: number;
  peso: number;
  edad: number;
}

export interface Analisis {
  id: string;
  atletaId: string;
  fechaAnalisis: Date;
  tipoAnalisis: string;
  datosJson: string;
  estadoGeneral?: string;
  puntoDebil1?: string;
  puntoDebil2?: string;
  puntoDebil3?: string;
  margenMejora?: number;
  syncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deviceId?: string;
}

export interface DBResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

declare global {
  interface Window {
    electronAPI: {
      platform: string;
      isOnline: () => boolean;
      onOnline: (callback: () => void) => void;
      onOffline: (callback: () => void) => void;
      
      db: {
        crearAtleta: (data: CrearAtletaDTO) => Promise<DBResponse<Atleta>>;
        obtenerAtletas: () => Promise<DBResponse<Atleta[]>>;
        obtenerAtleta: (id: string) => Promise<DBResponse<Atleta>>;
        actualizarAtleta: (id: string, data: Partial<CrearAtletaDTO>) => Promise<DBResponse<Atleta>>;
        eliminarAtleta: (id: string) => Promise<DBResponse<Atleta>>;
        
        crearAnalisis: (data: any) => Promise<DBResponse<Analisis>>;
        obtenerAnalisis: (atletaId: string) => Promise<DBResponse<Analisis[]>>;
      };
    };
  }
}

