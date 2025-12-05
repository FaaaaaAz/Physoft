import { getBadgeClass, getClassificationLabel } from '../../utils/classification.utils'

interface BadgeProps {
  classification: string | null | undefined
  showLabel?: boolean
  className?: string
}

/**
 * Badge de clasificación reutilizable
 */
export function Badge({ 
  classification, 
  showLabel = true,
  className = ''
}: BadgeProps) {
  const badgeClass = getBadgeClass(classification)
  const label = getClassificationLabel(classification)
  
  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {showLabel ? label : null}
    </span>
  )
}
