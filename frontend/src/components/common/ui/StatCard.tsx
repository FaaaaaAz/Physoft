import '../../styles/StatCard.css'

interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  color?: string
  loading?: boolean
}

/**
 * Tarjeta para mostrar estadísticas
 * Usado en: Analisis.tsx, Dashboard (stats)
 */
function StatCard({ icon, value, label, color = 'var(--primary-color)', loading = false }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}20` }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3 className="stat-value">{loading ? '...' : value}</h3>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  )
}

export default StatCard
