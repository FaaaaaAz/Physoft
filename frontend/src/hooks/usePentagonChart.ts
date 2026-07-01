import { useMemo } from 'react'

export interface Capacidades {
  potencia: number
  fuerza: number
  velocidad: number
  flexibilidad: number
  resistencia: number
}

export interface PentagonPoint {
  x: number
  y: number
  labelX: number
  labelY: number
  nombre: string
  valor: number
}

export interface PentagonChartConfig {
  centerX?: number
  centerY?: number
  maxRadius?: number
  labelOffset?: number
}

/**
 * Custom hook to calculate pentagon chart points for physical capacities
 * @param {Capacidades} capacidades - Physical capacities object with 5 values (0-100)
 * @param {PentagonChartConfig} config - Optional configuration for chart dimensions
 * @returns {PentagonPoint[]} Array of 5 points with coordinates and labels
 */
export const usePentagonChart = (
  capacidades: Capacidades,
  config: PentagonChartConfig = {}
): {
  points: PentagonPoint[]
  pointsPath: string
  backgroundPath: string
} => {
  const {
    centerX = 150,
    centerY = 150,
    maxRadius = 120,
    labelOffset = 30
  } = config

  const result = useMemo(() => {
    const caps = [
      { nombre: 'Power', valor: capacidades.potencia },
      { nombre: 'Strength', valor: capacidades.fuerza },
      { nombre: 'Speed', valor: capacidades.velocidad },
      { nombre: 'Flexibility', valor: capacidades.flexibilidad },
      { nombre: 'Endurance', valor: capacidades.resistencia }
    ]

    // Calculate points for actual values
    const points = caps.map((cap, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
      const radius = (cap.valor / 100) * maxRadius
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      
      const labelRadius = maxRadius + labelOffset
      const labelX = centerX + labelRadius * Math.cos(angle)
      const labelY = centerY + labelRadius * Math.sin(angle)
      
      return {
        x,
        y,
        labelX,
        labelY,
        nombre: cap.nombre,
        valor: cap.valor
      }
    })

    // Generate SVG path for points
    const pointsPath = points.map(p => `${p.x},${p.y}`).join(' ')

    // Generate background pentagon path (100% values)
    const backgroundPath = Array.from({ length: 5 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
      const x = centerX + maxRadius * Math.cos(angle)
      const y = centerY + maxRadius * Math.sin(angle)
      return `${x},${y}`
    }).join(' ')

    return { points, pointsPath, backgroundPath }
  }, [capacidades, centerX, centerY, maxRadius, labelOffset])

  return result
}

/**
 * Helper hook to generate guide lines for pentagon chart (20%, 40%, 60%, 80%, 100%)
 * @param {PentagonChartConfig} config - Chart configuration
 * @returns {string[]} Array of SVG paths for guide lines
 */
export const usePentagonGuideLines = (config: PentagonChartConfig = {}): string[] => {
  const {
    centerX = 150,
    centerY = 150,
    maxRadius = 120
  } = config

  return useMemo(() => {
    const levels = [20, 40, 60, 80, 100]
    
    return levels.map(level => {
      const radius = (level / 100) * maxRadius
      const points = Array.from({ length: 5 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        return `${x},${y}`
      })
      return points.join(' ')
    })
  }, [centerX, centerY, maxRadius])
}

/**
 * Helper hook to generate radial lines from center to each vertex
 * @param {PentagonChartConfig} config - Chart configuration
 * @returns Array of line coordinates {x1, y1, x2, y2}
 */
export const usePentagonRadialLines = (config: PentagonChartConfig = {}): Array<{
  x1: number
  y1: number
  x2: number
  y2: number
}> => {
  const {
    centerX = 150,
    centerY = 150,
    maxRadius = 120
  } = config

  return useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
      return {
        x1: centerX,
        y1: centerY,
        x2: centerX + maxRadius * Math.cos(angle),
        y2: centerY + maxRadius * Math.sin(angle)
      }
    })
  }, [centerX, centerY, maxRadius])
}
