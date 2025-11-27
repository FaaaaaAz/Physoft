import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoPersonAdd, IoPerson, IoFootball, IoBody, IoResize, IoScale, IoCalendar, IoMail, IoCall, IoImage } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import { athleteAPI, type CreateAthleteDTO } from '../services/api'
import '../styles/AgregarAtleta.css'

function AgregarAtleta() {
  const navigate = useNavigate()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateAthleteDTO>({
    codigoAcceso: '',
    foto: '',
    nombre: '',
    genero: '',
    fechaNacimiento: '',
    nacionalidad: '',
    disciplina: '',
    club: '',
    posicion: '',
    somatotipo: '',
    altura: 0,
    peso: 0,
    email: '',
    telefono: ''
  })

  // Generate access code on mount
  useEffect(() => {
    generateAccessCode()
  }, [])

  // Generate access code on mount
  useEffect(() => {
    generateAccessCode()
  }, [])

  const generateAccessCode = async () => {
    try {
      // Get all athletes to calculate next code
      const response = await db.obtenerAtletas()
      let nextCode = '00000'
      
      if (response.success && response.data && response.data.length > 0) {
        // Find the highest code number
        const codes = response.data
          .map(a => parseInt(a.codigoAcceso))
          .filter(code => !isNaN(code))
        
        if (codes.length > 0) {
          const maxCode = Math.max(...codes)
          nextCode = String(maxCode + 1).padStart(5, '0')
        }
      }
      
      setFormData(prev => ({ ...prev, codigoAcceso: nextCode }))
    } catch (error) {
      console.error('Error generating access code:', error)
      setFormData(prev => ({ ...prev, codigoAcceso: '00000' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setFotoPreview(result)
        setFormData(prev => ({ ...prev, foto: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['altura', 'peso'].includes(name) ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre es obligatorio' })
      return
    }
    if (!formData.genero) {
      setMensaje({ tipo: 'error', texto: 'El género es obligatorio' })
      return
    }
    if (!formData.disciplina.trim()) {
      setMensaje({ tipo: 'error', texto: 'La disciplina es obligatoria' })
      return
    }
    if (!formData.somatotipo) {
      setMensaje({ tipo: 'error', texto: 'El somatotipo es obligatorio' })
      return
    }
    if (formData.altura <= 0 || formData.peso <= 0) {
      setMensaje({ tipo: 'error', texto: 'Altura y peso deben ser mayores a 0' })
      return
    }

    setGuardando(true)
    setMensaje(null)

    try {
      const response = await athleteAPI.create(formData)
      
      if (response.success) {
        setMensaje({ tipo: 'success', texto: `✅ Atleta ${formData.nombre} creado exitosamente con código ${formData.codigoAcceso}` })
        
        // Limpiar formulario y generar nuevo código
        setFormData({
          codigoAcceso: '',
          foto: '',
          nombre: '',
          genero: '',
          fechaNacimiento: '',
          nacionalidad: '',
          disciplina: '',
          club: '',
          posicion: '',
          somatotipo: '',
          altura: 0,
          peso: 0,
          email: '',
          telefono: ''
        })
        setFotoPreview(null)
        generateAccessCode()
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Error desconocido'
      setMensaje({ tipo: 'error', texto: `❌ Error: ${errorMsg}` })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <PageTemplate
      title="Agregar Nuevo Atleta"
      subtitle="Completa la información del atleta para agregarlo a la base de datos"
      showBackButton={true}
      backTo="/dashboard"
      className="agregar-atleta-page"
      showNavbar={true}
    >
      <div className="agregar-atleta-container">
        {mensaje && (
          <div className={`mensaje ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="atleta-form">
          {/* Información Personal */}
          <div className="form-section">
            <h3><IoPerson /> Información Personal</h3>
            
            {/* Código de Acceso Generado */}
            <div className="form-group access-code-group">
              <label>Código de acceso generado</label>
              <input
                type="text"
                value={formData.codigoAcceso}
                readOnly
                className="access-code-input"
              />
              <p className="field-hint">Este código permitirá ver los análisis del deportista.</p>
            </div>

            {/* Foto del Atleta */}
            <div className="form-group photo-group">
              <label>Foto del atleta</label>
              <div className="photo-upload-wrapper">
                {fotoPreview ? (
                  <div className="photo-preview">
                    <img src={fotoPreview} alt="Preview" />
                    <button
                      type="button"
                      className="btn-remove-photo"
                      onClick={() => {
                        setFotoPreview(null)
                        setFormData(prev => ({ ...prev, foto: '' }))
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label htmlFor="foto-input" className="photo-upload-label">
                    <IoImage />
                    <span>Subir foto</span>
                  </label>
                )}
                <input
                  type="file"
                  id="foto-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej.: John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="genero">Género *</label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaNacimiento"><IoCalendar /> Fecha de nacimiento</label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  placeholder="dd/mm/aaaa"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nacionalidad">Nacionalidad</label>
                <input
                  type="text"
                  id="nacionalidad"
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleChange}
                  placeholder="Ej.: Argentina"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="disciplina">Disciplina *</label>
                <select
                  id="disciplina"
                  name="disciplina"
                  value={formData.disciplina}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar disciplina</option>
                  <option value="Fútbol">Fútbol</option>
                  <option value="Baloncesto">Baloncesto</option>
                  <option value="Voleibol">Voleibol</option>
                  <option value="Atletismo">Atletismo</option>
                  <option value="Natación">Natación</option>
                  <option value="Ciclismo">Ciclismo</option>
                  <option value="Tenis">Tenis</option>
                  <option value="Rugby">Rugby</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="club"><IoFootball /> Club/Equipo</label>
                <input
                  type="text"
                  id="club"
                  name="club"
                  value={formData.club}
                  onChange={handleChange}
                  placeholder="Ej.: Club Deportivo XYZ"
                />
              </div>

              <div className="form-group">
                <label htmlFor="posicion">Posición</label>
                <input
                  type="text"
                  id="posicion"
                  name="posicion"
                  value={formData.posicion}
                  onChange={handleChange}
                  placeholder="Ej.: Mediocampista"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="somatotipo"><IoBody /> Somatotipo</label>
                <select
                  id="somatotipo"
                  name="somatotipo"
                  value={formData.somatotipo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar somatotipo</option>
                  <option value="Ectomorfo">Ectomorfo</option>
                  <option value="Mesomorfo">Mesomorfo</option>
                  <option value="Endomorfo">Endomorfo</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="altura"><IoResize /> Altura (cm)</label>
                <input
                  type="number"
                  id="altura"
                  name="altura"
                  value={formData.altura || ''}
                  onChange={handleChange}
                  placeholder="175"
                  min="1"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="peso"><IoScale /> Peso (kg)</label>
                <input
                  type="number"
                  id="peso"
                  name="peso"
                  value={formData.peso || ''}
                  onChange={handleChange}
                  placeholder="70"
                  min="1"
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email"><IoMail /> Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono"><IoCall /> Teléfono de contacto</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+1 123 456 7890"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={guardando}
            >
              {guardando ? (
                <>⏳ Guardando...</>
              ) : (
                <><IoPersonAdd /> Crear Atleta</>
              )}
            </button>
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}

export default AgregarAtleta
