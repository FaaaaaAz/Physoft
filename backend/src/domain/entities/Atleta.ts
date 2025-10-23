// ============================================
// ENTIDAD: Atleta - Domain Layer
// ============================================
// Representa las propiedades de un atleta
// ============================================

export interface Atleta {
  id: number
  nombre: string
  genero: string
  disciplina: string
  posicion?: string | null
  somatotipo: string
  altura: number  // cm
  peso: number    // lbs
  edad: number
  createdAt: Date
  updatedAt: Date
}

// Tipos para crear un nuevo atleta (sin campos autogenerados)
export type CreateAtletaDTO = Omit<Atleta, 'id' | 'createdAt' | 'updatedAt'>

// Tipos para actualizar un atleta (campos opcionales)
export type UpdateAtletaDTO = Partial<CreateAtletaDTO>

// Tipos de valores permitidos
export enum Genero {
  MASCULINO = 'Masculino',
  FEMENINO = 'Femenino',
  OTRO = 'Otro',
}

export enum Somatotipo {
  MESOMORFO = 'Mesomorfo',
  ECTOMORFO = 'Ectomorfo',
  ENDOMORFO = 'Endomorfo',
}
