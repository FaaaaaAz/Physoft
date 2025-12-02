import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoPerson, IoMail, IoCall, IoBriefcase, IoCalendar, IoLocationSharp, IoCamera } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import '../styles/Perfil.css'

function Perfil() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  // Scroll to top cuando el componente se monta
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Datos de ejemplo del usuario
  const [userData, setUserData] = useState({
    nombre: 'Dr. Mauricio Paniagua',
    email: 'mauricio.paniagua@physoft.com',
    telefono: '+57 300 123 4567',
    cargo: 'Fisioterapeuta Deportivo',
    especialidad: 'Biomecánica y Rendimiento',
    ubicacion: 'Bogotá, Colombia',
    fechaRegistro: '15 de Enero, 2024'
  })

  const handleSave = () => {
    setIsEditing(false)
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', userData)
  }

  return (
    <PageTemplate 
      title="Mi Perfil"
      subtitle="Administra tu información personal"
      showBackButton={true}
      backTo="/dashboard"
    >
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-item" onClick={() => navigate('/dashboard')}>Inicio</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item active">Perfil</span>
      </div>

      <div className="perfil-container">
        {/* Header del Perfil */}
        <div className="perfil-header">
          <div className="perfil-avatar-section">
            <div className="perfil-avatar">
              <IoPerson />
              <button className="avatar-upload-btn" title="Cambiar foto">
                <IoCamera />
              </button>
            </div>
            <div className="perfil-header-info">
              <h2>{userData.nombre}</h2>
              <p className="perfil-cargo">{userData.cargo}</p>
              <p className="perfil-fecha">Miembro desde {userData.fechaRegistro}</p>
            </div>
          </div>
          <div className="perfil-actions">
            {isEditing ? (
              <>
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
                <button className="btn-primary" onClick={handleSave}>
                  Guardar Cambios
                </button>
              </>
            ) : (
              <button className="btn-primary" onClick={() => setIsEditing(true)}>
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Información del Perfil */}
        <div className="perfil-content">
          <div className="perfil-section">
            <h3 className="section-title-perfil">Información Personal</h3>
            <div className="perfil-grid">
              <div className="perfil-field">
                <label>
                  <IoMail className="field-icon" />
                  Email
                </label>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="perfil-input"
                  />
                ) : (
                  <p>{userData.email}</p>
                )}
              </div>

              <div className="perfil-field">
                <label>
                  <IoCall className="field-icon" />
                  Teléfono
                </label>
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={userData.telefono}
                    onChange={(e) => setUserData({...userData, telefono: e.target.value})}
                    className="perfil-input"
                  />
                ) : (
                  <p>{userData.telefono}</p>
                )}
              </div>

              <div className="perfil-field">
                <label>
                  <IoLocationSharp className="field-icon" />
                  Ubicación
                </label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={userData.ubicacion}
                    onChange={(e) => setUserData({...userData, ubicacion: e.target.value})}
                    className="perfil-input"
                  />
                ) : (
                  <p>{userData.ubicacion}</p>
                )}
              </div>
            </div>
          </div>

          <div className="perfil-section">
            <h3 className="section-title-perfil">Información Profesional</h3>
            <div className="perfil-grid">
              <div className="perfil-field">
                <label>
                  <IoBriefcase className="field-icon" />
                  Cargo
                </label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={userData.cargo}
                    onChange={(e) => setUserData({...userData, cargo: e.target.value})}
                    className="perfil-input"
                  />
                ) : (
                  <p>{userData.cargo}</p>
                )}
              </div>

              <div className="perfil-field">
                <label>
                  <IoCalendar className="field-icon" />
                  Especialidad
                </label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={userData.especialidad}
                    onChange={(e) => setUserData({...userData, especialidad: e.target.value})}
                    className="perfil-input"
                  />
                ) : (
                  <p>{userData.especialidad}</p>
                )}
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="perfil-section">
            <h3 className="section-title-perfil">Estadísticas</h3>
            <div className="perfil-stats">
              <div className="stat-card-perfil">
                <div className="stat-value">156</div>
                <div className="stat-label">Análisis Realizados</div>
              </div>
              <div className="stat-card-perfil">
                <div className="stat-value">89</div>
                <div className="stat-label">Atletas Evaluados</div>
              </div>
              <div className="stat-card-perfil">
                <div className="stat-value">23</div>
                <div className="stat-label">Este Mes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}

export default Perfil
