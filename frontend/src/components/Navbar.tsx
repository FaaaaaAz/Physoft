import { memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IoSettings, IoPerson, IoAdd, IoArrowBack } from 'react-icons/io5'
import physoftLogo from '@/assets/physoft.png'
import '../styles/Navbar.css'

interface NavbarProps {
  showBackButton?: boolean
  backTo?: string
  onBack?: () => void
  showAddButton?: boolean
  onAddClick?: () => void
  addButtonTitle?: string
}

function Navbar({
  showBackButton = false,
  backTo,
  onBack,
  showAddButton = false,
  onAddClick,
  addButtonTitle = "Agregar"
}: NavbarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backTo) {
      navigate(backTo)
    } else {
      navigate(-1)
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo y Título */}
        <a
          href="#"
          className="navbar-brand"
          onClick={(e) => {
            e.preventDefault()
            navigate('/dashboard')
          }}
        >
          <img src={physoftLogo} alt="Physoft" className="navbar-logo" />
        </a>

        {/* Menú de Navegación */}
        <ul className="navbar-menu">
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate('/dashboard')
              }}
              className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate('/analysis')
              }}
              className={`navbar-link ${isActive('/analysis') ? 'active' : ''}`}
            >
              Análisis
            </a>
          </li>
        </ul>

        {/* Acciones */}
        <div className="navbar-actions">
          {showBackButton && (
            <button
              className="navbar-icon-btn"
              onClick={handleBack}
              title="Volver"
            >
              <IoArrowBack />
            </button>
          )}
          {showAddButton && onAddClick && (
            <button
              className="navbar-icon-btn btn-add"
              onClick={onAddClick}
              title={addButtonTitle}
            >
              <IoAdd />
            </button>
          )}
          <button
            className="navbar-icon-btn"
            title="Configuración"
            onClick={() => navigate('/settings')}
          >
            <IoSettings />
          </button>
          <button
            className="navbar-icon-btn"
            title="Perfil"
            onClick={() => navigate('/profile')}
          >
            <IoPerson />
          </button>
        </div>
      </div>
    </nav>
  )
}

// Memorizar el componente para evitar re-renderizados innecesarios
export default memo(Navbar)
