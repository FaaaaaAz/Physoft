import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoPersonAdd, IoPerson, IoFootball, IoBody, IoResize, IoScale, IoCalendar } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import ImageUpload from '../components/ImageUpload'
import { athleteAPI, type CreateAthleteDTO } from '../services/api'
import '../styles/AgregarAtleta.css'

function AgregarAtleta() {
  const navigate = useNavigate()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const [formData, setFormData] = useState<CreateAthleteDTO>({
    name: '',
    gender: 'Male',
    sport: '',
    position: '',
    bodyType: 'Mesomorph',
    height: 0,
    weight: 0,
    age: 0
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['height', 'weight', 'age'].includes(name) ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre es obligatorio' })
      return
    }
    if (!formData.sport.trim()) {
      setMensaje({ tipo: 'error', texto: 'La disciplina es obligatoria' })
      return
    }
    if (formData.age <= 0 || formData.height <= 0 || formData.weight <= 0) {
      setMensaje({ tipo: 'error', texto: 'Edad, altura y peso deben ser mayores a 0' })
      return
    }

    setGuardando(true)
    setMensaje(null)

    try {
      const response = await athleteAPI.create(formData)

      if (response.success) {
        // Upload photo if selected
        if (selectedImage && response.data.id) {
          try {
            await athleteAPI.uploadPhoto(response.data.id, selectedImage)
            setMensaje({ tipo: 'success', texto: `✅ Atleta ${formData.name} creado exitosamente con foto` })
          } catch (photoError) {
            console.error('Error uploading photo:', photoError)
            setMensaje({ tipo: 'success', texto: `✅ Atleta ${formData.name} creado (sin foto)` })
          }
        } else {
          setMensaje({ tipo: 'success', texto: `✅ Atleta ${formData.name} creado exitosamente` })
        }

        // Clear form
        setFormData({
          name: '',
          gender: 'Male',
          sport: '',
          position: '',
          bodyType: 'Mesomorph',
          height: 0,
          weight: 0,
          age: 0
        })
        setSelectedImage(null)

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
      subtitle="Completa la información del atleta para agregarlo a la base de datos local"
      showBackButton={true}
      backTo="/dashboard"
      className="agregar-atleta-page"
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
                <label htmlFor="age"><IoCalendar /> Edad *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  placeholder="Ej: 25"
                  min="1"
                  max="100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Upload de Imagen */}
          <div className="form-section">
            <ImageUpload
              currentImage={null}
              onImageSelect={setSelectedImage}
              disabled={guardando}
            />
          </div>

          {/* Información Deportiva */}
          <div className="form-section">
            <h3><IoFootball /> Información Deportiva</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sport">Disciplina/Deporte *</label>
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
                <><IoPersonAdd /> Agregar Atleta</>
              )}
            </button>
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}

export default AgregarAtleta
