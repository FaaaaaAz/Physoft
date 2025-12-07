import { ReactNode } from 'react'
import './InfoGrid.css'

interface InfoItem {
  label: string
  value: string | number | ReactNode
  icon?: ReactNode
  highlight?: boolean
}

interface InfoGridProps {
  items: InfoItem[]
  columns?: 2 | 3 | 4
  className?: string
}

/**
 * Componente de cuadrícula de información reutilizable
 * Usado en: AtletaModal.tsx, Perfil.tsx, DetalleAtleta.tsx
 */
function InfoGrid({ items, columns = 2, className = '' }: InfoGridProps) {
  return (
    <div className={`info-grid info-grid-${columns} ${className}`}>
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`info-item ${item.highlight ? 'info-item-highlight' : ''}`}
        >
          <span className="info-label">
            {item.icon && <span className="info-icon">{item.icon}</span>}
            {item.label}
          </span>
          <span className="info-value">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default InfoGrid
