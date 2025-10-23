// ============================================
// TYPES - Domain Layer
// ============================================
// Tipos y interfaces compartidos del dominio
// ============================================

// Criterios de comparación para cohortes
export interface CriteriosComparacion {
  genero: string
  disciplina: string
  posicion?: string
  somatotipo: string
  alturaMin: number
  alturaMax: number
  pesoMin: number
  pesoMax: number
  edadMin: number
  edadMax: number
}

// Resultado de comparación
export interface ResultadoComparacion {
  estadoGeneral: 'Bajo' | 'Promedio' | 'Alto'
  puntosDebiles: string[]
  margenMejoraAbsoluto: number
  margenMejoraPorcentual: number
  atletasComparados: number
}

// Reglas de comparación según edad
export function obtenerReglasComparacion(edad: number): {
  toleranciaAltura: number
  toleranciaPeso: number
  toleranciaEdad: number
} {
  if (edad >= 17) {
    return {
      toleranciaAltura: 7,  // ±7 cm
      toleranciaPeso: 20,   // ±20 lbs
      toleranciaEdad: 3,    // ±3 años
    }
  } else {
    return {
      toleranciaAltura: 5,  // ±5 cm
      toleranciaPeso: 15,   // ±15 lbs
      toleranciaEdad: 1,    // ±1 año
    }
  }
}
