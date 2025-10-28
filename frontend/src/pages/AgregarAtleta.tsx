import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack, IoPersonAdd, IoPerson, IoFootball, IoBody, IoResize, IoScale, IoCalendar } from 'react-icons/io5'
import { db } from '../services/database'
import type { CrearAtletaDTO } from '../electron'
import '../styles/AgregarAtleta.css'

function AgregarAtleta() {
  const navigate = useNavigate()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null)

  const [formData, setFormData] = useState<CrearAtletaDTO>({
    nombre: '',
    genero: 'Masculino',
    disciplina: '',
    posicion: '',
    somatotipo: 'Mesomorfo',
    altura: 0,
    peso: 0,
    edad: 0
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['altura', 'peso', 'edad'].includes(name) ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validación
    if (!formData.nombre.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre es obligatorio' })
      return
    }
    if (!formData.disciplina.trim()) {
      setMensaje({ tipo: 'error', texto: 'La disciplina es obligatoria' })
      return
    }
    if (formData.edad <= 0 || formData.altura <= 0 || formData.peso <= 0) {
      setMensaje({ tipo: 'error', texto: 'Edad, altura y peso deben ser mayores a 0' })
      return
    }

    setGuardando(true)
    setMensaje(null)

    try {
      const response = await db.crearAtleta(formData)
      
      if (response.success) {
        setMensaje({ tipo: 'success', texto: `✅ Atleta ${formData.nombre} creado exitosamente` })
        
        // Limpiar formulario
        setFormData({
          nombre: '',
          genero: 'Masculino',
          disciplina: '',
          posicion: '',
          somatotipo: 'Mesomorfo',
          altura: 0,
          peso: 0,
          edad: 0
        })
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        setMensaje({ tipo: 'error', texto: `❌ Error: ${response.error}` })
      }
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: `❌ Error inesperado: ${error.message}` })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="agregar-atleta-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <a href="#" className="navbar-brand" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <img src="/src/assets/physoft.png" alt="Physoft" className="navbar-logo" />
            <span className="navbar-title">Physoft</span>
          </a>
          
          <ul className="navbar-menu">
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="navbar-link">Inicio</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/analisis'); }} className="navbar-link">Análisis</a></li>
            <li><a href="#" className="navbar-link active">Agregar Atleta</a></li>
          </ul>
          
          <div className="navbar-actions">
            <button className="navbar-icon-btn" onClick={() => navigate('/dashboard')}>
              <IoArrowBack />
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="agregar-atleta-content">
        <div className="agregar-atleta-container">
          <div className="agregar-atleta-header">
            <IoPersonAdd className="header-icon" />
            <h1>Agregar Nuevo Atleta</h1>
            <p>Completa la información del atleta para agregarlo a la base de datos local</p>
          </div>

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
                  <label htmlFor="nombre">Nombre Completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Lionel Messi"
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
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edad"><IoCalendar /> Edad *</label>
                  <input
                    type="number"
                    id="edad"
                    name="edad"
                    value={formData.edad || ''}
                    onChange={handleChange}
                    placeholder="Ej: 25"
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Información Deportiva */}
            <div className="form-section">
              <h3><IoFootball /> Información Deportiva</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="disciplina">Disciplina/Deporte *</label>
                  <input
                    type="text"
                    id="disciplina"
                    name="disciplina"
                    value={formData.disciplina}
                    onChange={handleChange}
                    placeholder="Ej: Fútbol, Baloncesto, Atletismo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="posicion">Posición/Especialidad</label>
                  <input
                    type="text"
                    id="posicion"
                    name="posicion"
                    value={formData.posicion}
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
                  <label htmlFor="somatotipo">Somatotipo *</label>
                  <select
                    id="somatotipo"
                    name="somatotipo"
                    value={formData.somatotipo}
                    onChange={handleChange}
                    required
                  >
                    <option value="Ectomorfo">Ectomorfo (Delgado)</option>
                    <option value="Mesomorfo">Mesomorfo (Atlético)</option>
                    <option value="Endomorfo">Endomorfo (Robusto)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="altura"><IoResize /> Altura (cm) *</label>
                  <input
                    type="number"
                    id="altura"
                    name="altura"
                    value={formData.altura || ''}
                    onChange={handleChange}
                    placeholder="Ej: 175"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="peso"><IoScale /> Peso (kg) *</label>
                  <input
                    type="number"
                    id="peso"
                    name="peso"
                    value={formData.peso || ''}
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
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/dashboard')}
                disabled={guardando}
              >
                <IoArrowBack /> Cancelar
              </button>
              
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
      </main>
    </div>
  )
}

export default AgregarAtleta
