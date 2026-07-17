import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoAdd, IoTrash, IoSearch } from 'react-icons/io5'
import PageTemplate from '@/components/templates/PageTemplate'
import { athleteAPI, analysisAPI, Athlete, AIAnalysisResult } from '@/services/api'
import { useAnalysisStore } from '@/store/analysisStore'
import BodyVisualization, { BodyMark } from '@/components/analysis/BodyVisualization'
import DateInputMMDDYYYY from '@/components/common/forms/DateInputMMDDYYYY'
import TextualAnalysisSection from '@/components/analysis/TextualAnalysisSection'
import FlexibilityAssessmentSection from '@/components/analysis/FlexibilityAssessmentSection'
import { useFlexibilityAssessmentForm } from '@/hooks'
import { FLEXIBILITY_EXERCISE_IDS } from '@/services/api'
import { calculateAge } from '@/utils/date.utils'
import './NewAnalysis.css'

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

function NewAnalysis() {
  const navigate = useNavigate()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAthleteDropdown, setShowAthleteDropdown] = useState(false)
  const { addAnalysis } = useAnalysisStore()

  // Textual Analysis (AI) results, reported up from TextualAnalysisSection
  const [aiAnalysisResults, setAiAnalysisResults] = useState<AIAnalysisResult[]>([])
  const [isAiGenerating, setIsAiGenerating] = useState(false)

  // Flexibility Assessment ratings + evidence photos (uploaded on submit, together with the rest of the analysis)
  const flexibilityForm = useFlexibilityAssessmentForm()

  const [formData, setFormData] = useState({
    athleteId: '',
    fechaEvaluacion: '',
    bodyMarks: [] as BodyMark[], // Marcas corporales de zonas afectadas

    // Conclusiones
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

  const [proximoIdPuntoDebil, setProximoIdPuntoDebil] = useState(1)

  // Evaluation date/time is tracked as separate date (DD/MM/YYYY) + time parts,
  // then combined into formData.fechaEvaluacion ('YYYY-MM-DDTHH:mm') so the
  // rest of the form/submit logic is unchanged.
  const [evalDatePart, setEvalDatePart] = useState('')
  const [evalTimePart, setEvalTimePart] = useState('')

  useEffect(() => {
    loadAthletes()
  }, [])

  const loadAthletes = async () => {
    try {
      const response = await athleteAPI.getAll()
      console.log('Athletes loaded:', response.data?.length || 0)
      setAthletes(response.data || [])
      if (response.data?.length === 0) {
        setMensaje({
            tipo: 'error',
            texto: 'No patients found in the database. Please create one first in the Patients section.'
          })
      }
    } catch (error) {
      console.error('Error loading athletes:', error)
      setMensaje({
        tipo: 'error',
        texto: 'Error loading patients. Please verify the backend is running.'
      })
    }
  }

  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.accessCode.includes(searchQuery)
  )

  const handleAthleteSelect = (athlete: Athlete) => {
    setSelectedAthlete(athlete)
    setFormData(prev => ({ ...prev, athleteId: athlete.id }))
    setSearchQuery(`${athlete.accessCode} - ${athlete.name}`)
    setShowAthleteDropdown(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEvalDateChange = (isoDate: string) => {
    setEvalDatePart(isoDate)
    if (!isoDate) {
      setFormData(prev => ({ ...prev, fechaEvaluacion: '' }))
      return
    }
    const time = evalTimePart || new Date().toTimeString().slice(0, 5)
    if (!evalTimePart) setEvalTimePart(time)
    setFormData(prev => ({ ...prev, fechaEvaluacion: `${isoDate}T${time}` }))
  }

  const handleEvalTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    setEvalTimePart(time)
    if (evalDatePart) {
      setFormData(prev => ({ ...prev, fechaEvaluacion: `${evalDatePart}T${time}` }))
    }
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

  // Manejar cambios en las marcas corporales
  const handleBodyMarksChange = (marks: BodyMark[]) => {
    setFormData(prev => ({
      ...prev,
      bodyMarks: marks
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedAthlete || !formData.athleteId) {
      setMensaje({ tipo: 'error', texto: 'You must select a patient before saving' })
      return
    }

    console.log('Selected Athlete ID:', formData.athleteId)
    console.log('Selected Athlete:', selectedAthlete)

    setGuardando(true)
    setMensaje(null)

    try {
      // Prepare data in the correct format for analysisAPI.create
      const submitData: any = {
        athleteId: formData.athleteId,
        evaluationDate: new Date(formData.fechaEvaluacion).toISOString(),
      }

      // Textual Analysis AI results (per-checkbox prompt + response history)
      if (aiAnalysisResults.length > 0) {
        submitData.aiAnalysisResults = aiAnalysisResults
      }

      // Preparar puntos débiles para envío
      const puntosDebilesTexto = formData.puntosDebiles
        .filter(p => p.area.trim() !== '') // Solo enviar puntos con área definida
        .map(p => ({ area: p.area, descripcion: p.descripcion }))

      if (puntosDebilesTexto.length > 0) {
        submitData.weakPoints = JSON.stringify(puntosDebilesTexto)
      }

      // Capacidades físicas
      if (formData.capacidadesFisicas.potencia > 0) submitData.power = formData.capacidadesFisicas.potencia
      if (formData.capacidadesFisicas.resistencia > 0) submitData.endurance = formData.capacidadesFisicas.resistencia
      if (formData.capacidadesFisicas.fuerza > 0) submitData.strength = formData.capacidadesFisicas.fuerza
      if (formData.capacidadesFisicas.flexibilidad > 0) submitData.flexibility = formData.capacidadesFisicas.flexibilidad
      if (formData.capacidadesFisicas.velocidad > 0) submitData.speed = formData.capacidadesFisicas.velocidad

      // Clasificación y recomendaciones
      if (formData.clasificacionCohorte) submitData.cohortClassification = formData.clasificacionCohorte
      if (formData.recomendaciones) submitData.coachRecommendations = formData.recomendaciones

      // Marcas corporales de zonas afectadas
      if (formData.bodyMarks.length > 0) {
        submitData.bodyMarks = JSON.stringify(formData.bodyMarks)
      }

      // Flexibility Assessment: only send exercises the user actually touched
      const flexibilityItems = FLEXIBILITY_EXERCISE_IDS
        .map((exerciseId) => flexibilityForm.items[exerciseId])
        .filter((item) => item.rating !== null || item.evidenceFile !== null)

      if (flexibilityItems.length > 0) {
        submitData.flexibilityAssessment = flexibilityItems.map(({ exerciseId, rating }) => ({ exerciseId, rating }))
        submitData.flexibilityEvidenceFiles = Object.fromEntries(
          flexibilityItems
            .filter((item) => item.evidenceFile !== null)
            .map((item) => [item.exerciseId, item.evidenceFile as File])
        )
      }

      const response = await analysisAPI.create(submitData)

      // Update store with new analysis
      addAnalysis(response.data)

      setMensaje({ tipo: 'success', texto: '✅ Analysis saved successfully' })

      setTimeout(() => {
        navigate(`/analysis-view/${response.data.id}`)
      }, 1500)

    } catch (error: any) {
      console.error('Error creating analysis:', error)
      console.error('Error response:', error.response?.data)
      let errorMessage = 'Error creating analysis'

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }

      setMensaje({
        tipo: 'error',
        texto: errorMessage
      })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <PageTemplate
      title="New Sports Assessment"
      subtitle="Comprehensive kinesiology evaluation with AI assistance"
      showBackButton={true}
      className="nuevo-analisis-page"
      breadcrumbItems={[
        { label: 'Assessments', path: '/analysis' },
        { label: 'New Assessment' }
      ]}
    >
      <div className="nuevo-analisis-container">
        {mensaje && (
          <div className={`mensaje ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="analisis-form">

          {/* SECTION 1 - General Information */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-number">1</span>
              General Information
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="athleteSearch">Patient / Code *</label>
                <div className="athlete-search-wrapper">
                  <IoSearch className="athlete-search-icon" />
                  <input
                    type="text"
                    id="athleteSearch"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowAthleteDropdown(true)
                    }}
                    onFocus={() => setShowAthleteDropdown(true)}
                    placeholder="Search by code or name..."
                    className="athlete-search-input"
                    required
                  />

                  {showAthleteDropdown && filteredAthletes.length > 0 && (
                    <div className="athlete-dropdown">
                      {filteredAthletes.slice(0, 5).map((athlete) => (
                        <div
                          key={athlete.id}
                          className="athlete-dropdown-item"
                          onClick={() => handleAthleteSelect(athlete)}
                        >
                          <span className="athlete-code">{athlete.accessCode}</span>
                          <span className="athlete-name">{athlete.name}</span>
                          <span className="athlete-sport">{athlete.sport}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="field-hint">
                  {selectedAthlete
                    ? `✓ Patient: ${selectedAthlete.name} - ${selectedAthlete.sport}`
                    : 'Enter the patient code or search by name'
                  }
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="fechaEvaluacion">Evaluation Date/Time *</label>
                <div className="eval-datetime-row">
                  <DateInputMMDDYYYY
                    id="fechaEvaluacion"
                    value={evalDatePart}
                    onChange={handleEvalDateChange}
                    required
                  />
                  <input
                    type="time"
                    value={evalTimePart}
                    onChange={handleEvalTimeChange}
                    aria-label="Evaluation time"
                    className="eval-time-input"
                  />
                </div>
              </div>
            </div>

            {/* Visualización Corporal - Zonas Afectadas */}
            <BodyVisualization
              marks={formData.bodyMarks}
              onChange={handleBodyMarksChange}
            />
          </div>

          {/* SECTION 2 - Flexibility Assessment */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-number">2</span>
              Flexibility Assessment
            </h3>
            <p className="section-description">
              Evaluate the patient's functional mobility through four standardized flexibility tests.
            </p>

            <FlexibilityAssessmentSection
              items={flexibilityForm.items}
              onRatingSelect={flexibilityForm.setRating}
              onEvidenceSelect={flexibilityForm.setEvidenceFile}
              onEvidenceRemove={(exerciseId) => flexibilityForm.setEvidenceFile(exerciseId, null)}
            />
          </div>

          {/* SECTION 3 - Textual Analysis with AI */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-number">3</span>
              Textual Analysis
            </h3>
            <p className="section-description">
              Select one or more analysis types, attach supporting files (PDF or images),
              and optionally add a prompt to focus the AI on specific aspects.
            </p>

            <TextualAnalysisSection
              patientId={selectedAthlete?.id}
              patientContext={{
                name: selectedAthlete?.name,
                age: selectedAthlete?.birthDate ? calculateAge(selectedAthlete.birthDate) : undefined,
                sport: selectedAthlete?.sport
              }}
              onResultsChange={setAiAnalysisResults}
              onGeneratingChange={setIsAiGenerating}
            />
          </div>

          {/* SECCIÓN 4 - Conclusiones y Plan */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-number">4</span>
              Conclusions and plan
            </h3>

            {/* Puntos Débiles */}
            <div className="subsection">
              <div className="subsection-header">
                <h4>Weak Points</h4>
                <button
                  type="button"
                  className="btn-agregar-punto"
                  onClick={handleAgregarPuntoDebil}
                >
                  <IoAdd /> Add weak point
                </button>
              </div>

              {formData.puntosDebiles.length === 0 ? (
                <p className="empty-message">
                  The AI will identify weak points automatically. You can also add them manually.
                </p>
              ) : (
                <div className="puntos-debiles-lista">
                  {formData.puntosDebiles.map((punto, index) => (
                    <div key={punto.id} className="punto-debil-item">
                        <span className="punto-numero">Weak point {index + 1}</span>
                      <div className="punto-debil-fields">
                        <input
                          type="text"
                          value={punto.area}
                          onChange={(e) => handlePuntoDebilChange(punto.id, 'area', e.target.value)}
                          placeholder="Problem area (e.g., Muscle fatigue)"
                          className="punto-debil-input area"
                          required
                        />
                        <input
                          type="text"
                          value={punto.descripcion}
                          onChange={(e) => handlePuntoDebilChange(punto.id, 'descripcion', e.target.value)}
                          placeholder="Description (optional)"
                          className="punto-debil-input descripcion"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-eliminar-punto"
                        onClick={() => handleEliminarPuntoDebil(punto.id)}
                      >
                        <IoTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Capacidades Físicas */}
            <div className="subsection">
              <h4>Physical Capacities</h4>
              <p className="subsection-description">
                Adjust these values manually based on your assessment.
              </p>

              <div className="capacidades-grid">
                <div className="capacidad-item">
                  <label htmlFor="potencia">Power</label>
                  <div className="capacidad-input-group">
                    <input
                      type="range"
                      id="potencia"
                      min="0"
                      max="100"
                      value={formData.capacidadesFisicas.potencia}
                      onChange={(e) => handleCapacidadChange('potencia', Number(e.target.value))}
                      className="capacidad-slider"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.capacidadesFisicas.potencia}
                      onChange={(e) => handleCapacidadChange('potencia', Number(e.target.value))}
                      className="capacidad-number"
                    />
                  </div>
                </div>

                <div className="capacidad-item">
                  <label htmlFor="resistencia">Endurance</label>
                  <div className="capacidad-input-group">
                    <input
                      type="range"
                      id="resistencia"
                      min="0"
                      max="100"
                      value={formData.capacidadesFisicas.resistencia}
                      onChange={(e) => handleCapacidadChange('resistencia', Number(e.target.value))}
                      className="capacidad-slider"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.capacidadesFisicas.resistencia}
                      onChange={(e) => handleCapacidadChange('resistencia', Number(e.target.value))}
                      className="capacidad-number"
                    />
                  </div>
                </div>

                <div className="capacidad-item">
                  <label htmlFor="fuerza">Strength</label>
                  <div className="capacidad-input-group">
                    <input
                      type="range"
                      id="fuerza"
                      min="0"
                      max="100"
                      value={formData.capacidadesFisicas.fuerza}
                      onChange={(e) => handleCapacidadChange('fuerza', Number(e.target.value))}
                      className="capacidad-slider"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.capacidadesFisicas.fuerza}
                      onChange={(e) => handleCapacidadChange('fuerza', Number(e.target.value))}
                      className="capacidad-number"
                    />
                  </div>
                </div>

                <div className="capacidad-item">
                  <label htmlFor="flexibilidad">Flexibility</label>
                  <div className="capacidad-input-group">
                    <input
                      type="range"
                      id="flexibilidad"
                      min="0"
                      max="100"
                      value={formData.capacidadesFisicas.flexibilidad}
                      onChange={(e) => handleCapacidadChange('flexibilidad', Number(e.target.value))}
                      className="capacidad-slider"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.capacidadesFisicas.flexibilidad}
                      onChange={(e) => handleCapacidadChange('flexibilidad', Number(e.target.value))}
                      className="capacidad-number"
                    />
                  </div>
                </div>

                <div className="capacidad-item">
                  <label htmlFor="velocidad">Speed</label>
                  <div className="capacidad-input-group">
                    <input
                      type="range"
                      id="velocidad"
                      min="0"
                      max="100"
                      value={formData.capacidadesFisicas.velocidad}
                      onChange={(e) => handleCapacidadChange('velocidad', Number(e.target.value))}
                      className="capacidad-slider"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.capacidadesFisicas.velocidad}
                      onChange={(e) => handleCapacidadChange('velocidad', Number(e.target.value))}
                      className="capacidad-number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Clasificación Cohorte */}
            <div className="subsection">
              <h4>Cohort Classification</h4>
                <p className="subsection-description">
                AI will determine the classification based on evaluated physical capacities.
              </p>
              <select
                className="form-select"
                name="clasificacionCohorte"
                value={formData.clasificacionCohorte}
                onChange={handleChange}
                required
              >
                <option value="">Select a classification</option>
                <option value="ELITE">Elite</option>
                <option value="AVANZADO">Advanced</option>
                <option value="INTERMEDIO">Intermediate</option>
                <option value="PRINCIPIANTE">Beginner</option>
                <option value="ATENCION_REQUERIDA">Attention Required</option>
              </select>
            </div>

            {/* Recomendaciones */}
            <div className="subsection">
              <h4>Recommendations for Coach</h4>
              <textarea
                name="recomendaciones"
                value={formData.recomendaciones}
                onChange={handleChange}
                rows={6}
                  placeholder="Write specific recommendations for the coach..."
                className="form-textarea-large"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary-large"
              onClick={() => navigate('/analysis')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-large"
              disabled={guardando || isAiGenerating}
              title={isAiGenerating ? 'Wait for AI analysis to finish before saving' : undefined}
            >
              {guardando ? '⏳ Saving...' : isAiGenerating ? 'Waiting for AI...' : '✓ Save Analysis'}
            </button>
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}

export default NewAnalysis
