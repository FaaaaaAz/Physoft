import { IoChevronDown, IoChevronUp } from 'react-icons/io5'

interface CollapsibleSectionProps {
  id: string
  title: string
  subtitle?: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
  className?: string
}

/**
 * Sección colapsable reutilizable para formularios
 * Usado en FormularioAnalisis para los bloques A-G
 */
export function CollapsibleSection({
  id,
  title,
  subtitle,
  isExpanded,
  onToggle,
  children,
  className = ''
}: CollapsibleSectionProps) {
  return (
    <div className={`form-bloque ${className}`}>
      <div className="bloque-header" onClick={onToggle}>
        <h2 className="bloque-title">
          <span className="bloque-letra">{id}</span>
          {title}
          {subtitle && <span className="bloque-subtitle">{subtitle}</span>}
        </h2>
        {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
      </div>
      
      {isExpanded && (
        <div className="bloque-content">
          {children}
        </div>
      )}
    </div>
  )
}
