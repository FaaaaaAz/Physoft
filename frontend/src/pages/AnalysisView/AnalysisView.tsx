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
        if (classification === 'high') return 'Above Average'
        if (classification === 'medium') return 'Average'
        if (classification === 'low') return 'Below Average'
        return classification
    }

    if (loading) {
        return (
            <PageTemplate title="Loading..." subtitle="">
                <LoadingSpinner message="Loading analysis..." />
            </PageTemplate>
        )
    }

    if (!analysis) {
        return (
            <PageTemplate title="Error" subtitle="">
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <p>Analysis not found</p>
                    <button onClick={() => navigate('/analysis')} className="btn-primary" style={{ marginTop: '1rem' }}>
                        Go Back
                    </button>
                </div>
            </PageTemplate>
        )
    }

    const weakPoints = parseWeakPoints(analysis.weakPoints)
    const graphImages = parseGraphImages(analysis.graphImages)

    return (
        <PageTemplate
            title={`Analysis of ${analysis.athlete?.name || 'Athlete'}`}
            subtitle={`Evaluation performed on ${new Date(analysis.evaluationDate).toLocaleDateString('en-US')}`}
            className="analysis-view-page"
        >
            <button onClick={() => navigate('/analysis')} className="btn-back">
                <IoArrowBack /> Back
            </button>

            <div className="analysis-view-container">
                {/* Athlete Information */}
                {analysis.athlete && (
                    <section className="analysis-section">
                        <h2><IoPerson /> Athlete Information</h2>
                        <div className="athlete-info-grid">
                            <div>
                                <strong>Name:</strong> {analysis.athlete.name}
                            </div>
                            <div>
                                <strong>Code:</strong> {analysis.athlete.accessCode}
                            </div>
                            <div>
                                <strong>Sport:</strong> {analysis.athlete.sport}
                            </div>
                        </div>
                    </section>
                )}

                {/* Graphs */}
                {graphImages.length > 0 && (
                    <section className="analysis-section">
                        <h2><IoDocument /> Evaluation Graphs</h2>
                        <div className="graphs-grid">
                            {graphImages.map((url, index) => (
                                <img key={index} src={url} alt={`Graph ${index + 1}`} className="graph-image" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Textual Analyses */}
                <section className="analysis-section">
                    <h2>Detailed Analysis</h2>

                    {analysis.flexibilityAnalysis && (
                        <div className="analysis-item">
                            <h3>1. Flexibility Analysis</h3>
                            <p>{analysis.flexibilityAnalysis}</p>
                        </div>
                    )}

                    {analysis.biobitAnalysis && (
                        <div className="analysis-item">
                            <h3>2. Biobit Analysis</h3>
                            <p>{analysis.biobitAnalysis}</p>
                        </div>
                    )}

                    {analysis.muscularAsymmetry && (
                        <div className="analysis-item">
                            <h3>3. Muscular Asymmetry in Activation</h3>
                            <p>{analysis.muscularAsymmetry}</p>
                        </div>
                    )}

                    {analysis.activeMotorControl && (
                        <div className="analysis-item">
                            <h3>4. Active Motor Control Analysis</h3>
                            <p>{analysis.activeMotorControl}</p>
                        </div>
                    )}

                    {analysis.functionalMuscleFatigue && (
                        <div className="analysis-item">
                            <h3>5. Functional Muscle Fatigue Analysis</h3>
                            <p>{analysis.functionalMuscleFatigue}</p>
                        </div>
                    )}

                    {analysis.inertiaForceControl && (
                        <div className="analysis-item">
                            <h3>6. Inertia Force Control Analysis</h3>
                            <p>{analysis.inertiaForceControl}</p>
                        </div>
                    )}
                </section>

                {/* Physical Capacities */}
                <section className="analysis-section">
                    <h2>Physical Capacities</h2>
                    <div className="capacities-grid">
                        {analysis.power !== null && analysis.power !== undefined && (
                            <div className="capacity-item">
                                <div className="capacity-label">Power</div>
                                <div className="capacity-bar">
                                    <div className="capacity-fill" style={{ width: `${analysis.power}%` }}></div>
                                </div>
                                <div className="capacity-value">{analysis.power}/100</div>
                            </div>
                        )}

                        {analysis.endurance !== null && analysis.endurance !== undefined && (
                            <div className="capacity-item">
                                <div className="capacity-label">Endurance</div>
                                <div className="capacity-bar">
                                    <div className="capacity-fill" style={{ width: `${analysis.endurance}%` }}></div>
                                </div>
                                <div className="capacity-value">{analysis.endurance}/100</div>
                            </div>
                        )}

                        {analysis.strength !== null && analysis.strength !== undefined && (
                            <div className="capacity-item">
                                <div className="capacity-label">Strength</div>
                                <div className="capacity-bar">
                                    <div className="capacity-fill" style={{ width: `${analysis.strength}%` }}></div>
                                </div>
                                <div className="capacity-value">{analysis.strength}/100</div>
                            </div>
                        )}

                        {analysis.flexibility !== null && analysis.flexibility !== undefined && (
                            <div className="capacity-item">
                                <div className="capacity-label">Flexibility</div>
                                <div className="capacity-bar">
                                    <div className="capacity-fill" style={{ width: `${analysis.flexibility}%` }}></div>
                                </div>
                                <div className="capacity-value">{analysis.flexibility}/100</div>
                            </div>
                        )}

                        {analysis.speed !== null && analysis.speed !== undefined && (
                            <div className="capacity-item">
                                <div className="capacity-label">Speed</div>
                                <div className="capacity-bar">
                                    <div className="capacity-fill" style={{ width: `${analysis.speed}%` }}></div>
                                </div>
                                <div className="capacity-value">{analysis.speed}/100</div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Weak Points */}
                {weakPoints.length > 0 && (
                    <section className="analysis-section">
                        <h2>Identified Weak Points</h2>
                        <ul className="weak-points-list">
                            {weakPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Classification */}
                {analysis.globalClassification && (
                    <section className="analysis-section">
                        <h2>Global Classification vs Cohort</h2>
                        <div className={`classification-badge classification-${analysis.globalClassification}`}>
                            {getClassificationLabel(analysis.globalClassification)}
                        </div>
                    </section>
                )}

                {/* Recommendations */}
                {analysis.coachRecommendations && (
                    <section className="analysis-section">
                        <h2>Recommendations for Coach</h2>
                        <p className="recommendations-text">{analysis.coachRecommendations}</p>
                    </section>
                )}
            </div>
        </PageTemplate>
    )
}

export default AnalysisView
