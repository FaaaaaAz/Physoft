import { ReactNode } from 'react'
import '../../styles/FeatureCard.css'

interface FeatureCardProps {
  icon: string | ReactNode
  title: string
  description: string
  onClick?: () => void
  className?: string
}

/**
 * Tarjeta para mostrar funcionalidades/características
 * Usado en: Home.tsx
 */
function FeatureCard({ icon, title, description, onClick, className = '' }: FeatureCardProps) {
  const CardTag = onClick ? 'button' : 'div'

  return (
    <CardTag
      className={`feature-card ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {typeof icon === 'string' ? (
        <div className="feature-icon">{icon}</div>
      ) : (
        <div className="feature-icon-component">{icon}</div>
      )}
      <h4 className="feature-title">{title}</h4>
      <p className="feature-description">{description}</p>
    </CardTag>
  )
}

export default FeatureCard
