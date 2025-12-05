import '../../styles/ProgressBar.css'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  color?: string
  size?: 'small' | 'medium' | 'large'
}

/**
 * Barra de progreso reutilizable
 * Usado en: AnalysisView (capacidades físicas)
 */
function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  showValue = true,
  color = 'var(--primary-color)',
  size = 'medium'
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={`progress-container ${size}`}>
      {label && (
        <div className="progress-header">
          <span className="progress-label">{label}</span>
          {showValue && <span className="progress-value">{value}/{max}</span>}
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${percentage}%`,
            background: color
          }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
