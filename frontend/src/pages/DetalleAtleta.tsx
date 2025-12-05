import { IoCalendar, IoBody, IoTrophy, IoTrendingUp, IoResize, IoBarbell, IoMan, IoEye, IoDownload, IoTrash, IoChevronForward } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import { BreadcrumbItem } from '../components/Breadcrumb'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { athleteAPI, analysisAPI, Athlete, Analysis } from '../services/api'
import { usePentagonChart, usePentagonGuideLines, usePentagonRadialLines } from '../hooks/usePentagonChart'
import '../styles/DetalleAtleta.css'

function DetalleAtleta() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const from = location.state?.from || 'all-analysis'
  
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // Scroll to top cuando el componente se monta
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (id) {
      loadAthleteData(id)
    }
  }, [id])

  const loadAthleteData = async (athleteId: string) => {
    try {
      setIsLoading(true)
      setError('')
      
      const [athleteResponse, analysesResponse] = await Promise.all([
        athleteAPI.getById(athleteId),
        analysisAPI.getAll({ athleteId })
      ])
      
      setAthlete(athleteResponse.data)
      setAnalyses(analysesResponse.data.sort((a, b) => 
        new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime()
      ))
    } catch (err) {
      console.error('Error loading athlete data:', err)
      setError('Error al cargar los datos del atleta')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate latest capacities from most recent analysis (before early returns for hooks)
  const latestAnalysis = analyses[0]
  const capacidades = latestAnalysis ? {
    potencia: latestAnalysis.power || 0,
    fuerza: latestAnalysis.strength || 0,
    velocidad: latestAnalysis.speed || 0,
    flexibilidad: latestAnalysis.flexibility || 0,
    resistencia: latestAnalysis.endurance || 0
  } : {
    potencia: 0,
    fuerza: 0,
    velocidad: 0,
    flexibilidad: 0,
    resistencia: 0
  }

  // Pentagon chart using custom hook - MUST be called before any conditional returns
  const chartConfig = { centerX: 150, centerY: 150, maxRadius: 120, labelOffset: 30 }
  const pentagonData = usePentagonChart(capacidades, chartConfig)
  const guideLines = usePentagonGuideLines(chartConfig)
  const radialLines = usePentagonRadialLines(chartConfig)

  // Early returns AFTER all hooks
  if (isLoading) {
    return (
      <PageTemplate title="Cargando..." showBackButton={true} backTo="/all-analysis">
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-primary)' }}>
          <p>Cargando datos del atleta...</p>
        </div>
      </PageTemplate>
    )
  }

  if (error || !athlete) {
    return (
      <PageTemplate title="Error" showBackButton={true} backTo="/all-analysis">
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-primary)' }}>
          <p>{error || 'Atleta no encontrado'}</p>
        </div>
      </PageTemplate>
    )
  }

  const getClassificationLabel = (classification: string | null | undefined) => {
    if (classification === 'high') return 'Encima del Promedio'
    if (classification === 'medium') return 'Promedio'
    if (classification === 'low') return 'Debajo del Promedio'
    return 'N/A'
  }

  const getBadgeClass = (classification: string | null | undefined) => {
    if (classification === 'high') return 'badge-encima'
    if (classification === 'medium') return 'badge-promedio'
    if (classification === 'low') return 'badge-debajo'
    return 'badge-promedio'
  }

  const handleVerAnalisis = (analisisId: number) => {
    navigate(`/analysis-view/${analisisId}`)
  }

  const calculateAge = (birthDate: string | null | undefined): number => {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const edad = calculateAge(athlete.birthDate)
  const ultimaClasificacion = latestAnalysis?.globalClassification

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
      title={`Detalle de ${athlete.name}`}
      showBackButton={true}
      backTo={from === 'analysis' ? '/analysis' : '/all-analysis'}
      breadcrumbItems={breadcrumbItems}
    >
      <div className="detalle-atleta-container">
        {/* Header con información básica */}
        <div className="detalle-header">
          <div className="detalle-header-left">
            <div className="detalle-avatar">
              {athlete.photo ? (
                <img src={athlete.photo} alt={athlete.name} />
              ) : (
                <div className="detalle-avatar-placeholder">
                  {athlete.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="detalle-info-principal">
              <h1 className="detalle-nombre">{athlete.name}</h1>
              <p className="detalle-posicion-club">{athlete.position || 'N/A'} • {athlete.club || 'N/A'}</p>
              <p className="detalle-codigo">#{athlete.accessCode}</p>
            </div>
          </div>
        </div>

        {/* Tarjetas de información */}
        <div className="detalle-info-cards">
          <div className="detalle-info-card">
            <IoCalendar className="card-icon" />
            <div className="card-content">
              <span className="card-label">EDAD</span>
              <span className="card-value">{edad > 0 ? `${edad} años` : 'N/A'}</span>
            </div>
          </div>

          <div className="detalle-info-card">
            <IoMan className="card-icon" />
            <div className="card-content">
              <span className="card-label">SOMATIPO</span>
              <span className="card-value-small">{athlete.bodyType || 'N/A'}</span>
            </div>
          </div>

          <div className="detalle-info-card">
            <IoResize className="card-icon" />
            <div className="card-content">
              <span className="card-label">ALTURA</span>
              <span className="card-value">{athlete.height ? `${athlete.height} cm` : 'N/A'}</span>
            </div>
          </div>

          <div className="detalle-info-card">
            <IoBarbell className="card-icon" />
            <div className="card-content">
              <span className="card-label">PESO</span>
              <span className="card-value">{athlete.weight ? `${athlete.weight} kg` : 'N/A'}</span>
            </div>
          </div>

          <div className="detalle-info-card">
            <IoBody className="card-icon" />
            <div className="card-content">
              <span className="card-label">TOTAL ANÁLISIS</span>
              <span className="card-value">{analyses.length}</span>
            </div>
          </div>

          <div className="detalle-info-card">
            <IoTrophy className="card-icon" />
            <div className="card-content">
              <span className="card-label">ÚLTIMA CLASIFICACIÓN</span>
              <span className={`badge ${getBadgeClass(ultimaClasificacion)}`}>
                {getClassificationLabel(ultimaClasificacion)}
              </span>
            </div>
          </div>
        </div>

        {/* Capacidades Físicas Actuales */}
        {analyses.length > 0 && (
          <div className="detalle-section">
            <h2 className="section-title">
              <IoBody />
              Capacidades Físicas Actuales
            </h2>
            <div className="pentagon-chart-container">
              <svg width="100%" height="100%" viewBox="0 0 300 320" preserveAspectRatio="xMidYMid meet">
                {/* Guías del pentágono */}
                <polygon
                  points={pentagonData.backgroundPath}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              
              {/* Pentágono de capacidades */}
              <polygon
                points={pentagonData.pointsPath}
                fill="rgba(20, 184, 166, 0.3)"
                stroke="var(--primary-color)"
                strokeWidth="3"
                strokeLinejoin="round"
              />

              {/* Puntos y etiquetas */}
              {pentagonData.points.map((punto, i) => (
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
              {radialLines.map((line, i) => (
                <line
                  key={`line-${i}`}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              ))}
              </svg>
            </div>
          </div>
        )}

        {/* Timeline de Mejoría */}
        {analyses.length > 1 && (
          <div className="detalle-section">
            <h2 className="section-title">
              <IoTrendingUp />
              Timeline de Mejoría
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

                {/* Líneas de capacidades */}
                {analyses.length > 0 && (
                  <>
                    {/* Fuerza - Rojo */}
                    {analyses.slice(0, 5).some(a => a.strength !== null && a.strength !== undefined) && (
                      <>
                        <polyline
                          points={analyses.slice(0, 5).reverse().map((a, i) => 
                            `${60 + (i * 195)},${260 - ((a.strength || 0) * 2)}`
                          ).join(' ')}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {analyses.slice(0, 5).reverse().map((a, i) => (
                          <circle
                            key={`fuerza-${i}`}
                            cx={60 + (i * 195)}
                            cy={260 - ((a.strength || 0) * 2)}
                            r="5"
                            fill="#ef4444"
                            stroke="#0a0a0a"
                            strokeWidth="2"
                          />
                        ))}
                      </>
                    )}

                    {/* Velocidad - Cyan */}
                    {analyses.slice(0, 5).some(a => a.speed !== null && a.speed !== undefined) && (
                      <>
                        <polyline
                          points={analyses.slice(0, 5).reverse().map((a, i) => 
                            `${60 + (i * 195)},${260 - ((a.speed || 0) * 2)}`
                          ).join(' ')}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {analyses.slice(0, 5).reverse().map((a, i) => (
                          <circle
                            key={`velocidad-${i}`}
                            cx={60 + (i * 195)}
                            cy={260 - ((a.speed || 0) * 2)}
                            r="5"
                            fill="#06b6d4"
                            stroke="#0a0a0a"
                            strokeWidth="2"
                          />
                        ))}
                      </>
                    )}

                    {/* Resistencia - Verde */}
                    {analyses.slice(0, 5).some(a => a.endurance !== null && a.endurance !== undefined) && (
                      <>
                        <polyline
                          points={analyses.slice(0, 5).reverse().map((a, i) => 
                            `${60 + (i * 195)},${260 - ((a.endurance || 0) * 2)}`
                          ).join(' ')}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {analyses.slice(0, 5).reverse().map((a, i) => (
                          <circle
                            key={`resistencia-${i}`}
                            cx={60 + (i * 195)}
                            cy={260 - ((a.endurance || 0) * 2)}
                            r="5"
                            fill="#10b981"
                            stroke="#0a0a0a"
                            strokeWidth="2"
                          />
                        ))}
                      </>
                    )}

                    {/* Flexibilidad - Amarillo */}
                    {analyses.slice(0, 5).some(a => a.flexibility !== null && a.flexibility !== undefined) && (
                      <>
                        <polyline
                          points={analyses.slice(0, 5).reverse().map((a, i) => 
                            `${60 + (i * 195)},${260 - ((a.flexibility || 0) * 2)}`
                          ).join(' ')}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {analyses.slice(0, 5).reverse().map((a, i) => (
                          <circle
                            key={`flexibilidad-${i}`}
                            cx={60 + (i * 195)}
                            cy={260 - ((a.flexibility || 0) * 2)}
                            r="5"
                            fill="#f59e0b"
                            stroke="#0a0a0a"
                            strokeWidth="2"
                          />
                        ))}
                      </>
                    )}

                    {/* Potencia - Morado */}
                    {analyses.slice(0, 5).some(a => a.power !== null && a.power !== undefined) && (
                      <>
                        <polyline
                          points={analyses.slice(0, 5).reverse().map((a, i) => 
                            `${60 + (i * 195)},${260 - ((a.power || 0) * 2)}`
                          ).join(' ')}
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {analyses.slice(0, 5).reverse().map((a, i) => (
                          <circle
                            key={`potencia-${i}`}
                            cx={60 + (i * 195)}
                            cy={260 - ((a.power || 0) * 2)}
                            r="5"
                            fill="#a855f7"
                            stroke="#0a0a0a"
                            strokeWidth="2"
                          />
                        ))}
                      </>
                    )}
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
        )}

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
                  <th>Clasificación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((analisis) => (
                  <tr key={analisis.id}>
                    <td>{new Date(analisis.evaluationDate).toLocaleDateString('es-ES')}</td>
                    <td>
                      <span className={`badge ${getBadgeClass(analisis.globalClassification)}`}>
                        {getClassificationLabel(analisis.globalClassification)}
                      </span>
                    </td>
                    <td>
                      <div className="historial-actions">
                        <button 
                          className="action-btn action-btn-view"
                          onClick={() => handleVerAnalisis(analisis.id)}
                          title="Ver detalles"
                        >
                          <IoEye />
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
