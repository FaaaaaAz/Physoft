import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoDocument, IoImage, IoAdd, IoTrash, IoCloudUpload } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
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

  const [formData, setFormData] = useState({
    // Sección 1
    atletaCodigo: '',
    atletaNombre: '',
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
    if (!formData.atletaCodigo && !formData.atletaNombre) {
      setMensaje({ tipo: 'error', texto: 'Debe seleccionar o ingresar un atleta' })
      return
    }
    if (!formData.fechaEvaluacion) {
      setMensaje({ tipo: 'error', texto: 'La fecha de evaluación es obligatoria' })
      return
    }

    setGuardando(true)
    setMensaje(null)

    try {
      // Aquí irá la lógica para guardar el análisis
      console.log('Análisis guardado:', formData)
      
      setMensaje({ tipo: 'success', texto: '✅ Análisis guardado exitosamente' })
      
      setTimeout(() => {
        navigate('/analisis')
      }, 2000)
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: `❌ Error: ${error.message}` })
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
      backTo="/analisis"
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
                <label htmlFor="atletaCodigo">Atleta / Código *</label>
                <input
                  type="text"
                  id="atletaCodigo"
                  name="atletaCodigo"
                  value={formData.atletaCodigo}
                  onChange={handleChange}
                  placeholder="Buscar por código o nombre"
                  required
                />
                <p className="field-hint">Ingrese el código del atleta o búsquelo por nombre</p>
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
                <option value="bajo">Por debajo del promedio (Bajo)</option>
                <option value="medio">En el promedio (Medio)</option>
                <option value="alto">Por encima del promedio (Alto)</option>
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
