import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoAdd, IoTrash, IoCloudUpload, IoSearch, IoCheckmark } from 'react-icons/io5'
import PageTemplate from '@/components/templates/PageTemplate'
import { athleteAPI, analysisAPI, Athlete } from '@/services/api'
import { useAnalysisStore } from '@/store/analysisStore'
import BodyVisualization, { BodyMark } from '@/components/analysis/BodyVisualization'
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

interface AnalysisCheckboxes {
  flexibilidad: boolean
  biobit: boolean
  asimetria: boolean
  controlMotor: boolean
  fatiga: boolean
  fuerzaInercia: boolean
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

  // Estados para el flujo de IA
  const [aiProcessing, setAiProcessing] = useState(false)
  const [aiProgress, setAiProgress] = useState(0)
  const [showAnalysisFields, setShowAnalysisFields] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [usedAI, setUsedAI] = useState(false) // Track if AI was used
  const [analysisCheckboxes, setAnalysisCheckboxes] = useState<AnalysisCheckboxes>({
    flexibilidad: false,
    biobit: false,
    asimetria: false,
    controlMotor: false,
    fatiga: false,
    fuerzaInercia: false
  })

  const [formData, setFormData] = useState({
    athleteId: '',
    fechaEvaluacion: '',
    imagenes: [] as File[],
    bodyMarks: [] as BodyMark[], // Marcas corporales de zonas afectadas

    // Análisis Textual
    analisisFlexibilidad: '',
    analisisBiobit: '',
    asimetriaMuscular: '',
    controlMotorActivo: '',
    fatigaMuscular: '',
    controlFuerzaInercia: '',

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

  const [imagenesPreview, setImagenesPreview] = useState<string[]>([])
  const [proximoIdPuntoDebil, setProximoIdPuntoDebil] = useState(1)

  useEffect(() => {
    loadAthletes()

    // Monitorear conexión a internet
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
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

  const handleCapacidadChange = (capacidad: keyof CapacidadesFisicas, value: number) => {
    setFormData(prev => ({
      ...prev,
      capacidadesFisicas: {
        ...prev.capacidadesFisicas,
        [capacidad]: value
      }
    }))
  }

  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, ...files] }))

      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagenesPreview(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleEliminarImagen = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }))
    setImagenesPreview(prev => prev.filter((_, i) => i !== index))
  }

  const handleCheckboxChange = (field: keyof AnalysisCheckboxes) => {
    setAnalysisCheckboxes(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleManualAnalysis = () => {
    // Mostrar todos los campos de análisis sin IA
    setAnalysisCheckboxes({
      flexibilidad: true,
      biobit: true,
      asimetria: true,
      controlMotor: true,
      fatiga: true,
      fuerzaInercia: true
    })
    setShowAnalysisFields(true)
    setUsedAI(false)
    setMensaje({ tipo: 'success', texto: 'Manual mode activated. Please complete the fields manually.' })
  }

  const handleGenerateAIAnalysis = async () => {
    // Verificar conexión a internet
    if (!isOnline) {
      setMensaje({ tipo: 'error', texto: 'No internet connection. Use manual mode or connect to use AI.' })
      return
    }

    // Verificar que haya al menos un checkbox seleccionado
    const hasSelected = Object.values(analysisCheckboxes).some(val => val)
    if (!hasSelected) {
      setMensaje({ tipo: 'error', texto: 'Select at least one analysis type to generate' })
      return
    }

    if (formData.imagenes.length === 0) {
      setMensaje({ tipo: 'error', texto: 'You must upload at least one image for AI analysis' })
      return
    }

    setAiProcessing(true)
    setAiProgress(0)
    setMensaje(null)

    try {
      // Simular progreso visual mientras se procesa
      const progressInterval = setInterval(() => {
        setAiProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Llamar al endpoint real de IA
      const response = await analysisAPI.aiAnalyze(formData.imagenes, analysisCheckboxes)

      clearInterval(progressInterval)
      setAiProgress(100)

      // Mapear nombres de campos del backend (inglés) al frontend (español)
      const mappedData: any = {}

      // Análisis textuales
      if (response.data.flexibilityAnalysis) mappedData.analisisFlexibilidad = response.data.flexibilityAnalysis
      if (response.data.biobitAnalysis) mappedData.analisisBiobit = response.data.biobitAnalysis
      if (response.data.muscularAsymmetry) mappedData.asimetriaMuscular = response.data.muscularAsymmetry
      if (response.data.activeMotorControl) mappedData.controlMotorActivo = response.data.activeMotorControl
      if (response.data.functionalMuscleFatigue) mappedData.fatigaMuscular = response.data.functionalMuscleFatigue
      if (response.data.inertiaForceControl) mappedData.controlFuerzaInercia = response.data.inertiaForceControl

      // Conclusiones
      if (response.data.weakPoints) {
        mappedData.puntosDebiles = response.data.weakPoints.map((wp: any, index: number) => ({
          id: Date.now() + index, // Generar ID único
          area: wp.area,
          descripcion: wp.descripcion
        }))
      }
      if (response.data.physicalCapacities) {
        mappedData.capacidadesFisicas = {
          potencia: response.data.physicalCapacities.potencia || 0,
          resistencia: response.data.physicalCapacities.resistencia || 0,
          fuerza: response.data.physicalCapacities.fuerza || 0,
          flexibilidad: response.data.physicalCapacities.flexibilidad || 0,
          velocidad: response.data.physicalCapacities.velocidad || 0
        }
      }
      if (response.data.cohortClassification) {
        mappedData.clasificacionCohorte = response.data.cohortClassification
      }

      // Actualizar formData con los resultados mapeados
      setFormData(prev => ({ ...prev, ...mappedData }))
      setShowAnalysisFields(true)
      setUsedAI(true)
      setMensaje({ tipo: 'success', texto: '✅ AI analysis completed. You can edit the generated fields.' })
    } catch (error: any) {
      console.error('Error in AI analysis:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Error processing AI analysis'
      setMensaje({ tipo: 'error', texto: errorMessage })
    } finally {
      setAiProcessing(false)
    }
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
        graphs: formData.imagenes, // File[] array
      }

      // Análisis textuales
      if (formData.analisisFlexibilidad) submitData.flexibilityAnalysis = formData.analisisFlexibilidad
      if (formData.analisisBiobit) submitData.biobitAnalysis = formData.analisisBiobit
      if (formData.asimetriaMuscular) submitData.muscularAsymmetry = formData.asimetriaMuscular
      if (formData.controlMotorActivo) submitData.activeMotorControl = formData.controlMotorActivo
      if (formData.fatigaMuscular) submitData.functionalMuscleFatigue = formData.fatigaMuscular
      if (formData.controlFuerzaInercia) submitData.inertiaForceControl = formData.controlFuerzaInercia

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
        { label: 'Home', path: '/dashboard' },
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

          {/* SECTION 1 - General Information & Graphs */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-number">1</span>
              General Information & Graphs
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="athleteSearch">Patient / Code *</label>
                <div className="athlete-search-wrapper">
                  <input
                    type="text"
                    id="athleteSearch"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowAthleteDropdown(true)
                    }}
                    onFocus={() => setShowAthleteDropdown(true)}
                    placeholder="Search by code or name"
                    required
                  />
                  <IoSearch className="search-icon" />

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
                <input
                  type="datetime-local"
                  id="fechaEvaluacion"
                  name="fechaEvaluacion"
                  value={formData.fechaEvaluacion}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Attach Graph Images</label>
              <div className="upload-zone">
                <input
                  type="file"
                  id="imagenes-input"
                  accept="image/*"
                  multiple
                  onChange={handleImagenesChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="imagenes-input" className="upload-label">
                  <IoCloudUpload />
                  <span>Upload images</span>
                  <p>Click to select graph images</p>
                </label>
              </div>

              {imagenesPreview.length > 0 && (
                <div className="imagenes-grid">
                  {imagenesPreview.map((preview, index) => (
                    <div key={index} className="imagen-preview-item">
                      <img src={preview} alt={`Chart ${index + 1}`} />
                      <button
                        type="button"
                        className="btn-eliminar-imagen"
                        onClick={() => handleEliminarImagen(index)}
                      >
                        <IoTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.imagenes.length === 0 && (
                <div className="image-required-message">
                  You must upload at least one image for AI analysis
                </div>
              )}
            </div>

            {/* Visualización Corporal - Zonas Afectadas */}
            <BodyVisualization
              marks={formData.bodyMarks}
              onChange={handleBodyMarksChange}
            />
          </div>

          {/* SECTION 2 - Textual Analysis with AI */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-number">2</span>
              Textual Analysis
            </h3>
            <p className="section-description">
              Select the types of analysis you want to generate with AI.
              The AI will analyze attached images and generate detailed reports.
            </p>

            {!showAnalysisFields ? (
              <>
                <div className="ai-checkbox-grid">
                  <label className="ai-checkbox-item">
                    <input
                      type="checkbox"
                      checked={analysisCheckboxes.flexibilidad}
                      onChange={() => handleCheckboxChange('flexibilidad')}
                    />
                    <span className="checkbox-label">
                      <IoCheckmark className="check-icon" />
                      1. Flexibility Analysis
                    </span>
                    <p className="checkbox-description">
                      AI will analyze range of motion and joint flexibility
                    </p>
                  </label>

                  <label className="ai-checkbox-item">
                    <input
                      type="checkbox"
                      checked={analysisCheckboxes.biobit}
                      onChange={() => handleCheckboxChange('biobit')}
                    />
                    <span className="checkbox-label">
                      <IoCheckmark className="check-icon" />
                      2. Biobit Analysis
                    </span>
                    <p className="checkbox-description">
                      AI will evaluate muscle activation patterns
                    </p>
                  </label>

                  <label className="ai-checkbox-item">
                    <input
                      type="checkbox"
                      checked={analysisCheckboxes.asimetria}
                      onChange={() => handleCheckboxChange('asimetria')}
                    />
                    <span className="checkbox-label">
                      <IoCheckmark className="check-icon" />
                      3. Muscular Activation Asymmetry
                    </span>
                    <p className="checkbox-description">
                      AI will detect bilateral muscle imbalances
                    </p>
                  </label>

                  <label className="ai-checkbox-item">
                    <input
                      type="checkbox"
                      checked={analysisCheckboxes.controlMotor}
                      onChange={() => handleCheckboxChange('controlMotor')}
                    />
                    <span className="checkbox-label">
                      <IoCheckmark className="check-icon" />
                      4. Active Motor Control Analysis
                    </span>
                    <p className="checkbox-description">
                      AI will evaluate neuromuscular stability and control
                    </p>
                  </label>

                  <label className="ai-checkbox-item">
                    <input
                      type="checkbox"
                      checked={analysisCheckboxes.fatiga}
                      onChange={() => handleCheckboxChange('fatiga')}
                    />
                    <span className="checkbox-label">
                      <IoCheckmark className="check-icon" />
                      5. Functional Muscle Fatigue Analysis
                    </span>
                    <p className="checkbox-description">
                      AI will measure endurance and fatigue indices
                    </p>
                  </label>

                  <label className="ai-checkbox-item">
                    <input
                      type="checkbox"
                      checked={analysisCheckboxes.fuerzaInercia}
                      onChange={() => handleCheckboxChange('fuerzaInercia')}
                    />
                    <span className="checkbox-label">
                      <IoCheckmark className="check-icon" />
                      6. Inertia Force Control Analysis
                    </span>
                    <p className="checkbox-description">
                      AI will analyze force generation and control capacity
                    </p>
                  </label>
                </div>


                <button
                  type="button"
                  className="btn-generate-ai"
                  onClick={handleGenerateAIAnalysis}
                  disabled={aiProcessing || !isOnline}
                >
                  {aiProcessing ? 'Analyzing with AI...' : 'Generate AI Analysis'}
                  {!isOnline && ' (Offline)'}
                </button>

                <button
                  type="button"
                  className="btn-manual-analysis"
                  onClick={handleManualAnalysis}
                  disabled={aiProcessing}
                >
                  Perform Manual Analysis
                </button>

                {aiProcessing && (
                  <div className="ai-progress-container">
                    <div className="ai-progress-bar">
                      <div
                        className="ai-progress-fill"
                        style={{ width: `${aiProgress}%` }}
                      ></div>
                    </div>
                    <p className="ai-progress-text">
                      Processing images and generating analysis... {aiProgress}%
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="analisis-textual-grid">
                {usedAI && (
                  <div className="ai-disclaimer">
                    ℹ️ <strong>AI-generated analysis:</strong> Based on visual patterns from EMG graphs.
                    Percentages and values are approximate estimates. Clinical validation is recommended.
                  </div>
                )}
                {analysisCheckboxes.flexibilidad && (
                  <div className="form-group">
                    <label htmlFor="analisisFlexibilidad">
                      1. Flexibility Analysis
                      {usedAI && <span className="ai-badge">Generated by AI</span>}
                    </label>
                    <textarea
                      id="analisisFlexibilidad"
                      name="analisisFlexibilidad"
                      value={formData.analisisFlexibilidad}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>
                )}

                {analysisCheckboxes.biobit && (
                  <div className="form-group">
                    <label htmlFor="analisisBiobit">
                      2. Biobit Analysis
                      {usedAI && <span className="ai-badge">Generated by AI</span>}
                    </label>
                    <textarea
                      id="analisisBiobit"
                      name="analisisBiobit"
                      value={formData.analisisBiobit}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>
                )}

                {analysisCheckboxes.asimetria && (
                  <div className="form-group">
                    <label htmlFor="asimetriaMuscular">
                      3. Muscular Activation Asymmetry
                      {usedAI && <span className="ai-badge">Generated by AI</span>}
                    </label>
                    <textarea
                      id="asimetriaMuscular"
                      name="asimetriaMuscular"
                      value={formData.asimetriaMuscular}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>
                )}

                {analysisCheckboxes.controlMotor && (
                  <div className="form-group">
                    <label htmlFor="controlMotorActivo">
                      4. Active Motor Control Analysis
                      {usedAI && <span className="ai-badge">Generated by AI</span>}
                    </label>
                    <textarea
                      id="controlMotorActivo"
                      name="controlMotorActivo"
                      value={formData.controlMotorActivo}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>
                )}

                {analysisCheckboxes.fatiga && (
                  <div className="form-group">
                    <label htmlFor="fatigaMuscular">
                      5. Functional Muscle Fatigue Analysis
                      {usedAI && <span className="ai-badge">Generated by AI</span>}
                    </label>
                    <textarea
                      id="fatigaMuscular"
                      name="fatigaMuscular"
                      value={formData.fatigaMuscular}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>
                )}

                {analysisCheckboxes.fuerzaInercia && (
                  <div className="form-group">
                    <label htmlFor="controlFuerzaInercia">
                      6. Inertia Force Control Analysis
                      {usedAI && <span className="ai-badge">Generated by AI</span>}
                    </label>
                    <textarea
                      id="controlFuerzaInercia"
                      name="controlFuerzaInercia"
                      value={formData.controlFuerzaInercia}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>
                )}

                <button
                  type="button"
                  className="btn-regenerate"
                  onClick={() => {
                    setShowAnalysisFields(false)
                    setUsedAI(false)
                    setAiProgress(0)
                  }}
                >
                  {usedAI ? 'Regenerate with AI' : 'Generate with AI'}
                </button>
              </div>
            )}
          </div>

          {/* SECCIÓN 3 - Conclusiones y Plan */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-number">3</span>
              Conclusiones y Plan
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
                The AI will estimate these values based on the analysis. You can adjust them manually.
              </p>
              {!isOnline && (
                <div className="offline-warning">
                  ⚠️ AI-based physical capacities analysis not available offline
                </div>
              )}

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
              <h4>Clasificación Cohorte</h4>
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
                <option value="AVANZADO">Avanzado</option>
                <option value="INTERMEDIO">Intermedio</option>
                <option value="PRINCIPIANTE">Principiante</option>
                <option value="ATENCION_REQUERIDA">Atención Requerida</option>
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
              disabled={guardando}
            >
              {guardando ? '⏳ Saving...' : '✓ Save Analysis'}
            </button>
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}

export default NewAnalysis
