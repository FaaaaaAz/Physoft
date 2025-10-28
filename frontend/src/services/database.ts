// Servicio de base de datos para React
// Wrapper sobre las APIs de Electron

import type { Atleta, CrearAtletaDTO, Analisis, DBResponse } from '../electron';

// Detectar si estamos en Electron o navegador
const isElectron = typeof window !== 'undefined' && window.electronAPI;

class DatabaseService {
  // ============================================
  // ATLETAS
  // ============================================
  
  async crearAtleta(data: CrearAtletaDTO): Promise<DBResponse<Atleta>> {
    if (!isElectron) {
      console.warn('⚠️ No estamos en Electron, usando localStorage temporal');
      return this.crearAtletaLocalStorage(data);
    }
    
    try {
      const response = await window.electronAPI.db.crearAtleta(data);
      if (response.success) {
        console.log('✅ Atleta creado en SQLite:', response.data?.nombre);
      }
      return response;
    } catch (error: any) {
      console.error('❌ Error al crear atleta:', error);
      return { success: false, error: error.message };
    }
  }
  
  async obtenerAtletas(): Promise<DBResponse<Atleta[]>> {
    if (!isElectron) {
      return this.obtenerAtletasLocalStorage();
    }
    
    try {
      const response = await window.electronAPI.db.obtenerAtletas();
      console.log(`📊 ${response.data?.length || 0} atletas obtenidos`);
      return response;
    } catch (error: any) {
      console.error('❌ Error al obtener atletas:', error);
      return { success: false, error: error.message };
    }
  }
  
  async obtenerAtleta(id: string): Promise<DBResponse<Atleta>> {
    if (!isElectron) {
      return this.obtenerAtletaLocalStorage(id);
    }
    
    try {
      return await window.electronAPI.db.obtenerAtleta(id);
    } catch (error: any) {
      console.error('❌ Error al obtener atleta:', error);
      return { success: false, error: error.message };
    }
  }
  
  async actualizarAtleta(id: string, data: Partial<CrearAtletaDTO>): Promise<DBResponse<Atleta>> {
    if (!isElectron) {
      return this.actualizarAtletaLocalStorage(id, data);
    }
    
    try {
      const response = await window.electronAPI.db.actualizarAtleta(id, data);
      if (response.success) {
        console.log('✅ Atleta actualizado:', response.data?.nombre);
      }
      return response;
    } catch (error: any) {
      console.error('❌ Error al actualizar atleta:', error);
      return { success: false, error: error.message };
    }
  }
  
  async eliminarAtleta(id: string): Promise<DBResponse<Atleta>> {
    if (!isElectron) {
      return this.eliminarAtletaLocalStorage(id);
    }
    
    try {
      const response = await window.electronAPI.db.eliminarAtleta(id);
      if (response.success) {
        console.log('✅ Atleta eliminado');
      }
      return response;
    } catch (error: any) {
      console.error('❌ Error al eliminar atleta:', error);
      return { success: false, error: error.message };
    }
  }
  
  // ============================================
  // ANÁLISIS
  // ============================================
  
  async crearAnalisis(data: any): Promise<DBResponse<Analisis>> {
    if (!isElectron) {
      console.warn('⚠️ Análisis solo disponible en Electron');
      return { success: false, error: 'No disponible en navegador' };
    }
    
    try {
      return await window.electronAPI.db.crearAnalisis(data);
    } catch (error: any) {
      console.error('❌ Error al crear análisis:', error);
      return { success: false, error: error.message };
    }
  }
  
  async obtenerAnalisis(atletaId: string): Promise<DBResponse<Analisis[]>> {
    if (!isElectron) {
      return { success: false, error: 'No disponible en navegador' };
    }
    
    try {
      return await window.electronAPI.db.obtenerAnalisis(atletaId);
    } catch (error: any) {
      console.error('❌ Error al obtener análisis:', error);
      return { success: false, error: error.message };
    }
  }
  
  // ============================================
  // FALLBACK: LocalStorage (para desarrollo web)
  // ============================================
  
  private crearAtletaLocalStorage(data: CrearAtletaDTO): DBResponse<Atleta> {
    const atletas = this.getLocalStorageAtletas();
    const nuevoAtleta: Atleta = {
      id: crypto.randomUUID(),
      ...data,
      syncedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    atletas.push(nuevoAtleta);
    localStorage.setItem('atletas', JSON.stringify(atletas));
    return { success: true, data: nuevoAtleta };
  }
  
  private obtenerAtletasLocalStorage(): DBResponse<Atleta[]> {
    const atletas = this.getLocalStorageAtletas();
    return { success: true, data: atletas };
  }
  
  private obtenerAtletaLocalStorage(id: string): DBResponse<Atleta> {
    const atletas = this.getLocalStorageAtletas();
    const atleta = atletas.find(a => a.id === id);
    if (!atleta) {
      return { success: false, error: 'Atleta no encontrado' };
    }
    return { success: true, data: atleta };
  }
  
  private actualizarAtletaLocalStorage(id: string, data: Partial<CrearAtletaDTO>): DBResponse<Atleta> {
    const atletas = this.getLocalStorageAtletas();
    const index = atletas.findIndex(a => a.id === id);
    if (index === -1) {
      return { success: false, error: 'Atleta no encontrado' };
    }
    atletas[index] = { ...atletas[index], ...data, updatedAt: new Date() };
    localStorage.setItem('atletas', JSON.stringify(atletas));
    return { success: true, data: atletas[index] };
  }
  
  private eliminarAtletaLocalStorage(id: string): DBResponse<Atleta> {
    const atletas = this.getLocalStorageAtletas();
    const index = atletas.findIndex(a => a.id === id);
    if (index === -1) {
      return { success: false, error: 'Atleta no encontrado' };
    }
    const atletaEliminado = atletas[index];
    atletas.splice(index, 1);
    localStorage.setItem('atletas', JSON.stringify(atletas));
    return { success: true, data: atletaEliminado };
  }
  
  private getLocalStorageAtletas(): Atleta[] {
    const data = localStorage.getItem('atletas');
    return data ? JSON.parse(data) : [];
  }
}

export const db = new DatabaseService();
