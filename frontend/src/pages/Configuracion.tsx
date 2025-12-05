import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { IoSettings, IoNotifications, IoLockClosed, IoColorPalette, IoLanguage, IoInformationCircle } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import '../styles/Configuracion.css'

function Configuracion() {
  const navigate = useNavigate()

  // Scroll to top cuando el componente se monta
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageTemplate 
      title="Configuración"
      subtitle="Personaliza tu experiencia en Physoft"
      showBackButton={true}
      backTo="/dashboard"
      breadcrumbItems={[
        { label: 'Inicio', path: '/dashboard' },
        { label: 'Configuración' }
      ]}
    >
      <div className="configuracion-container">
        {/* Notificaciones */}
        <div className="config-section">
          <div className="config-section-header">
            <IoNotifications className="config-icon" />
            <h3>Notificaciones</h3>
          </div>
          <div className="config-options">
            <div className="config-option">
              <div className="option-info">
                <p className="option-title">Notificaciones por email</p>
                <p className="option-description">Recibe actualizaciones sobre análisis y atletas</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="config-option">
              <div className="option-info">
                <p className="option-title">Recordatorios de análisis</p>
                <p className="option-description">Te recordaremos realizar análisis periódicos</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="config-section">
          <div className="config-section-header">
            <IoLockClosed className="config-icon" />
            <h3>Seguridad</h3>
          </div>
          <div className="config-options">
            <div className="config-option">
              <div className="option-info">
                <p className="option-title">Cambiar contraseña</p>
                <p className="option-description">Actualiza tu contraseña regularmente</p>
              </div>
              <button className="config-btn">Cambiar</button>
            </div>
            <div className="config-option">
              <div className="option-info">
                <p className="option-title">Autenticación de dos factores</p>
                <p className="option-description">Agrega una capa extra de seguridad</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div className="config-section">
          <div className="config-section-header">
            <IoColorPalette className="config-icon" />
            <h3>Apariencia</h3>
          </div>
          <div className="config-options">
            <div className="config-option">
              <div className="option-info">
                <p className="option-title">Tema oscuro</p>
                <p className="option-description">Actualmente activo (predeterminado)</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked disabled />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Idioma */}
        <div className="config-section">
          <div className="config-section-header">
            <IoLanguage className="config-icon" />
            <h3>Idioma y Región</h3>
          </div>
          <div className="config-options">
            <div className="config-option">
              <div className="option-info">
                <p className="option-title">Idioma</p>
                <p className="option-description">Selecciona tu idioma preferido</p>
              </div>
              <select className="config-select">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="config-section">
          <div className="config-section-header">
            <IoInformationCircle className="config-icon" />
            <h3>Acerca de</h3>
          </div>
          <div className="config-options">
            <div className="config-option">
              <div className="option-info">
                <p className="option-title">Versión de Physoft</p>
                <p className="option-description">1.0.0 Beta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}

export default Configuracion
