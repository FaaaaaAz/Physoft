import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { IoCalendar, IoBody, IoTrophy, IoTrendingUp, IoResize, IoBarbell, IoMan, IoEye, IoDownload, IoTrash } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import { BreadcrumbItem } from '../components/Breadcrumb'
import '../styles/DetalleAtleta.css'

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

function DetalleAtleta() {
  const navigate = useNavigate()
  const location = useLocation()
  const atleta = location.state?.atleta as AtletaData
  const from = location.state?.from || 'todos-analisis'

  // Scroll to top cuando el componente se monta
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!atleta) {
    navigate(-1)
    return null
  }

  const calcularPuntosPentagono = () => {
    const capacidades = [
      { nombre: 'Potencia', valor: atleta.capacidades.potencia },
      { nombre: 'Fuerza', valor: atleta.capacidades.fuerza },
      { nombre: 'Velocidad', valor: atleta.capacidades.velocidad },
      { nombre: 'Flexibilidad', valor: atleta.capacidades.flexibilidad },
      { nombre: 'Resistencia', valor: atleta.capacidades.resistencia }
    ]

    const centerX = 150
    const centerY = 150
    const maxRadius = 120

    return capacidades.map((cap, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
      const radius = (cap.valor / 100) * maxRadius
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      
      const labelRadius = maxRadius + 30
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
  }

  const puntos = calcularPuntosPentagono()
  const puntosPath = puntos.map(p => `${p.x},${p.y}`).join(' ')
  const backgroundPath = puntos.map((_, i) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
    const x = 150 + 120 * Math.cos(angle)
    const y = 150 + 120 * Math.sin(angle)
    return `${x},${y}`
  }).join(' ')

  const getBadgeClass = (clasificacion: string) => {
    if (clasificacion === 'Encima del Promedio') return 'badge-encima'
    if (clasificacion === 'Promedio') return 'badge-promedio'
    return 'badge-debajo'
  }

  const handleVerAnalisis = (analisisId: number) => {
    console.log('Ver análisis:', analisisId)
    // Aquí irá la lógica para ver el análisis
  }

  const handleDescargarAnalisis = (analisisId: number) => {
    console.log('Descargar análisis:', analisisId)
    // Aquí irá la lógica para descargar el análisis
  }

  const handleEliminarAnalisis = (analisisId: number) => {
    console.log('Eliminar análisis:', analisisId)
    // Aquí irá la lógica para eliminar el análisis
  }

  const ultimaClasificacion = atleta.analisis[0]?.clasificacion || 'N/A'

  // Breadcrumb dinámico según origen
  const breadcrumbItems: BreadcrumbItem[] = from === 'todos-analisis' 
    ? [
        { label: 'Análisis', path: '/analisis' },
        { label: 'Todos los Análisis', path: '/todos-analisis' },
        { label: atleta.nombre }
      ]
    : [
        { label: 'Análisis', path: '/analisis' },
        { label: atleta.nombre }
      ]

  return (
    <PageTemplate 
      title={`Detalle de ${atleta.nombre}`}
      showBackButton={true}
      backTo={from === 'analisis' ? '/analisis' : '/todos-analisis'}
      breadcrumbItems={breadcrumbItems}
    >
      <div className="detalle-atleta-container">
        {/* Header con información básica */}
        <div className="detalle-header">
          <div className="detalle-header-left">
            <div className="detalle-avatar">
              {atleta.foto ? (
                <img src={atleta.foto} alt={atleta.nombre} />
              ) : (
                <div className="detalle-avatar-placeholder">
                  {atleta.nombre.charAt(0)}
                </div>
              )}
            </div>
            <div className="detalle-info-principal">
              <h1 className="detalle-nombre">{atleta.nombre}</h1>
              <p className="detalle-posicion-club">{atleta.posicion} • {atleta.club}</p>
              <p className="detalle-codigo">#{atleta.codigoAcceso}</p>
            </div>
          </div>
        </div>

        {/* Tarjetas de información */}
        <div className="detalle-info-cards">
          <div className="detalle-info-card">
            <IoCalendar className="card-icon" />
            <div className="card-content">
              <span className="card-label">EDAD</span>
              <span className="card-value">{atleta.edad} años</span>
            </div>
          </div>

          <div className="detalle-info-card">
            <IoMan className="card-icon" />
            <div className="card-content">
              <span className="card-label">SOMATIPO</span>
              <span className="card-value-small">{atleta.somatipo || 'N/A'}</span>
            </div>
          </div>

          <div className="detalle-info-card">
            <IoResize className="card-icon" />
            <div className="card-content">
              <span className="card-label">ALTURA</span>
              <span className="card-value">{atleta.altura ? `${atleta.altura} cm` : 'N/A'}</span>
            </div>
          </div>

          <div className="detalle-info-card">
            <IoBarbell className="card-icon" />
            <div className="card-content">
              <span className="card-label">PESO</span>
              <span className="card-value">{atleta.peso ? `${atleta.peso} kg` : 'N/A'}</span>
            </div>
          </div>

          <div className="detalle-info-card">
            <IoBody className="card-icon" />
            <div className="card-content">
              <span className="card-label">TOTAL ANÁLISIS</span>
              <span className="card-value">{atleta.analisis.length}</span>
            </div>
          </div>

          <div className="detalle-info-card">
            <IoTrophy className="card-icon" />
            <div className="card-content">
              <span className="card-label">ÚLTIMA CLASIFICACIÓN</span>
              <span className={`badge ${getBadgeClass(ultimaClasificacion)}`}>
                {ultimaClasificacion}
              </span>
            </div>
          </div>
        </div>

        {/* Capacidades Físicas Actuales */}
        <div className="detalle-section">
          <h2 className="section-title">
            <IoBody />
            Capacidades Físicas Actuales
          </h2>
          <div className="pentagon-chart-container">
            <svg width="100%" height="100%" viewBox="0 0 300 320" preserveAspectRatio="xMidYMid meet">
              {/* Guías del pentágono */}
              <polygon
                points={backgroundPath}
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
              
              {/* Pentágono de capacidades */}
              <polygon
                points={puntosPath}
                fill="rgba(20, 184, 166, 0.3)"
                stroke="var(--primary-color)"
                strokeWidth="3"
                strokeLinejoin="round"
              />

              {/* Puntos y etiquetas */}
              {puntos.map((punto, i) => (
                <g key={i}>
                  {/* Punto */}
                  <circle
                    cx={punto.x}
                    cy={punto.y}
                    r="6"
                    fill="var(--primary-color)"
                    stroke="#0a0a0a"
                    strokeWidth="2"
                  />
                  
                  {/* Fondo para la etiqueta */}
                  <rect
                    x={punto.labelX - 45}
                    y={punto.labelY - 25}
                    width="90"
                    height="40"
                    fill="rgba(0, 0, 0, 0.7)"
                    rx="6"
                    stroke="rgba(20, 184, 166, 0.3)"
                    strokeWidth="1"
                  />
                  
                  {/* Etiqueta */}
                  <text
                    x={punto.labelX}
                    y={punto.labelY - 8}
                    textAnchor="middle"
                    fill="white"
                    fontSize="15"
                    fontWeight="700"
                  >
                    {punto.nombre}
                  </text>
                  
                  {/* Valor */}
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

              {/* Líneas desde el centro a cada vértice */}
              {puntos.map((_, i) => {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
                const maxX = 150 + 120 * Math.cos(angle)
                const maxY = 150 + 120 * Math.sin(angle)
                return (
                  <line
                    key={`line-${i}`}
                    x1="150"
                    y1="150"
                    x2={maxX}
                    y2={maxY}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                  />
                )
              })}
            </svg>
          </div>
        </div>

        {/* Timeline de Mejoría */}
        <div className="detalle-section">
          <h2 className="section-title">
            <IoTrendingUp />
            Timeline de Mejoría - 2025
          </h2>
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
        <div className="detalle-section">
          <h2 className="section-title">
            <IoCalendar />
            Historial de Análisis
          </h2>
          <div className="historial-table-container">
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Evaluador</th>
                  <th>Clasificación</th>
                  <th>Punto Débil</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {atleta.analisis.map((analisis) => (
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
                      <div className="historial-actions">
                        <button 
                          className="action-btn action-btn-view"
                          onClick={() => handleVerAnalisis(analisis.id)}
                          title="Ver detalles"
                        >
                          <IoEye />
                        </button>
                        <button 
                          className="action-btn action-btn-download"
                          onClick={() => handleDescargarAnalisis(analisis.id)}
                          title="Descargar"
                        >
                          <IoDownload />
                        </button>
                        <button 
                          className="action-btn action-btn-delete"
                          onClick={() => handleEliminarAnalisis(analisis.id)}
                          title="Eliminar"
                        >
                          <IoTrash />
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
    </PageTemplate>
  )
}

export default DetalleAtleta
