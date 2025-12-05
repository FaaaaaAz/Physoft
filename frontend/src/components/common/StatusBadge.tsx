import '../../styles/StatusBadge.css'

export type ConnectionStatus = 'connected' | 'offline' | 'connecting' | 'error'

interface StatusBadgeProps {
  status: ConnectionStatus
  customLabels?: Partial<Record<ConnectionStatus, string>>
}

const DEFAULT_LABELS: Record<ConnectionStatus, string> = {
  connected: 'Conectado',
  offline: 'Modo Offline',
  connecting: 'Conectando...',
  error: 'Error'
}

/**
 * Badge para mostrar estado de conexión
 * Usado en: Home.tsx
 */
function StatusBadge({ status, customLabels = {} }: StatusBadgeProps) {
  const labels = { ...DEFAULT_LABELS, ...customLabels }

  return (
    <div className={`status-badge ${status}`}>
      <span className="status-dot"></span>
      {labels[status]}
    </div>
  )
}

export default StatusBadge
