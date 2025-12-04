import { IoClose, IoCalendar, IoBody, IoTrophy, IoTrendingUp, IoResize, IoBarbell, IoMan } from 'react-icons/io5'
import { usePentagonChart, usePentagonGuideLines, usePentagonRadialLines } from '../hooks/usePentagonChart'
import '../styles/AtletaAnalisisModal.css'

interface Analisis {
  id: number
  fecha: string
  evaluador: string
  clasificacion: 'Encima del Promedio' | 'Promedio' | 'Debajo del Promedio'
  puntoDebil: string
  capacidades?: {
    velocidad: number
    resistencia: number
    fuerza: number
    potencia: number
    flexibilidad: number
  }
}

interface AtletaData {
  nombre: string
  foto?: string
  edad: number
  posicion: string
  club: string
  codigoAcceso: string
  somatipo?: string
  altura?: number
  peso?: number
  capacidades: {
    velocidad: number
    resistencia: number
    fuerza: number
    potencia: number
    flexibilidad: number
  }
  analisis: Analisis[]
}

interface AtletaAnalisisModalProps {
  atleta: AtletaData
  onClose: () => void
  onVerAnalisis?: (analisisId: number) => void
  onDescargarAnalisis?: (analisisId: number) => void
}

function AtletaAnalisisModal({ atleta, onClose, onVerAnalisis, onDescargarAnalisis }: AtletaAnalisisModalProps) {
  const getBadgeClass = (clasificacion: string) => {
    if (clasificacion === 'Encima del Promedio') return 'badge-encima'
    if (clasificacion === 'Promedio') return 'badge-promedio'
    return 'badge-debajo'
  }

  // Pentagon chart configuration
  const chartConfig = { centerX: 150, centerY: 150, maxRadius: 120, labelOffset: 35 }
  const pentagonData = usePentagonChart(atleta.capacidades, chartConfig)
  const guideLines = usePentagonGuideLines(chartConfig)
  const radialLines = usePentagonRadialLines(chartConfig)


  return (
    <div className="modal-overlay-analisis" onClick={onClose}>
      <div className="modal-content-analisis" onClick={(e) => e.stopPropagation()}>
        {/* Header del Modal */}
        <div className="modal-header-analisis">
          <div className="modal-header-info">
            <div className="atleta-foto-grande">
              {atleta.foto ? (
                <img src={atleta.foto} alt={atleta.nombre} />
              ) : (
                <span className="atleta-inicial-grande">{atleta.nombre.charAt(0)}</span>
              )}
            </div>
            <div>
              <h2 className="modal-title-analisis">{atleta.nombre}</h2>
              <div className="modal-subtitle-analisis">
                <span>{atleta.posicion} • {atleta.club}</span>
                <span className="codigo-badge">#{atleta.codigoAcceso}</span>
              </div>
            </div>
          </div>
          <button className="modal-close-analisis" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        {/* Info Cards */}
        <div className="info-cards-grid">
          <div className="info-card-small">
            <IoCalendar className="info-icon" />
            <div>
              <p className="info-label">Edad</p>
              <p className="info-value">{atleta.edad} años</p>
            </div>
          </div>
          <div className="info-card-small">
            <IoMan className="info-icon" />
            <div>
              <p className="info-label">Somatipo</p>
              <p className="info-value">{atleta.somatipo || 'N/A'}</p>
            </div>
          </div>
          <div className="info-card-small">
            <IoResize className="info-icon" />
            <div>
              <p className="info-label">Altura</p>
              <p className="info-value">{atleta.altura ? `${atleta.altura} cm` : 'N/A'}</p>
            </div>
          </div>
          <div className="info-card-small">
            <IoBarbell className="info-icon" />
            <div>
              <p className="info-label">Peso</p>
              <p className="info-value">{atleta.peso ? `${atleta.peso} kg` : 'N/A'}</p>
            </div>
          </div>
          <div className="info-card-small">
            <IoTrophy className="info-icon" />
            <div>
              <p className="info-label">Total Análisis</p>
              <p className="info-value">{atleta.analisis.length}</p>
            </div>
          </div>
          <div className="info-card-small">
            <IoBody className="info-icon" />
            <div>
              <p className="info-label">Última Clasificación</p>
              <p className="info-value-small">{atleta.analisis[0]?.clasificacion || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Capacidades Físicas */}
        <div className="capacidades-section">
          <h3 className="section-title-modal">
            <IoTrendingUp />
            Capacidades Físicas Actuales
          </h3>
          <div className="pentagon-chart-container">
            <svg width="300" height="300" viewBox="0 0 300 300">
              {/* Guide lines (20%, 40%, 60%, 80%, 100%) */}
              {guideLines.map((path, idx) => {
                const nivel = [20, 40, 60, 80, 100][idx]
                return (
                  <polygon
                    key={`guide-${nivel}`}
                    points={path}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                  />
                )
              })}

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

              {/* Background pentagon (outline) */}
              <polygon
                points={pentagonData.backgroundPath}
                fill="none"
                stroke="rgba(20, 184, 166, 0.3)"
                strokeWidth="2"
              />

              {/* Athlete data pentagon */}
              <polygon
                points={pentagonData.pointsPath}
                fill="rgba(20, 184, 166, 0.2)"
                stroke="var(--primary-color)"
                strokeWidth="2.5"
              />

              {/* Points at vertices */}
              {pentagonData.points.map((punto, index) => (
                <circle
                  key={`point-${index}`}
                  cx={punto.x}
                  cy={punto.y}
                  r="5"
                  fill="var(--primary-color)"
                  stroke="#0a0a0a"
                  strokeWidth="2"
                />
              ))}

              {/* Labels and values */}
              {pentagonData.points.map((punto, index) => (
                <g key={`label-${index}`}>
                  <text
                    x={punto.labelX}
                    y={punto.labelY - 8}
                    textAnchor="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="700"
                  >
                    {punto.nombre}
                  </text>
                  <text
                    x={punto.labelX}
                    y={punto.labelY + 10}
                    textAnchor="middle"
                    fill="var(--primary-color)"
                    fontSize="16"
                    fontWeight="700"
                  >
                    {punto.valor}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Timeline de Mejoría */}
        <div className="timeline-section">
          <h3 className="section-title-modal">
            <IoTrendingUp />
            Timeline de Mejoría - 2025
          </h3>
          <div className="abilities-timeline-container">
            <svg width="100%" height="300" viewBox="0 0 900 300" preserveAspectRatio="xMidYMid meet">
              {/* Grid horizontal lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={`grid-${y}`}
                  x1="60"
                  y1={260 - (y * 2)}
                  x2="840"
                  y2={260 - (y * 2)}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
              ))}

              {/* Y-axis labels */}
              {[0, 25, 50, 75, 100].map((value) => (
                <text
                  key={`y-label-${value}`}
                  x="45"
                  y={265 - (value * 2)}
                  fill="rgba(255, 255, 255, 0.5)"
                  fontSize="11"
                  textAnchor="end"
                >
                  {value}
                </text>
              ))}

              {/* X-axis labels (meses) */}
              {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((mes, index) => (
                <text
                  key={`x-label-${mes}`}
                  x={60 + (index * 65)}
                  y="285"
                  fill="rgba(255, 255, 255, 0.5)"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {mes}
                </text>
              ))}

              {/* Líneas de capacidades */}
              {atleta.analisis.length > 1 && atleta.analisis[0].capacidades && (
                <>
                  {/* Fuerza - Rojo */}
                  <polyline
                    points={atleta.analisis.slice(0, 5).reverse().map((a, i) => 
                      `${60 + (i * 195)},${260 - (a.capacidades?.fuerza || 0) * 2}`
                    ).join(' ')}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {atleta.analisis.slice(0, 5).reverse().map((a, i) => (
                    <circle
                      key={`fuerza-${i}`}
                      cx={60 + (i * 195)}
                      cy={260 - (a.capacidades?.fuerza || 0) * 2}
                      r="5"
                      fill="#ef4444"
                      stroke="#0a0a0a"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Velocidad - Cyan */}
                  <polyline
                    points={atleta.analisis.slice(0, 5).reverse().map((a, i) => 
                      `${60 + (i * 195)},${260 - (a.capacidades?.velocidad || 0) * 2}`
                    ).join(' ')}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {atleta.analisis.slice(0, 5).reverse().map((a, i) => (
                    <circle
                      key={`velocidad-${i}`}
                      cx={60 + (i * 195)}
                      cy={260 - (a.capacidades?.velocidad || 0) * 2}
                      r="5"
                      fill="#06b6d4"
                      stroke="#0a0a0a"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Resistencia - Verde */}
                  <polyline
                    points={atleta.analisis.slice(0, 5).reverse().map((a, i) => 
                      `${60 + (i * 195)},${260 - (a.capacidades?.resistencia || 0) * 2}`
                    ).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {atleta.analisis.slice(0, 5).reverse().map((a, i) => (
                    <circle
                      key={`resistencia-${i}`}
                      cx={60 + (i * 195)}
                      cy={260 - (a.capacidades?.resistencia || 0) * 2}
                      r="5"
                      fill="#10b981"
                      stroke="#0a0a0a"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Flexibilidad - Amarillo */}
                  <polyline
                    points={atleta.analisis.slice(0, 5).reverse().map((a, i) => 
                      `${60 + (i * 195)},${260 - (a.capacidades?.flexibilidad || 0) * 2}`
                    ).join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {atleta.analisis.slice(0, 5).reverse().map((a, i) => (
                    <circle
                      key={`flexibilidad-${i}`}
                      cx={60 + (i * 195)}
                      cy={260 - (a.capacidades?.flexibilidad || 0) * 2}
                      r="5"
                      fill="#f59e0b"
                      stroke="#0a0a0a"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Potencia - Morado */}
                  <polyline
                    points={atleta.analisis.slice(0, 5).reverse().map((a, i) => 
                      `${60 + (i * 195)},${260 - (a.capacidades?.potencia || 0) * 2}`
                    ).join(' ')}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {atleta.analisis.slice(0, 5).reverse().map((a, i) => (
                    <circle
                      key={`potencia-${i}`}
                      cx={60 + (i * 195)}
                      cy={260 - (a.capacidades?.potencia || 0) * 2}
                      r="5"
                      fill="#a855f7"
                      stroke="#0a0a0a"
                      strokeWidth="2"
                    />
                  ))}
                </>
              )}
            </svg>

            {/* Leyenda */}
            <div className="abilities-legend">
              <div className="legend-item-ability">
                <div className="legend-line" style={{ backgroundColor: '#ef4444' }}></div>
                <span>Fuerza</span>
              </div>
              <div className="legend-item-ability">
                <div className="legend-line" style={{ backgroundColor: '#06b6d4' }}></div>
                <span>Velocidad</span>
              </div>
              <div className="legend-item-ability">
                <div className="legend-line" style={{ backgroundColor: '#10b981' }}></div>
                <span>Resistencia</span>
              </div>
              <div className="legend-item-ability">
                <div className="legend-line" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>Flexibilidad</span>
              </div>
              <div className="legend-item-ability">
                <div className="legend-line" style={{ backgroundColor: '#a855f7' }}></div>
                <span>Potencia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historial de Análisis */}
        <div className="historial-section">
          <h3 className="section-title-modal">Historial de Análisis</h3>
          <div className="analisis-table-container-modal">
            <table className="analisis-table-modal">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Evaluador</th>
                  <th>Clasificación</th>
                  <th>Principal Punto Débil</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {atleta.analisis.map(analisis => (
                  <tr key={analisis.id}>
                    <td>{new Date(analisis.fecha).toLocaleDateString('es-ES')}</td>
                    <td>{analisis.evaluador}</td>
                    <td>
                      <span className={`badge ${getBadgeClass(analisis.clasificacion)}`}>
                        {analisis.clasificacion}
                      </span>
                    </td>
                    <td>{analisis.puntoDebil}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-icon-small" 
                          title="Ver análisis"
                          onClick={() => onVerAnalisis?.(analisis.id)}
                        >
                          👁️
                        </button>
                        <button 
                          className="btn-icon-small" 
                          title="Descargar análisis"
                          onClick={() => onDescargarAnalisis?.(analisis.id)}
                        >
                          📥
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AtletaAnalisisModal
