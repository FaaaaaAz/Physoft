import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTemplate from '../../components/templates/PageTemplate'
import AthleteSelector from '../../components/analysis/AthleteSelector'
import ImageUploader from '../../components/analysis/ImageUploader'
import AIAnalysisPanel from '../../components/analysis/AIAnalysisPanel'
import AnalysisFieldsGrid from '../../components/analysis/AnalysisFieldsGrid'
import WeakPointsList from '../../components/analysis/WeakPointsList'
import PhysicalCapacitiesSliders from '../../components/analysis/PhysicalCapacitiesSliders'
import { useAIAnalysis, useFormMessage } from '../../hooks'
import { analysisAPI } from '../../services/api'
import type { Athlete } from '../../services/api'
import type {
    NewAnalysisFormData,
    AnalysisCheckboxes,
    WeakPoint,
    PhysicalCapacities
} from '../../types/analysis.types'
import './NewAnalysis.css'

function NewAnalysis() {
    const navigate = useNavigate()
    const { message, showMessage, clearMessage } = useFormMessage()
    const { isProcessing: aiProcessing, progress: aiProgress, generateAnalysis } = useAIAnalysis()

    // State
    const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [showAnalysisFields, setShowAnalysisFields] = useState(false)
    const [usedAI, setUsedAI] = useState(false)
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [nextWeakPointId, setNextWeakPointId] = useState(1)

    const [analysisCheckboxes, setAnalysisCheckboxes] = useState<AnalysisCheckboxes>({
        flexibility: false,
        biobit: false,
        asymmetry: false,
        motorControl: false,
        fatigue: false,
        inertiaForce: false
    })

    const [formData, setFormData] = useState<NewAnalysisFormData>({
        athleteId: '',
        evaluationDate: '',
        images: [],
        flexibilityAnalysis: '',
        biobitAnalysis: '',
        muscularAsymmetry: '',
        activeMotorControl: '',
        muscleFatigue: '',
        inertiaForceControl: '',
        weakPoints: [],
        physicalCapacities: {
            power: 0,
            endurance: 0,
            strength: 0,
            flexibility: 0,
            speed: 0
        },
        cohortClassification: '',
        recommendations: ''
    })

    // Monitor online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Handlers
    const handleAthleteSelect = (athlete: Athlete) => {
        setSelectedAthlete(athlete)
        setFormData(prev => ({ ...prev, athleteId: athlete.id }))
    }

    const handleImagesChange = (images: File[]) => {
        setFormData(prev => ({ ...prev, images }))
    }

    const handleCheckboxChange = (field: keyof AnalysisCheckboxes) => {
        setAnalysisCheckboxes(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    const handleGenerateAI = async () => {
        if (!isOnline) {
            showMessage('error', 'No internet connection. Use manual mode or connect to use AI.')
            return
        }

        try {
            const analysis = await generateAnalysis(analysisCheckboxes, formData.images.length > 0)
            setFormData(prev => ({ ...prev, ...analysis }))
            setShowAnalysisFields(true)
            setUsedAI(true)
            showMessage('success', 'AI analysis completed. You can edit the generated fields.')
        } catch (error: any) {
            showMessage('error', error.message || 'Error generating AI analysis')
        }
    }

    const handleManualAnalysis = () => {
        setAnalysisCheckboxes({
            flexibility: true,
            biobit: true,
            asymmetry: true,
            motorControl: true,
            fatigue: true,
            inertiaForce: true
        })
        setShowAnalysisFields(true)
        setUsedAI(false)
        showMessage('success', 'Manual mode activated. Complete the fields manually.')
    }

    const handleFieldChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleCapacityChange = (capacity: keyof PhysicalCapacities, value: number) => {
        setFormData(prev => ({
            ...prev,
            physicalCapacities: {
                ...prev.physicalCapacities,
                [capacity]: value
            }
        }))
    }

    const handleAddWeakPoint = () => {
        const newPoint: WeakPoint = {
            id: nextWeakPointId,
            text: ''
        }
        setFormData(prev => ({
            ...prev,
            weakPoints: [...prev.weakPoints, newPoint]
        }))
        setNextWeakPointId(prev => prev + 1)
    }

    const handleRemoveWeakPoint = (id: number) => {
        setFormData(prev => ({
            ...prev,
            weakPoints: prev.weakPoints.filter(p => p.id !== id)
        }))
    }

    const handleWeakPointChange = (id: number, text: string) => {
        setFormData(prev => ({
            ...prev,
            weakPoints: prev.weakPoints.map(p =>
                p.id === id ? { ...p, text } : p
            )
        }))
    }

    const handleRegenerate = () => {
        setShowAnalysisFields(false)
        setUsedAI(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedAthlete || !formData.athleteId) {
            showMessage('error', 'You must select an athlete before saving')
            return
        }

        setIsSaving(true)
        clearMessage()

        try {
            // Prepare data for API
            const submitData: any = {
                athleteId: formData.athleteId,
                evaluationDate: new Date(formData.evaluationDate).toISOString(),
                graphs: formData.images,
            }

            // Textual analyses
            if (formData.flexibilityAnalysis) submitData.flexibilityAnalysis = formData.flexibilityAnalysis
            if (formData.biobitAnalysis) submitData.biobitAnalysis = formData.biobitAnalysis
            if (formData.muscularAsymmetry) submitData.muscularAsymmetry = formData.muscularAsymmetry
            if (formData.activeMotorControl) submitData.activeMotorControl = formData.activeMotorControl
            if (formData.muscleFatigue) submitData.functionalMuscleFatigue = formData.muscleFatigue
            if (formData.inertiaForceControl) submitData.inertiaForceControl = formData.inertiaForceControl

            // Weak points
            const weakPointsText = formData.weakPoints
                .filter(p => p.text.trim())
                .map(p => p.text)
            if (weakPointsText.length > 0) {
                submitData.weakPoints = JSON.stringify(weakPointsText)
            }

            // Physical capacities
            if (formData.physicalCapacities.power > 0) submitData.power = formData.physicalCapacities.power
            if (formData.physicalCapacities.endurance > 0) submitData.endurance = formData.physicalCapacities.endurance
            if (formData.physicalCapacities.strength > 0) submitData.strength = formData.physicalCapacities.strength
            if (formData.physicalCapacities.flexibility > 0) submitData.flexibility = formData.physicalCapacities.flexibility
            if (formData.physicalCapacities.speed > 0) submitData.speed = formData.physicalCapacities.speed

            // Classification and recommendations
            if (formData.cohortClassification) submitData.globalClassification = formData.cohortClassification
            if (formData.recommendations) submitData.coachRecommendations = formData.recommendations

            const response = await analysisAPI.create(submitData)

            showMessage('success', '✅ Analysis saved successfully')

            setTimeout(() => {
                navigate(`/analysis-view/${response.data.id}`)
            }, 1500)

        } catch (error: any) {
            console.error('Error creating analysis:', error)
            let errorMessage = 'Error creating analysis'

            if (error.response?.data?.error) {
                errorMessage = error.response.data.error
            } else if (error.message) {
                errorMessage = error.message
            }

            showMessage('error', errorMessage)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <PageTemplate
            title="New Sports Analysis"
            subtitle="Complete kinesiological evaluation with AI assistance"
            showBackButton={true}
            backTo="/analysis"
            className="new-analysis-page"
            breadcrumbItems={[
                { label: 'Home', path: '/dashboard' },
                { label: 'Analysis', path: '/analysis' },
                { label: 'New Analysis' }
            ]}
        >
            <div className="new-analysis-container">
                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="analysis-form">

                    {/* SECTION 1 - General Information and Graphs */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <span className="section-number">1</span>
                            General Information and Graphs
                        </h3>

                        <div className="form-row">
                            <AthleteSelector
                                selectedAthlete={selectedAthlete}
                                onSelect={handleAthleteSelect}
                                disabled={isSaving}
                            />

                            <div className="form-group">
                                <label htmlFor="evaluationDate">Evaluation Date/Time *</label>
                                <input
                                    type="datetime-local"
                                    id="evaluationDate"
                                    name="evaluationDate"
                                    value={formData.evaluationDate}
                                    onChange={(e) => handleFieldChange('evaluationDate', e.target.value)}
                                    required
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        <ImageUploader
                            images={formData.images}
                            onImagesChange={handleImagesChange}
                            disabled={isSaving}
                            required
                        />
                    </div>

                    {/* SECTION 2 - Textual Analysis with AI */}
                    {!showAnalysisFields ? (
                        <AIAnalysisPanel
                            checkboxes={analysisCheckboxes}
                            onCheckboxChange={handleCheckboxChange}
                            onGenerateAI={handleGenerateAI}
                            onManualAnalysis={handleManualAnalysis}
                            isProcessing={aiProcessing}
                            progress={aiProgress}
                            isOnline={isOnline}
                            disabled={isSaving}
                        />
                    ) : (
                        <div className="form-section">
                            <h3 className="section-title">
                                <span className="section-number">2</span>
                                Textual Analysis
                            </h3>
                            <AnalysisFieldsGrid
                                checkboxes={analysisCheckboxes}
                                values={{
                                    flexibilityAnalysis: formData.flexibilityAnalysis,
                                    biobitAnalysis: formData.biobitAnalysis,
                                    muscularAsymmetry: formData.muscularAsymmetry,
                                    activeMotorControl: formData.activeMotorControl,
                                    muscleFatigue: formData.muscleFatigue,
                                    inertiaForceControl: formData.inertiaForceControl
                                }}
                                onChange={handleFieldChange}
                                usedAI={usedAI}
                                onRegenerate={handleRegenerate}
                                disabled={isSaving}
                            />
                        </div>
                    )}

                    {/* SECTION 3 - Conclusions and Plan */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <span className="section-number">3</span>
                            Conclusions and Plan
                        </h3>

                        <WeakPointsList
                            weakPoints={formData.weakPoints}
                            onAdd={handleAddWeakPoint}
                            onRemove={handleRemoveWeakPoint}
                            onChange={handleWeakPointChange}
                            disabled={isSaving}
                        />

                        <PhysicalCapacitiesSliders
                            capacities={formData.physicalCapacities}
                            onChange={handleCapacityChange}
                            disabled={isSaving}
                            isOnline={isOnline}
                        />

                        {/* Global Classification */}
                        <div className="subsection">
                            <h4>Global Classification vs Cohort</h4>
                            <p className="subsection-description">
                                AI will determine classification based on evaluated physical capacities.
                            </p>
                            <select
                                name="cohortClassification"
                                value={formData.cohortClassification}
                                onChange={(e) => handleFieldChange('cohortClassification', e.target.value)}
                                className="form-select"
                                disabled={isSaving}
                            >
                                <option value="">Select classification</option>
                                <option value="low">Below Average (Low)</option>
                                <option value="medium">Average (Medium)</option>
                                <option value="high">Above Average (High)</option>
                            </select>
                        </div>

                        {/* Recommendations */}
                        <div className="subsection">
                            <h4>Recommendations for Coach</h4>
                            <textarea
                                name="recommendations"
                                value={formData.recommendations}
                                onChange={(e) => handleFieldChange('recommendations', e.target.value)}
                                rows={6}
                                placeholder="Write specific recommendations for the coach..."
                                className="form-textarea-large"
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary-large"
                            onClick={() => navigate('/analysis')}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary-large"
                            disabled={isSaving}
                        >
                            {isSaving ? '⏳ Saving...' : '✓ Save Analysis'}
                        </button>
                    </div>
                </form>
            </div>
        </PageTemplate>
    )
}

export default NewAnalysis
