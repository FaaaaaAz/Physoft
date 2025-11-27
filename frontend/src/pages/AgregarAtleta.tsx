import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoPersonAdd, IoPerson, IoFootball, IoBody, IoResize, IoScale, IoCalendar, IoMail, IoCall, IoGlobe } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import ImageUpload from '../components/ImageUpload'
import { athleteAPI } from '../services/api'
import '../styles/AgregarAtleta.css'

function AgregarAtleta() {
  const navigate = useNavigate()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    birthDate: '',
    nationality: '',
    sport: '',
    club: '',
    position: '',
    bodyType: 'Mesomorph',
    height: 0,
    weight: 0,
    email: '',
    phone: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['height', 'weight'].includes(name) ? Number(value) : value
    }))
  }

  const handleImageSelect = (file: File | null) => {
    setPhotoFile(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre es obligatorio' })
      return
    }
    if (!formData.gender) {
      setMensaje({ tipo: 'error', texto: 'El género es obligatorio' })
      return
    }
    if (!formData.sport.trim()) {
      setMensaje({ tipo: 'error', texto: 'El deporte es obligatorio' })
      return
    }
    if (!formData.bodyType) {
      setMensaje({ tipo: 'error', texto: 'El somatotipo es obligatorio' })
      return
    }
    if (formData.height <= 0 || formData.weight <= 0) {
      setMensaje({ tipo: 'error', texto: 'Altura y peso deben ser mayores a 0' })
      return
    }

    setGuardando(true)
    setMensaje(null)

    try {
      const athleteData = {
        ...formData,
        photo: photoFile
      }

      const response = await athleteAPI.create(athleteData)

      if (response.success) {
        setMensaje({
          tipo: 'success',
          texto: `✅ Atleta ${formData.name} creado exitosamente con código ${response.data.accessCode}`
        })

        // Clear form
        setFormData({
          name: '',
          gender: 'Male',
          birthDate: '',
          nationality: '',
          sport: '',
          club: '',
          position: '',
          bodyType: 'Mesomorph',
          height: 0,
          weight: 0,
          email: '',
          phone: ''
        })
        setPhotoFile(null)

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
          {/* Photo Upload */}
          <ImageUpload
            currentImage={null}
            onImageSelect={handleImageSelect}
            disabled={guardando}
          />

          {/* Información Personal */}
          <div className="form-section">
            <h3><IoPerson /> Información Personal</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nombre Completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Lionel Messi"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Género *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Masculino</option>
                  <option value="Female">Femenino</option>
                  <option value="Other">Otro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="birthDate"><IoCalendar /> Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="nationality"><IoGlobe /> Nacionalidad</label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="Ej: Argentina"
                />
              </div>
            </div>
          </div>

          {/* Información Deportiva */}
          <div className="form-section">
            <h3><IoFootball /> Información Deportiva</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sport">Deporte *</label>
                <input
                  type="text"
                  id="sport"
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  placeholder="Ej: Fútbol, Baloncesto, Atletismo"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="club">Club/Equipo</label>
                <input
                  type="text"
                  id="club"
                  name="club"
                  value={formData.club}
                  onChange={handleChange}
                  placeholder="Ej: FC Barcelona"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="position">Posición/Especialidad</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Ej: Delantero, Defensa"
                />
              </div>
            </div>
          </div>

          {/* Información Física */}
          <div className="form-section">
            <h3><IoBody /> Información Física</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bodyType">Somatotipo *</label>
                <select
                  id="bodyType"
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleChange}
                  required
                >
                  <option value="Ectomorph">Ectomorfo (Delgado)</option>
                  <option value="Mesomorph">Mesomorfo (Atlético)</option>
                  <option value="Endomorph">Endomorfo (Robusto)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="height"><IoResize /> Altura (cm) *</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleChange}
                  placeholder="Ej: 175"
                  min="1"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight"><IoScale /> Peso (kg) *</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  placeholder="Ej: 75"
                  min="1"
                  step="0.1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="form-section">
            <h3><IoMail /> Información de Contacto</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email"><IoMail /> Correo Electrónico</label>
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
                <label htmlFor="phone"><IoCall /> Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
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
