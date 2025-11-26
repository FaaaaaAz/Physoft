import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoAdd, IoArrowBack } from 'react-icons/io5'
import Navbar from '../Navbar'
import '../../styles/PageTemplate.css'

interface PageTemplateProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backTo?: string
  showAddButton?: boolean
  onAddClick?: () => void
  addButtonText?: string
  children: ReactNode
  className?: string
  showNavbar?: boolean
}

function PageTemplate({
  title,
  subtitle,
  showBackButton = false,
  backTo,
  showAddButton = false,
  onAddClick,
  addButtonText = "Agregar",
  children,
  className = "",
  showNavbar = true
}: PageTemplateProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (backTo) {
      navigate(backTo)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className={`page-template ${className}`}>
      {/* Navbar Superior */}
      {showNavbar && (
        <Navbar
          showBackButton={showBackButton}
          backTo={backTo}
          onBack={handleBack}
          showAddButton={showAddButton}
          onAddClick={onAddClick}
          addButtonTitle={addButtonText}
        />
      )}

      {/* Contenido Principal */}
      <main className="page-content">
        {/* Header de Página (si se proporciona título) */}
        {(title || subtitle || showAddButton) && (
          <div className="page-header">
            <div className="page-title-section">
              <div className="page-title-group">
                {showBackButton && (
                  <button className="back-button" onClick={handleBack}>
                    <IoArrowBack />
                  </button>
                )}
                {title && (
                  <div>
                    <h1 className="page-title">{title}</h1>
                    {subtitle && <p className="page-subtitle">{subtitle}</p>}
                  </div>
                )}
              </div>
              {showAddButton && onAddClick && (
                <div className="page-actions">
                  <button className="btn-primary btn-primary-large" onClick={onAddClick}>
                    <IoAdd />
                    {addButtonText}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contenido de la Página */}
        <div className="page-body">
          {children}
        </div>
      </main>
    </div>
  )
}

export default PageTemplate
