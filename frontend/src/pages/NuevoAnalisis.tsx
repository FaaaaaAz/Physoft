import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoDocument, IoImage, IoAdd, IoTrash, IoCloudUpload, IoSearch } from 'react-icons/io5'
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

function NuevoAnalisis() {
  const navigate = useNavigate()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAthleteDropdown, setShowAthleteDropdown] = useState(false)

  const [formData, setFormData] = useState({
    // Sección 1
    athleteId: '',
    fechaEvaluacion: '',
    imagenes: [] as File[],
    
    // Sección 2 - Análisis Textual
    analisisFlexibilidad: '',
    analisisBiobit: '',
    asimetriaMuscular: '',
    controlMotorActivo: '',
    fatigaMuscular: '',
    controlFuerzaInercia: '',
    
    // Sección 3
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

  // Load athletes on mount
  useEffect(() => {
    loadAthletes()
  }, [])

  const loadAthletes = async () => {
    try {
      const response = await athleteAPI.getAll()
      setAthletes(response.data || [])
    } catch (error) {
      console.error('Error loading athletes:', error)
    }
  }

  // Filter athletes based on search
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
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, ...files] }))
      
      // Crear previews
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

  const handleAgregarPuntoDebil = () => {
    setFormData(prev => ({
      ...prev,
      puntosDebiles: [...prev.puntosDebiles, { id: proximoIdPuntoDebil, texto: '' }]
    }))
    setProximoIdPuntoDebil(prev => prev + 1)
  }

  const handleEliminarPuntoDebil = (id: number) => {
    setFormData(prev => ({
      ...prev,
      puntosDebiles: prev.puntosDebiles.filter(p => p.id !== id)
    }))
  }

  const handlePuntoDebilChange = (id: number, texto: string) => {
    setFormData(prev => ({
      ...prev,
      puntosDebiles: prev.puntosDebiles.map(p => 
        p.id === id ? { ...p, texto } : p
      )
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validación básica
    if (!formData.athleteId) {
      setMensaje({ tipo: 'error', texto: 'Debe seleccionar un atleta' })
      return
    }
    if (!formData.fechaEvaluacion) {
      setMensaje({ tipo: 'error', texto: 'La fecha de evaluación es obligatoria' })
      return
    }

    setGuardando(true)
    setMensaje(null)

    try {
      // Prepare weak points as JSON array
      const weakPointsArray = formData.puntosDebiles
        .filter(p => p.texto.trim() !== '')
        .map(p => p.texto)

      // Create analysis DTO
      const analysisData = {
        athleteId: formData.athleteId,
        evaluationDate: new Date(formData.fechaEvaluacion).toISOString(),
        flexibilityAnalysis: formData.analisisFlexibilidad || undefined,
        biobitAnalysis: formData.analisisBiobit || undefined,
        muscularAsymmetry: formData.asimetriaMuscular || undefined,
        activeMotorControl: formData.controlMotorActivo || undefined,
        functionalMuscleFatigue: formData.fatigaMuscular || undefined,
        inertiaForceControl: formData.controlFuerzaInercia || undefined,
        weakPoints: weakPointsArray.length > 0 ? JSON.stringify(weakPointsArray) : undefined,
        power: formData.capacidadesFisicas.potencia || undefined,
        endurance: formData.capacidadesFisicas.resistencia || undefined,
        strength: formData.capacidadesFisicas.fuerza || undefined,
        flexibility: formData.capacidadesFisicas.flexibilidad || undefined,
        speed: formData.capacidadesFisicas.velocidad || undefined,
        globalClassification: formData.clasificacionCohorte || undefined,
        coachRecommendations: formData.recomendaciones || undefined,
        graphs: formData.imagenes.length > 0 ? formData.imagenes : undefined
      }

      const response = await analysisAPI.create(analysisData)
      
      setMensaje({ tipo: 'success', texto: '✅ Análisis guardado exitosamente' })
      
      setTimeout(() => {
        navigate('/analysis')
      }, 2000)
    } catch (error: any) {
      console.error('Error creating analysis:', error)
      setMensaje({ 
        tipo: 'error', 
        texto: `❌ Error: ${error.response?.data?.error || error.message}` 
      })
    } finally {
      setGuardando(false)
    }
  }

  const handleGenerarReporte = () => {
    alert('Funcionalidad de generación de PDF en desarrollo')
  }

  return (
    <PageTemplate
      title="Análisis Deportivo"
      subtitle="Formulario de evaluación kinesiológica"
      showBackButton={true}
      backTo="/analysis"
      className="nuevo-analisis-page"
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
                    ? `Atleta seleccionado: ${selectedAthlete.name} - ${selectedAthlete.sport}`
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
            </div>
          </div>

          {/* SECCIÓN 2 - Análisis Textual */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-number">2</span>
              Análisis Textual
            </h3>
            <p className="section-description">
              Los siguientes campos serán completados automáticamente por IA basándose en las imágenes adjuntadas. 
              También puede editarlos manualmente.
            </p>

            <div className="analisis-textual-grid">
              <div className="form-group">
                <label htmlFor="analisisFlexibilidad">1. Análisis de flexibilidad</label>
                <textarea
                  id="analisisFlexibilidad"
                  name="analisisFlexibilidad"
                  value={formData.analisisFlexibilidad}
                  onChange={handleChange}
                  rows={4}
                  placeholder="La IA analizará la flexibilidad basándose en los gráficos..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="analisisBiobit">2. Análisis Biobit</label>
                <textarea
                  id="analisisBiobit"
                  name="analisisBiobit"
                  value={formData.analisisBiobit}
                  onChange={handleChange}
                  rows={4}
                  placeholder="La IA analizará los datos de Biobit..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="asimetriaMuscular">3. Asimetría muscular en activación</label>
                <textarea
                  id="asimetriaMuscular"
                  name="asimetriaMuscular"
                  value={formData.asimetriaMuscular}
                  onChange={handleChange}
                  rows={4}
                  placeholder="La IA detectará asimetrías musculares..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="controlMotorActivo">4. Análisis de control motor activo</label>
                <textarea
                  id="controlMotorActivo"
                  name="controlMotorActivo"
                  value={formData.controlMotorActivo}
                  onChange={handleChange}
                  rows={4}
                  placeholder="La IA evaluará el control motor..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="fatigaMuscular">5. Análisis de fatiga muscular funcional</label>
                <textarea
                  id="fatigaMuscular"
                  name="fatigaMuscular"
                  value={formData.fatigaMuscular}
                  onChange={handleChange}
                  rows={4}
                  placeholder="La IA analizará la fatiga muscular..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="controlFuerzaInercia">6. Análisis de control de fuerza inercia</label>
                <textarea
                  id="controlFuerzaInercia"
                  name="controlFuerzaInercia"
                  value={formData.controlFuerzaInercia}
                  onChange={handleChange}
                  rows={4}
                  placeholder="La IA analizará el control de fuerza e inercia..."
                />
              </div>
            </div>
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
                  La IA identificará los puntos débiles automáticamente. 
                  También puede agregarlos manualmente.
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
              onClick={handleGenerarReporte}
            >
              <IoDocument /> Generar Reporte PDF
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
