import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoAdd, IoTrash, IoCloudUpload, IoSearch, IoCheckmark } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import { athleteAPI, analysisAPI, Athlete } from '../services/api'
import '../styles/NuevoAnalisis.css'

interface PuntoDebil {
  id: number
  texto: string
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

function NuevoAnalisis() {
  const navigate = useNavigate()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAthleteDropdown, setShowAthleteDropdown] = useState(false)

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
          texto: 'No hay atletas en la base de datos. Crea uno primero en la sección de Atletas.' 
        })
      }
    } catch (error) {
      console.error('Error loading athletes:', error)
      setMensaje({ 
        tipo: 'error', 
        texto: 'Error al cargar atletas. Verifica que el backend esté funcionando.' 
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
    setMensaje({ tipo: 'success', texto: 'Modo manual activado. Completa los campos manualmente.' })
  }

  const handleGenerateAIAnalysis = async () => {
    // Verificar conexión a internet
    if (!isOnline) {
      setMensaje({ tipo: 'error', texto: 'No hay conexión a internet. Usa el modo manual o conéctate para usar IA.' })
      return
    }

    // Verificar que haya al menos un checkbox seleccionado
    const hasSelected = Object.values(analysisCheckboxes).some(val => val)
    if (!hasSelected) {
      setMensaje({ tipo: 'error', texto: 'Selecciona al menos un tipo de análisis para generar' })
      return
    }

    if (formData.imagenes.length === 0) {
      setMensaje({ tipo: 'error', texto: 'Debes subir al menos una imagen para el análisis de IA' })
      return
    }

    setAiProcessing(true)
    setAiProgress(0)

    // Simular progreso de IA
    const interval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simular tiempo de procesamiento
    setTimeout(() => {
      clearInterval(interval)
      setAiProgress(100)
      
      // Generar análisis simulados basados en los checkboxes seleccionados
      const simulatedAnalysis: any = {}

      if (analysisCheckboxes.flexibilidad) {
        simulatedAnalysis.analisisFlexibilidad = 'Análisis de flexibilidad generado por IA: Se observa un rango de movimiento adecuado en las principales articulaciones. Flexión de cadera: 85°, extensión de rodilla: 30°, dorsiflexión de tobillo: 20°. Recomendación: mantener rutina de estiramiento dinámico.'
      }

      if (analysisCheckboxes.biobit) {
        simulatedAnalysis.analisisBiobit = 'Análisis Biobit generado por IA: Activación muscular simétrica detectada en un 92%. Patrón de disparo óptimo en cuádriceps y glúteos. Se detecta un retraso menor de 12ms en tibial anterior izquierdo.'
      }

      if (analysisCheckboxes.asimetria) {
        simulatedAnalysis.asimetriaMuscular = 'Análisis de asimetría muscular generado por IA: Dominancia de pierna derecha evidente con 8% mayor amplitud EMG. Complejo aductor izquierdo muestra 15% menos activación durante movimientos laterales.'
      }

      if (analysisCheckboxes.controlMotor) {
        simulatedAnalysis.controlMotorActivo = 'Análisis de control motor generado por IA: Respuesta propioceptiva superior. Test de equilibrio monopodal: 45s ojos abiertos, 28s ojos cerrados. Estabilidad del core en percentil 95.'
      }

      if (analysisCheckboxes.fatiga) {
        simulatedAnalysis.fatigaMuscular = 'Análisis de fatiga muscular generado por IA: Índice de fatiga al 18% después del protocolo de 30min. Declive moderado en potencia explosiva (-12%) en series finales. Tiempo de recuperación recomendado: 48-52 horas.'
      }

      if (analysisCheckboxes.fuerzaInercia) {
        simulatedAnalysis.controlFuerzaInercia = 'Análisis de control de fuerza e inercia generado por IA: Mecánica de desaceleración excepcional. Fuerzas de reacción del suelo bien distribuidas. Ratio de fuerza excéntrica: 1.15 (rango óptimo).'
      }

      setFormData(prev => ({ ...prev, ...simulatedAnalysis }))
      setShowAnalysisFields(true)
      setUsedAI(true)
      setAiProcessing(false)
      setMensaje({ tipo: 'success', texto: 'Análisis de IA completado. Puedes editar los campos generados.' })
    }, 3500)
  }

  const handleAgregarPuntoDebil = () => {
    const nuevoPunto: PuntoDebil = {
      id: proximoIdPuntoDebil,
      texto: ''
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

  const handlePuntoDebilChange = (id: number, valor: string) => {
    setFormData(prev => ({
      ...prev,
      puntosDebiles: prev.puntosDebiles.map(p => 
        p.id === id ? { ...p, texto: valor } : p
      )
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!selectedAthlete || !formData.athleteId) {
      setMensaje({ tipo: 'error', texto: 'Debes seleccionar un atleta antes de guardar' })
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
      
      // Puntos débiles
      const puntosDebilesTexto = formData.puntosDebiles
        .filter(p => p.texto.trim())
        .map(p => p.texto)
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
      if (formData.clasificacionCohorte) submitData.globalClassification = formData.clasificacionCohorte
      if (formData.recomendaciones) submitData.coachRecommendations = formData.recomendaciones

      const response = await analysisAPI.create(submitData)
      
      setMensaje({ tipo: 'success', texto: '✅ Análisis guardado exitosamente' })
      
      setTimeout(() => {
        navigate(`/analysis-view/${response.data.id}`)
      }, 1500)
      
    } catch (error: any) {
      console.error('Error creating analysis:', error)
      console.error('Error response:', error.response?.data)
      let errorMessage = 'Error al crear el análisis'
      
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
      title="Nuevo Análisis Deportivo"
      subtitle="Evaluación kinesiológica completa con asistencia de IA"
      showBackButton={true}
      backTo="/analysis"
      className="nuevo-analisis-page"
      breadcrumbItems={[
        { label: 'Inicio', path: '/dashboard' },
        { label: 'Análisis', path: '/analisis' },
        { label: 'Nuevo Análisis' }
      ]}
    >
      <div className="nuevo-analisis-container">
        {mensaje && (
          <div className={`mensaje ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="analisis-form">
          
          {/* SECCIÓN 1 - Información General y Gráficos */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-number">1</span>
              Información General y Gráficos
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="athleteSearch">Atleta / Código *</label>
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
                    placeholder="Buscar por código o nombre"
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
                    ? `✓ Atleta: ${selectedAthlete.name} - ${selectedAthlete.sport}`
                    : 'Ingrese el código del atleta o búsquelo por nombre'
                  }
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="fechaEvaluacion">Fecha/Hora - Evaluación *</label>
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
              <label>Adjuntar imágenes de Gráficos</label>
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
                  <span>Subir imágenes</span>
                  <p>Haga clic para seleccionar imágenes de los gráficos</p>
                </label>
              </div>

              {imagenesPreview.length > 0 && (
                <div className="imagenes-grid">
                  {imagenesPreview.map((preview, index) => (
                    <div key={index} className="imagen-preview-item">
                      <img src={preview} alt={`Gráfico ${index + 1}`} />
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
                  Debes subir al menos una imagen para el análisis de IA
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN 2 - Análisis Textual con IA */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-number">2</span>
              Análisis Textual
            </h3>
            <p className="section-description">
              Selecciona los tipos de análisis que deseas generar con IA. 
              La IA analizará las imágenes adjuntadas y generará informes detallados.
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
                      1. Análisis de flexibilidad
                    </span>
                    <p className="checkbox-description">
                      La IA analizará rangos de movimiento y flexibilidad articular
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
                      2. Análisis Biobit
                    </span>
                    <p className="checkbox-description">
                      La IA evaluará patrones de activación muscular
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
                      3. Asimetría muscular en activación
                    </span>
                    <p className="checkbox-description">
                      La IA detectará desequilibrios musculares bilaterales
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
                      4. Análisis de control motor activo
                    </span>
                    <p className="checkbox-description">
                      La IA evaluará estabilidad y control neuromuscular
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
                      5. Análisis de fatiga muscular funcional
                    </span>
                    <p className="checkbox-description">
                      La IA medirá resistencia y índices de fatiga
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
                      6. Análisis de control de fuerza inercia
                    </span>
                    <p className="checkbox-description">
                      La IA analizará capacidad de generación y control de fuerza
                    </p>
                  </label>
                </div>

                <button
                  type="button"
                  className="btn-generate-ai"
                  onClick={handleGenerateAIAnalysis}
                  disabled={aiProcessing || !isOnline}
                >
                  {aiProcessing ? 'Analizando con IA...' : 'Generar Análisis con IA'}
                  {!isOnline && ' (Sin conexión)'}
                </button>

                <button
                  type="button"
                  className="btn-manual-analysis"
                  onClick={handleManualAnalysis}
                  disabled={aiProcessing}
                >
                  Realizar Análisis Manual
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
                      Procesando imágenes y generando análisis... {aiProgress}%
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="analisis-textual-grid">
                {analysisCheckboxes.flexibilidad && (
                  <div className="form-group">
                    <label htmlFor="analisisFlexibilidad">
                      1. Análisis de flexibilidad
                      {usedAI && <span className="ai-badge">Generado por IA</span>}
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
                      2. Análisis Biobit
                      {usedAI && <span className="ai-badge">Generado por IA</span>}
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
                      3. Asimetría muscular en activación
                      {usedAI && <span className="ai-badge">Generado por IA</span>}
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
                      4. Análisis de control motor activo
                      {usedAI && <span className="ai-badge">Generado por IA</span>}
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
                      5. Análisis de fatiga muscular funcional
                      {usedAI && <span className="ai-badge">Generado por IA</span>}
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
                      6. Análisis de control de fuerza inercia
                      {usedAI && <span className="ai-badge">Generado por IA</span>}
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
                  {usedAI ? 'Volver a generar con IA' : 'Generar con IA'}
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
                <h4>Puntos débiles</h4>
                <button
                  type="button"
                  className="btn-agregar-punto"
                  onClick={handleAgregarPuntoDebil}
                >
                  <IoAdd /> Agregar punto débil
                </button>
              </div>
              
              {formData.puntosDebiles.length === 0 ? (
                <p className="empty-message">
                  La IA identificará los puntos débiles automáticamente. También puede agregarlos manualmente.
                </p>
              ) : (
                <div className="puntos-debiles-lista">
                  {formData.puntosDebiles.map((punto, index) => (
                    <div key={punto.id} className="punto-debil-item">
                      <span className="punto-numero">Punto débil {index + 1}</span>
                      <input
                        type="text"
                        value={punto.texto}
                        onChange={(e) => handlePuntoDebilChange(punto.id, e.target.value)}
                        placeholder="Describa el punto débil..."
                        className="punto-debil-input"
                      />
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
              <h4>Capacidades físicas</h4>
              <p className="subsection-description">
                La IA evaluará estos valores basándose en el análisis. Puede ajustarlos manualmente.
              </p>
              {!isOnline && (
                <div className="offline-warning">
                  ⚠️ Análisis de Capacidades físicas con IA no disponible sin conexión
                </div>
              )}
              
              <div className="capacidades-grid">
                <div className="capacidad-item">
                  <label htmlFor="potencia">Potencia</label>
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
                  <label htmlFor="resistencia">Resistencia</label>
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
                  <label htmlFor="fuerza">Fuerza</label>
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
                  <label htmlFor="flexibilidad">Flexibilidad</label>
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
                  <label htmlFor="velocidad">Velocidad</label>
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

            {/* Clasificación Global */}
            <div className="subsection">
              <h4>Clasificación global vs cohorte</h4>
              <p className="subsection-description">
                La IA determinará la clasificación basándose en las capacidades físicas evaluadas.
              </p>
              <select
                name="clasificacionCohorte"
                value={formData.clasificacionCohorte}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Seleccionar clasificación</option>
                <option value="low">Por debajo del promedio (Bajo)</option>
                <option value="medium">En el promedio (Medio)</option>
                <option value="high">Por encima del promedio (Alto)</option>
              </select>
            </div>

            {/* Recomendaciones */}
            <div className="subsection">
              <h4>Recomendaciones para el entrenador</h4>
              <textarea
                name="recomendaciones"
                value={formData.recomendaciones}
                onChange={handleChange}
                rows={6}
                placeholder="Escriba las recomendaciones específicas para el entrenador..."
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
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary-large"
              disabled={guardando}
            >
              {guardando ? '⏳ Guardando...' : '✓ Guardar Análisis'}
            </button>
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}

export default NuevoAnalisis
