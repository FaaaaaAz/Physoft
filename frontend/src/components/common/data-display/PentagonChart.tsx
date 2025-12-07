import './PentagonChart.css'

export interface Capacidades {
  potencia: number
  fuerza: number
  velocidad: number
  flexibilidad: number
  resistencia: number
}

interface PentagonChartProps {
  capacidades: Capacidades
  size?: number
  showLabels?: boolean
  showValues?: boolean
  color?: string
  className?: string
}

/**
 * Componente de gráfico de pentágono para capacidades físicas
 * Usado en: AtletaModal.tsx, AnalysisView.tsx, DetalleAtleta.tsx
 */
function PentagonChart({
  capacidades,
  size = 340,
  showLabels = true,
  showValues = true,
  color = '#14b8a6',
  className = ''
}: PentagonChartProps) {
  const centerX = size / 2
  const centerY = size / 2
  const maxRadius = (size * 0.35)
  const labelOffset = maxRadius + (size * 0.1)

  // Etiquetas en orden del pentágono
  const labels = [
    { key: 'potencia', nombre: 'Potencia' },
    { key: 'velocidad', nombre: 'Velocidad' },
    { key: 'flexibilidad', nombre: 'Flexibilidad' },
    { key: 'resistencia', nombre: 'Resistencia' },
    { key: 'fuerza', nombre: 'Fuerza' }
  ]

  // Calcular puntos del pentágono
  const calculatePoint = (index: number, value: number, radius: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2
    const scale = value / 100
    return {
      x: centerX + Math.cos(angle) * radius * scale,
      y: centerY + Math.sin(angle) * radius * scale
    }
  }

  // Calcular punto para etiqueta
  const calculateLabelPoint = (index: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2
    return {
      x: centerX + Math.cos(angle) * labelOffset,
      y: centerY + Math.sin(angle) * labelOffset
    }
  }

  // Generar puntos de datos
  const dataPoints = labels.map((label, index) => {
    const value = capacidades[label.key as keyof Capacidades]
    const point = calculatePoint(index, value, maxRadius)
    const labelPoint = calculateLabelPoint(index)
    return {
      ...point,
      labelX: labelPoint.x,
      labelY: labelPoint.y,
      nombre: label.nombre,
      valor: value
    }
  })

  // Generar path para el polígono de datos
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z'

  // Generar líneas guía (20%, 40%, 60%, 80%, 100%)
  const guideLines = [0.2, 0.4, 0.6, 0.8, 1.0].map(scale => {
    const points = labels.map((_, index) => {
      const point = calculatePoint(index, 100, maxRadius * scale)
      return `${point.x},${point.y}`
    })
    return points.join(' ')
  })

  // Generar líneas radiales
  const radialLines = labels.map((_, index) => {
    const outer = calculatePoint(index, 100, maxRadius)
    return {
      x1: centerX,
      y1: centerY,
      x2: outer.x,
      y2: outer.y
    }
  })

  return (
    <div className={`pentagon-chart ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Líneas guía (20%, 40%, 60%, 80%, 100%) */}
        {guideLines.map((path, idx) => (
          <polygon
            key={`guide-${idx}`}
            points={path}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Líneas radiales desde el centro */}
        {radialLines.map((line, idx) => (
          <line
            key={`radial-${idx}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Polígono de datos del atleta */}
        <path
          d={dataPath}
          fill={`${color}33`}
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Puntos en los vértices */}
        {dataPoints.map((point, idx) => (
          <circle
            key={`point-${idx}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={color}
          />
        ))}

        {/* Etiquetas y valores */}
        {(showLabels || showValues) && dataPoints.map((point, idx) => (
          <g key={`label-${idx}`}>
            {showLabels && (
              <text
                x={point.labelX}
                y={point.labelY - 10}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.7)"
                fontSize="12"
                fontWeight="bold"
              >
                {point.nombre}
              </text>
            )}
            {showValues && (
              <text
                x={point.labelX}
                y={point.labelY + 10}
                textAnchor="middle"
                fill={color}
                fontSize="14"
                fontWeight="bold"
              >
                {point.valor}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

export default PentagonChart
