import { IoClose, IoFootball } from 'react-icons/io5'
import { translateBodyType } from '../utils/translations'
import { usePentagonChart, usePentagonGuideLines, usePentagonRadialLines } from '../hooks/usePentagonChart'
import '../styles/AtletaModal.css'

interface AtletaModalProps {
  atleta: {
    id: number
    nombre: string
    foto: string
    deporte: string
    edad: number
    nacionalidad?: string
    altura?: number
    peso?: number
    club: string
    somatotipo?: string
    codigoAcceso?: string
    capacidades: {
      potencia: number
      fuerza: number
      velocidad: number
      flexibilidad: number
      resistencia: number
    }
  } | null
  onClose: () => void
}

function AtletaModal({ atleta, onClose }: AtletaModalProps) {
  // Pentagon chart configuration
  const chartConfig = { centerX: 170, centerY: 170, maxRadius: 100, labelOffset: 30 }
  
  // Always call hooks unconditionally - use default values if atleta is null
  const defaultCapacidades = { potencia: 0, fuerza: 0, velocidad: 0, flexibilidad: 0, resistencia: 0 }
  const pentagonData = usePentagonChart(atleta?.capacidades || defaultCapacidades, chartConfig)
  const guideLines = usePentagonGuideLines(chartConfig)
  const radialLines = usePentagonRadialLines(chartConfig)

  // Early return AFTER all hooks
  if (!atleta) return null

  const promedio = Math.round(
    (atleta.capacidades.potencia +
      atleta.capacidades.fuerza +
      atleta.capacidades.velocidad +
      atleta.capacidades.flexibilidad +
      atleta.capacidades.resistencia) / 5
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <IoClose />
        </button>

        <div className="modal-header">
          <div className="modal-image-container">
            <img src={atleta.foto} alt={atleta.nombre} className="modal-image" />
            <div className="modal-deporte-badge">
              <IoFootball /> {atleta.deporte}
            </div>
          </div>

          <div className="modal-info">
            <h2 className="modal-nombre">{atleta.nombre}</h2>
            <p className="modal-club">{atleta.club}</p>
            <div className="modal-overall">
              <span className="overall-label">Overall</span>
              <span className="overall-value">{promedio}</span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h3 className="section-title">Información Personal</h3>
            <div className="info-grid">
              {atleta.codigoAcceso && (
                <div className="info-item">
                  <span className="info-label">Código de Acceso</span>
                  <span className="info-value codigo-acceso">{atleta.codigoAcceso}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Edad</span>
                <span className="info-value">{atleta.edad} años</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nacionalidad</span>
                <span className="info-value">{atleta.nacionalidad || 'No especificado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Altura</span>
                <span className="info-value">{atleta.altura || 'N/A'} cm</span>
              </div>
              <div className="info-item">
                <span className="info-label">Peso</span>
                <span className="info-value">{atleta.peso || 'N/A'} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Somatotipo</span>
                <span className="info-value">{atleta.somatotipo ? translateBodyType(atleta.somatotipo) : 'No especificado'}</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3 className="section-title">Capacidades Físicas</h3>
            <div className="chart-container">
              <svg width="340" height="340" viewBox="0 0 340 340">
                {/* Guide lines (20%, 40%, 60%, 80%, 100%) */}
                {guideLines.map((path, idx) => (
                  <polygon
                    key={`guide-${idx}`}
                    points={path}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                  />
                ))}

                {/* Radial lines from center to vertices */}
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

                {/* Athlete data polygon */}
                <polygon
                  points={pentagonData.pointsPath}
                  fill="rgba(20, 184, 166, 0.3)"
                  stroke="#14b8a6"
                  strokeWidth="2"
                />
                
                {/* Points at vertices */}
                {pentagonData.points.map((point, idx) => (
                  <circle
                    key={`point-${idx}`}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#14b8a6"
                  />
                ))}

                {/* Labels and values */}
                {pentagonData.points.map((point, idx) => (
                  <g key={`label-${idx}`}>
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
                    <text
                      x={point.labelX}
                      y={point.labelY + 10}
                      textAnchor="middle"
                      fill="#14b8a6"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      {point.valor}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AtletaModal
