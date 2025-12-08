import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoArrowBack, IoDocument, IoPerson } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import LoadingSpinner from '@/components/common/feedback/LoadingSpinner'
import { analysisAPI, Analysis } from '../../services/api'
import './AnalysisView.css'

function AnalysisView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadAnalysis(parseInt(id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadAnalysis = async (analysisId: number) => {
    try {
      setLoading(true)
      const response = await analysisAPI.getById(analysisId)
      setAnalysis(response.data)
    } catch (error) {
      console.error('Error loading analysis:', error)
    } finally {
      setLoading(false)
    }
  }

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
    >
      <button onClick={() => navigate('/analysis')} className="btn-back">
        <IoArrowBack /> Volver
      </button>

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

        {/* Classification */}
        {analysis.globalClassification && (
          <section className="analysis-section">
            <h2>Clasificación Cohorte</h2>
            <div className={`classification-badge classification-${analysis.globalClassification}`}>
              {getClassificationLabel(analysis.globalClassification)}
            </div>
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
