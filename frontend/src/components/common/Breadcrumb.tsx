import { useNavigate } from 'react-router-dom'
import { IoChevronForward } from 'react-icons/io5'
import '../../styles/Breadcrumb.css'

export interface BreadcrumbItem {
  label: string
  path?: string
  onClick?: () => void
  active?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: 'slash' | 'chevron'
}

/**
 * Componente reutilizable de breadcrumb para navegación
 * Usado en: TodosAnalisis, Perfil, DetalleAtleta, Configuracion, AgregarAtleta
 */
function Breadcrumb({ items, separator = 'slash' }: BreadcrumbProps) {
  const navigate = useNavigate()

  const handleClick = (item: BreadcrumbItem) => {
    if (item.active) return
    
    if (item.onClick) {
      item.onClick()
    } else if (item.path) {
      navigate(item.path)
    }
  }

  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          <span
            className={`breadcrumb-item ${item.active ? 'active' : ''}`}
            onClick={() => handleClick(item)}
            style={{ cursor: item.active ? 'default' : 'pointer' }}
          >
            {item.label}
          </span>
          {index < items.length - 1 && (
            separator === 'chevron' ? (
              <IoChevronForward className="breadcrumb-separator" />
            ) : (
              <span className="breadcrumb-separator">/</span>
            )
          )}
        </span>
      ))}
    </div>
  )
}

export default Breadcrumb
