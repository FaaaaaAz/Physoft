// ============================================
// SERVICIO: Comparación - Application Layer
// ============================================
// Lógica de negocio para comparar atletas con cohortes
// Placeholder para MVP - implementación futura
// ============================================

import { prisma } from '../../infrastructure/prismaClient'
import { CriteriosComparacion, ResultadoComparacion, obtenerReglasComparacion } from '../../domain/types'

export class ComparacionService {
  /**
   * Genera criterios de comparación para un atleta
   * basándose en sus características físicas y reglas de edad
   */
  static generarCriterios(atleta: {
    genero: string
    disciplina: string
    posicion?: string | null
    somatotipo: string
    altura: number
    peso: number
    edad: number
  }): CriteriosComparacion {
    const reglas = obtenerReglasComparacion(atleta.edad)

    return {
      genero: atleta.genero,
      disciplina: atleta.disciplina,
      posicion: atleta.posicion || undefined,
      somatotipo: atleta.somatotipo,
      alturaMin: atleta.altura - reglas.toleranciaAltura,
      alturaMax: atleta.altura + reglas.toleranciaAltura,
      pesoMin: atleta.peso - reglas.toleranciaPeso,
      pesoMax: atleta.peso + reglas.toleranciaPeso,
      edadMin: atleta.edad - reglas.toleranciaEdad,
      edadMax: atleta.edad + reglas.toleranciaEdad,
    }
  }

  /**
   * Busca atletas comparables en la base de datos
   * según los criterios definidos
   */
  static async buscarCohorte(criterios: CriteriosComparacion) {
    return await prisma.atleta.findMany({
      where: {
        genero: criterios.genero,
        disciplina: criterios.disciplina,
        somatotipo: criterios.somatotipo,
        altura: {
          gte: criterios.alturaMin,
          lte: criterios.alturaMax,
        },
        peso: {
          gte: criterios.pesoMin,
          lte: criterios.pesoMax,
        },
        edad: {
          gte: criterios.edadMin,
          lte: criterios.edadMax,
        },
      },
    })
  }

  /**
   * Compara un atleta con su cohorte
   * Placeholder: lógica de comparación estadística pendiente
   */
  static async compararConCohorte(atletaId: number): Promise<ResultadoComparacion> {
    // Obtener el atleta
    const atleta = await prisma.atleta.findUnique({
      where: { id: atletaId },
    })

    if (!atleta) {
      throw new Error('Atleta no encontrado')
    }

    // Generar criterios y buscar cohorte
    const criterios = this.generarCriterios(atleta)
    const cohorte = await this.buscarCohorte(criterios)

    // Placeholder: Aquí iría la lógica de comparación estadística
    // Por ahora retornamos un resultado de ejemplo
    return {
      estadoGeneral: 'Promedio',
      puntosDebiles: [
        'Fuerza explosiva',
        'Flexibilidad',
        'Resistencia anaeróbica',
      ],
      margenMejoraAbsoluto: 15.5,
      margenMejoraPorcentual: 12.3,
      atletasComparados: cohorte.length,
    }
  }
}
