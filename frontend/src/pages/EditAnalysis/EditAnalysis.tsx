import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IoSparklesOutline } from 'react-icons/io5'
import PageTemplate from '@/components/templates/PageTemplate'
import LoadingSpinner from '@/components/common/feedback/LoadingSpinner'
import MiniChatPanel from '@/components/analysis/MiniChatPanel'
import { analysisAPI, type AIAnalysisResult } from '@/services/api'
import { useAnalysisStore } from '@/store/analysisStore'
import { useAIAnalysisResults } from '@/hooks'
import { WeakPointsList } from '@/components/analysis/WeakPointsList'
import { PhysicalCapacitiesForm } from '@/components/analysis/PhysicalCapacitiesForm'
import { AnalysisFieldsForm } from '@/components/analysis/AnalysisFieldsForm'
import './EditAnalysis.css'

interface PuntoDebil {
    id: number
    area: string
    descripcion: string
}

interface CapacidadesFisicas {
    potencia: number
    resistencia: number
    fuerza: number
    flexibilidad: number
    velocidad: number
}

function EditAnalysis() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { updateAnalysis: updateAnalysisInStore } = useAnalysisStore()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null)
    const [proximoIdPuntoDebil, setProximoIdPuntoDebil] = useState(1)
    const [athleteName, setAthleteName] = useState('')
    const [aiAnalysisResults, setAiAnalysisResults] = useState<AIAnalysisResult[]>([])

    const { results: aiResults, saveEdit: saveAiEdit } = useAIAnalysisResults(
        id ? parseInt(id) : 0,
        aiAnalysisResults
    )

    const [formData, setFormData] = useState({
        fechaEvaluacion: '',
        analisisFlexibilidad: '',
        analisisBiobit: '',
        asimetriaMuscular: '',
        controlMotorActivo: '',
        fatigaMuscular: '',
        controlFuerzaInercia: '',
        puntosDebiles: [] as PuntoDebil[],
        capacidadesFisicas: {
            potencia: 0,
            resistencia: 0,
            fuerza: 0,
            flexibilidad: 0,
            velocidad: 0
        } as CapacidadesFisicas,
        clasificacionCohorte: '',
        recomendaciones: ''
    })

    useEffect(() => {
        if (id) {
            loadAnalysis(parseInt(id))
        }
    }, [id])

    const loadAnalysis = async (analysisId: number) => {
        try {
            setLoading(true)
            const response = await analysisAPI.getById(analysisId)
            const analysis = response.data

            // Parse weak points from JSON string to array
            let parsedWeakPoints: PuntoDebil[] = []
            if (analysis.weakPoints) {
                try {
                    const weakPointsData = JSON.parse(analysis.weakPoints)
                    parsedWeakPoints = weakPointsData.map((wp: any, index: number) => ({
                        id: index + 1,
                        area: wp.area || '',
                        descripcion: wp.descripcion || ''
                    }))
                    setProximoIdPuntoDebil(parsedWeakPoints.length + 1)
                } catch (e) {
                    console.error('Error parsing weak points:', e)
                }
            }

            // Set athlete name for breadcrumbs
            if (analysis.athlete?.name) {
                setAthleteName(analysis.athlete.name)
            }

            setAiAnalysisResults(analysis.aiAnalysisResults || [])

            setFormData({
                fechaEvaluacion: analysis.evaluationDate ? new Date(analysis.evaluationDate).toISOString().split('T')[0] : '',
                analisisFlexibilidad: analysis.flexibilityAnalysis || '',
                analisisBiobit: analysis.biobitAnalysis || '',
                asimetriaMuscular: analysis.muscularAsymmetry || '',
                controlMotorActivo: analysis.activeMotorControl || '',
                fatigaMuscular: analysis.functionalMuscleFatigue || '',
                controlFuerzaInercia: analysis.inertiaForceControl || '',
                puntosDebiles: parsedWeakPoints,
                capacidadesFisicas: {
                    potencia: analysis.power || 0,
                    resistencia: analysis.endurance || 0,
                    fuerza: analysis.strength || 0,
                    flexibilidad: analysis.flexibility || 0,
                    velocidad: analysis.speed || 0
                },
                clasificacionCohorte: analysis.cohortClassification || analysis.globalClassification || '',
                recomendaciones: analysis.coachRecommendations || ''
            })
        } catch (error) {
            console.error('Error loading analysis:', error)
            setMensaje({ tipo: 'error', texto: 'Error loading analysis' })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleCapacidadChange = (capacidad: keyof CapacidadesFisicas, value: number) => {
        setFormData(prev => ({
            ...prev,
            capacidadesFisicas: {
                ...prev.capacidadesFisicas,
                [capacidad]: value
            }
        }))
    }

    const handleAgregarPuntoDebil = () => {
        const nuevoPunto: PuntoDebil = {
            id: proximoIdPuntoDebil,
            area: '',
            descripcion: ''
        }
        setFormData(prev => ({
            ...prev,
            puntosDebiles: [...prev.puntosDebiles, nuevoPunto]
        }))
        setProximoIdPuntoDebil(prev => prev + 1)
    }

    const handleEliminarPuntoDebil = (id: number) => {
        setFormData(prev => ({
            ...prev,
            puntosDebiles: prev.puntosDebiles.filter(p => p.id !== id)
        }))
    }

    const handlePuntoDebilChange = (id: number, field: 'area' | 'descripcion', value: string) => {
        setFormData(prev => ({
            ...prev,
            puntosDebiles: prev.puntosDebiles.map(p =>
                p.id === id ? { ...p, [field]: value } : p
            )
        }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!id) return

        try {
            setSaving(true)
            setMensaje(null)

            const updateData: any = {
                evaluationDate: formData.fechaEvaluacion
            }

            // Análisis textuales
            if (formData.analisisFlexibilidad) updateData.flexibilityAnalysis = formData.analisisFlexibilidad
            if (formData.analisisBiobit) updateData.biobitAnalysis = formData.analisisBiobit
            if (formData.asimetriaMuscular) updateData.muscularAsymmetry = formData.asimetriaMuscular
            if (formData.controlMotorActivo) updateData.activeMotorControl = formData.controlMotorActivo
            if (formData.fatigaMuscular) updateData.functionalMuscleFatigue = formData.fatigaMuscular
            if (formData.controlFuerzaInercia) updateData.inertiaForceControl = formData.controlFuerzaInercia

            // Puntos débiles - convertir array a JSON
            const puntosDebilesTexto = formData.puntosDebiles
                .filter(p => p.area.trim() !== '')
                .map(p => ({ area: p.area, descripcion: p.descripcion }))

            if (puntosDebilesTexto.length > 0) {
                updateData.weakPoints = JSON.stringify(puntosDebilesTexto)
            }

            // Capacidades físicas
            if (formData.capacidadesFisicas.potencia > 0) updateData.power = formData.capacidadesFisicas.potencia
            if (formData.capacidadesFisicas.resistencia > 0) updateData.endurance = formData.capacidadesFisicas.resistencia
            if (formData.capacidadesFisicas.fuerza > 0) updateData.strength = formData.capacidadesFisicas.fuerza
            if (formData.capacidadesFisicas.flexibilidad > 0) updateData.flexibility = formData.capacidadesFisicas.flexibilidad
            if (formData.capacidadesFisicas.velocidad > 0) updateData.speed = formData.capacidadesFisicas.velocidad

            // Clasificación y recomendaciones
            if (formData.clasificacionCohorte) updateData.cohortClassification = formData.clasificacionCohorte
            if (formData.recomendaciones) updateData.coachRecommendations = formData.recomendaciones

            const response = await analysisAPI.update(parseInt(id), updateData)

            // Update store
            updateAnalysisInStore(parseInt(id), response.data)

            setMensaje({ tipo: 'success', texto: '✅ Analysis updated successfully' })

            setTimeout(() => {
                navigate(`/analysis-view/${id}`)
            }, 1500)
        } catch (error: any) {
            console.error('Error updating analysis:', error)
            setMensaje({ tipo: 'error', texto: error.response?.data?.error || 'Error updating analysis' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <PageTemplate title="Loading..." subtitle="">
                <LoadingSpinner message="Loading analysis data..." />
            </PageTemplate>
        )
    }

    return (
        <PageTemplate
            title="Edit Analysis"
            subtitle="Update the analysis information"
            className="edit-analysis-page"
            showBackButton={true}
            breadcrumbItems={[
                { label: 'Assessments', path: '/analysis' },
                { label: athleteName || 'Assessment', path: `/analysis-view/${id}` },
                { label: 'Edit' }
            ]}
        >
            <form onSubmit={handleSubmit} className="nuevo-analisis-form">
                {mensaje && (
                    <div className={`mensaje mensaje-${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                {/* Evaluation Date */}
                <div className="form-section">
                    <h3>Evaluation Date</h3>
                    <div className="form-group">
                        <label htmlFor="fechaEvaluacion">Date *</label>
                        <input
                            type="date"
                            id="fechaEvaluacion"
                            value={formData.fechaEvaluacion}
                            onChange={(e) => handleChange('fechaEvaluacion', e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* SECCIÓN 2 - Análisis Textual */}
                <div className="form-section">
                    <h3 className="section-title">
                        <span className="section-number">2</span>
                        Textual Analysis
                    </h3>

                    {/* Detailed Analysis */}
                    <AnalysisFieldsForm
                        formData={formData}
                        onChange={handleChange}
                    />

                    {/* AI-Assisted Textual Analysis (view + inline edit only) */}
                    {aiResults.length > 0 && (
                        <div className="ai-results-subsection">
                            <h4>
                                <IoSparklesOutline /> AI-Assisted Analysis
                            </h4>
                            <div className="ai-results-list">
                                {aiResults.map(result => (
                                    <MiniChatPanel
                                        key={result.id}
                                        result={result}
                                        editable
                                        onSave={(newText) => saveAiEdit(result.id, newText)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SECCIÓN 3 - Conclusiones y Plan */}
                <div className="form-section">
                    <h3 className="section-title">
                        <span className="section-number">3</span>
                        Conclusions and Plan
                    </h3>

                    {/* Puntos Débiles */}
                    <WeakPointsList
                        puntosDebiles={formData.puntosDebiles}
                        onAdd={handleAgregarPuntoDebil}
                        onRemove={handleEliminarPuntoDebil}
                        onChange={handlePuntoDebilChange}
                    />

                    {/* Capacidades Físicas */}
                    <PhysicalCapacitiesForm
                        capacidades={formData.capacidadesFisicas}
                        onChange={handleCapacidadChange}
                    />
                </div>

                {/* Clasificación y Recomendaciones */}
                <div className="form-section">
                    <h3>Classification and Recommendations</h3>
                    <div className="form-group">
                        <label htmlFor="clasificacionCohorte">Cohort Classification</label>
                        <select
                            id="clasificacionCohorte"
                            className="form-select"
                            value={formData.clasificacionCohorte}
                            onChange={(e) => handleChange('clasificacionCohorte', e.target.value)}
                        >
                            <option value="">Select a classification</option>
                            <option value="ELITE">Elite</option>
                            <option value="AVANZADO">Advanced</option>
                            <option value="INTERMEDIO">Intermediate</option>
                            <option value="PRINCIPIANTE">Beginner</option>
                            <option value="ATENCION_REQUERIDA">Attention Required</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="recomendaciones">Recommendations for Coach</label>
                        <textarea
                            id="recomendaciones"
                            value={formData.recomendaciones}
                            onChange={(e) => handleChange('recomendaciones', e.target.value)}
                            rows={6}
                            placeholder="Write specific recommendations for the coach..."
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                    <button type="submit" className="btn-primary-large" disabled={saving}>
                        {saving ? '⏳ Saving...' : '✓ Save Changes'}
                    </button>
                </div>
            </form>
        </PageTemplate>
    )
}

export default EditAnalysis
