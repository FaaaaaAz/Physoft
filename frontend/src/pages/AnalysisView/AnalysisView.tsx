import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoDocument, IoPerson, IoTrash, IoCreate } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import LoadingSpinner from '@/components/common/feedback/LoadingSpinner'
import { analysisAPI, Analysis } from '../../services/api'
import { useAnalysisStore } from '@/store/analysisStore'
import { MESSAGES } from '@/constants'
import './AnalysisView.css'

function AnalysisView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { analyses, fetchAnalyses, getAnalysisById, deleteAnalysis } = useAnalysisStore()

  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!id) return

      try {
        setLoading(true)

        // Try to get from store first
        let analysisData = getAnalysisById(parseInt(id))

        // If not in store and store is empty, fetch all analyses
        if (!analysisData && analyses.length === 0) {
          await fetchAnalyses()
          analysisData = getAnalysisById(parseInt(id))
        }

        // If still not found, fetch directly
        if (!analysisData) {
          const response = await analysisAPI.getById(parseInt(id))
          analysisData = response.data
        }

        setAnalysis(analysisData)
      } catch (error) {
        console.error('Error loading analysis:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalysis()
  }, [id])

  const parseWeakPoints = (weakPoints: string | null | undefined): string[] => {
    if (!weakPoints) return []
    try {
      return JSON.parse(weakPoints)
    } catch {
      return []
    }
  }

  const parseGraphImages = (graphImages: string | null | undefined): string[] => {
    if (!graphImages) return []
    try {
      return JSON.parse(graphImages)
    } catch {
      return []
    }
  }

  const getClassificationLabel = (classification: string) => {
    if (classification === 'high') return 'Por Encima del Promedio'
    if (classification === 'medium') return 'Promedio'
    if (classification === 'low') return 'Por Debajo del Promedio'
    return classification
  }

  const getCohortLabel = (cohort: string) => {
    const labels: Record<string, string> = {
      'ELITE': 'Elite',
      'AVANZADO': 'Avanzado',
      'INTERMEDIO': 'Intermedio',
      'PRINCIPIANTE': 'Principiante',
      'ATENCION_REQUERIDA': 'Atención Requerida'
    }
    return labels[cohort] || cohort
  }

  const handleDelete = async () => {
    if (!id || !analysis) return

    if (!window.confirm(MESSAGES.CONFIRM.DELETE_ANALYSIS)) {
      return
    }

    try {
      await deleteAnalysis(parseInt(id))
      navigate('/analysis')
    } catch (error) {
      console.error('Error deleting analysis:', error)
      alert(MESSAGES.ERROR.DELETING_ANALYSIS)
    }
  }

  if (loading) {
    return (
      <PageTemplate title="Cargando..." subtitle="">
        <LoadingSpinner message="Cargando análisis..." />
      </PageTemplate>
    )
  }

  if (!analysis) {
    return (
      <PageTemplate title="Error" subtitle="">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Análisis no encontrado</p>
          <button
            onClick={() => navigate('/analysis')}
            className="btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Volver
          </button>
        </div>
      </PageTemplate>
    )
  }

  const weakPoints = parseWeakPoints(analysis.weakPoints)
  const graphImages = parseGraphImages(analysis.graphImages)

  return (
    <PageTemplate
      title={`Análisis de ${analysis.athlete?.name || 'Atleta'}`}
      subtitle={`Evaluación realizada el ${new Date(analysis.evaluationDate).toLocaleDateString(
        'es-ES'
      )}`}
      className="analysis-view-page"
      showBackButton={true}
      showAddButton={false}
    >
      {/* Custom Action Buttons */}
      <div className="page-header">
        <div className="page-title-section">
          <div className="page-actions" style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
            <button
              className="btn-primary btn-primary-large"
              onClick={() => navigate(`/analysis/edit/${id}`)}
            >
              <IoCreate /> Editar Análisis
            </button>
            <button
              onClick={handleDelete}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444'
              }}
            >
              <IoTrash /> Eliminar Análisis
            </button>
          </div>
        </div>
      </div>

      <div className="analysis-view-container">
        {/* Athlete Information */}
        {analysis.athlete && (
          <section className="analysis-section">
            <h2>
              <IoPerson /> Información del Atleta
            </h2>
            <div className="athlete-info-grid">
              <div>
                <strong>Nombre:</strong> {analysis.athlete.name}
              </div>
              <div>
                <strong>Código:</strong> {analysis.athlete.accessCode}
              </div>
              <div>
                <strong>Deporte:</strong> {analysis.athlete.sport}
              </div>
            </div>
          </section>
        )}

        {/* Graphs */}
        {graphImages.length > 0 && (
          <section className="analysis-section">
            <h2>
              <IoDocument /> Gráficos de Evaluación
            </h2>
            <div className="graphs-grid">
              {graphImages.map((url, index) => (
                <img key={index} src={url} alt={`Gráfico ${index + 1}`} className="graph-image" />
              ))}
            </div>
          </section>
        )}

        {/* Textual Analyses */}
        <section className="analysis-section">
          <h2>Análisis Detallado</h2>

          {analysis.flexibilityAnalysis && (
            <div className="analysis-item">
              <h3>1. Análisis de Flexibilidad</h3>
              <p>{analysis.flexibilityAnalysis}</p>
            </div>
          )}

          {analysis.biobitAnalysis && (
            <div className="analysis-item">
              <h3>2. Análisis Biobit</h3>
              <p>{analysis.biobitAnalysis}</p>
            </div>
          )}

          {analysis.muscularAsymmetry && (
            <div className="analysis-item">
              <h3>3. Asimetría Muscular en Activación</h3>
              <p>{analysis.muscularAsymmetry}</p>
            </div>
          )}

          {analysis.activeMotorControl && (
            <div className="analysis-item">
              <h3>4. Análisis de Control Motor Activo</h3>
              <p>{analysis.activeMotorControl}</p>
            </div>
          )}

          {analysis.functionalMuscleFatigue && (
            <div className="analysis-item">
              <h3>5. Análisis de Fatiga Muscular Funcional</h3>
              <p>{analysis.functionalMuscleFatigue}</p>
            </div>
          )}

          {analysis.inertiaForceControl && (
            <div className="analysis-item">
              <h3>6. Análisis de Control de Fuerza Inercial</h3>
              <p>{analysis.inertiaForceControl}</p>
            </div>
          )}
        </section>

        {/* Physical Capacities */}
        <section className="analysis-section">
          <h2>Capacidades Físicas</h2>
          <div className="capacities-grid">
            {analysis.power !== null && analysis.power !== undefined && (
              <div className="capacity-item">
                <div className="capacity-label">Potencia</div>
                <div className="capacity-bar">
                  <div className="capacity-fill" style={{ width: `${analysis.power}%` }} />
                </div>
                <div className="capacity-value">{analysis.power}/100</div>
              </div>
            )}

            {analysis.endurance !== null && analysis.endurance !== undefined && (
              <div className="capacity-item">
                <div className="capacity-label">Resistencia</div>
                <div className="capacity-bar">
                  <div className="capacity-fill" style={{ width: `${analysis.endurance}%` }} />
                </div>
                <div className="capacity-value">{analysis.endurance}/100</div>
              </div>
            )}

            {analysis.strength !== null && analysis.strength !== undefined && (
              <div className="capacity-item">
                <div className="capacity-label">Fuerza</div>
                <div className="capacity-bar">
                  <div className="capacity-fill" style={{ width: `${analysis.strength}%` }} />
                </div>
                <div className="capacity-value">{analysis.strength}/100</div>
              </div>
            )}

            {analysis.flexibility !== null && analysis.flexibility !== undefined && (
              <div className="capacity-item">
                <div className="capacity-label">Flexibilidad</div>
                <div className="capacity-bar">
                  <div className="capacity-fill" style={{ width: `${analysis.flexibility}%` }} />
                </div>
                <div className="capacity-value">{analysis.flexibility}/100</div>
              </div>
            )}

            {analysis.speed !== null && analysis.speed !== undefined && (
              <div className="capacity-item">
                <div className="capacity-label">Velocidad</div>
                <div className="capacity-bar">
                  <div className="capacity-fill" style={{ width: `${analysis.speed}%` }} />
                </div>
                <div className="capacity-value">{analysis.speed}/100</div>
              </div>
            )}
          </div>
        </section>

        {/* Weak Points */}
        {weakPoints.length > 0 && (
          <section className="analysis-section">
            <h2>Puntos Débiles Identificados</h2>
            <ul className="weak-points-list">
              {weakPoints.map((point, index) => (
                <li key={index}>
                  {typeof point === 'string' ? (
                    point
                  ) : (
                    <>
                      <strong>{(point as any).area}</strong>
                      {(point as any).descripcion ? `: ${(point as any).descripcion}` : null}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Classifications */}
        {(analysis.globalClassification || analysis.cohortClassification) && (
          <section className="analysis-section">
            <h2>Clasificaciones</h2>

            {/* Global Classification - Based on comparison with same sport/bodyType */}
            {analysis.globalClassification && (
              <div className="classification-item">
                <h3>Clasificación Global</h3>
                <p className="classification-description">
                  Basada en la comparación con atletas del mismo deporte y somatotipo
                </p>
                <div className={`classification-badge classification-${analysis.globalClassification}`}>
                  {getClassificationLabel(analysis.globalClassification)}
                </div>
              </div>
            )}

            {/* Cohort Classification - Elite, Avanzado, etc. */}
            {analysis.cohortClassification && (
              <div className="classification-item" style={{ marginTop: '1.5rem' }}>
                <h3>Clasificación de Cohorte</h3>
                <p className="classification-description">
                  Nivel general del atleta según sus capacidades físicas
                </p>
                <div className={`classification-badge cohort-${analysis.cohortClassification.toLowerCase()}`}>
                  {getCohortLabel(analysis.cohortClassification)}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Recommendations */}
        {analysis.coachRecommendations && (
          <section className="analysis-section">
            <h2>Recomendaciones para el Entrenador</h2>
            <p className="recommendations-text">{analysis.coachRecommendations}</p>
          </section>
        )}
      </div>
    </PageTemplate>
  )
}

export default AnalysisView
