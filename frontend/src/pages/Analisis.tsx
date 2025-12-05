import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoSearch, IoFitness, IoTrendingUp, IoDocument } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import { Analysis } from '../services/api'
import { useAthletes } from '../hooks/useAthletes'
import { useAnalyses } from '../hooks/useAnalyses'
import '../styles/Analisis.css'

function Analisis() {
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  
  // Use custom hooks for data fetching
  const { analyses, loading: loadingAnalyses } = useAnalyses()
  const { athletes, loading: loadingAthletes } = useAthletes()
  
  const loading = loadingAnalyses || loadingAthletes
  const recentAnalyses = analyses.slice(0, 10)

  // Calculate stats from loaded data
  const stats = {
    total: analyses.length,
    thisWeek: analyses.length, // TODO: calcular semana actual
    athletes: athletes.length
  }

  const getClassificationBadge = (classification: string | null | undefined) => {
    if (!classification) return 'promedio'
    if (classification === 'high') return 'encima'
    if (classification === 'low') return 'debajo'
    return 'promedio'
  }

  const getClassificationText = (classification: string | null | undefined) => {
    if (!classification) return 'Promedio'
    if (classification === 'high') return 'Encima del Promedio'
    if (classification === 'low') return 'Debajo del Promedio'
    return 'Promedio'
  }

  const filteredAnalyses = recentAnalyses.filter(analysis =>
    analysis.athlete?.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    analysis.athlete?.accessCode.includes(busqueda)
  )

  const handleCrearAnalisis = () => {
    navigate('/new-analysis')
  }

  const handleViewAnalysis = (analysis: Analysis) => {
    navigate(`/analysis-view/${analysis.id}`)
  }

  return (
    <PageTemplate
      title="Análisis Kinesiológico"
      subtitle="Gestiona y crea evaluaciones deportivas completas"
      className="analisis-page"
      showAddButton={true}
      onAddClick={handleCrearAnalisis}
      addButtonText="Crear Nuevo Análisis"
    >
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(20, 184, 166, 0.1)' }}>
            <IoDocument style={{ color: 'var(--primary-color)' }} />
          </div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.total}</h3>
            <p>Análisis Totales</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.1)' }}>
            <IoTrendingUp style={{ color: '#34d399' }} />
          </div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.thisWeek}</h3>
            <p>Esta Semana</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(96, 165, 250, 0.1)' }}>
            <IoFitness style={{ color: '#60a5fa' }} />
          </div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.athletes}</h3>
            <p>Atletas Evaluados</p>
          </div>
        </div>
      </div>

      {/* Análisis recientes */}
      <div className="analisis-section">
        <div className="section-header">
          <h2 className="section-title">Análisis Recientes</h2>
          <div className="search-small">
            <IoSearch className="search-icon-small" />
            <input
              type="text"
              placeholder="Buscar análisis..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input-small"
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando análisis...</p>
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No hay análisis recientes</p>
          </div>
        ) : (
          <>
            <div className="analisis-table-container">
              <table className="analisis-table">
                <thead>
                  <tr>
                    <th>Atleta</th>
                    <th>Fecha</th>
                    <th>Clasificación</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnalyses.map(analysis => (
                    <tr 
                      key={analysis.id}
                      className="clickable-row"
                      onClick={() => handleViewAnalysis(analysis)}
                    >
                      <td>
                        <div className="atleta-cell">
                          <div className="atleta-avatar">
                            {analysis.athlete?.name.charAt(0) || '?'}
                          </div>
                          <span className="atleta-nombre">{analysis.athlete?.name || 'Atleta desconocido'}</span>
                        </div>
                      </td>
                      <td>{new Date(analysis.evaluationDate).toLocaleDateString('es-ES')}</td>
                      <td>
                        <span className={`badge badge-${getClassificationBadge(analysis.globalClassification)}`}>
                          {getClassificationText(analysis.globalClassification)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botón Ver Todos */}
            <div className="ver-todos-container">
              <button 
                className="btn-ver-todos"
                onClick={() => navigate('/all-analysis')}
              >
                Ver Todos
              </button>
            </div>
          </>
        )}
      </div>
    </PageTemplate>
  )
}

export default Analisis
