import { IoCheckmarkCircle, IoWarning, IoClose, IoInformationCircle } from 'react-icons/io5'
import '../../styles/MessageAlert.css'

export type MessageType = 'success' | 'error' | 'warning' | 'info'

interface MessageAlertProps {
  tipo: MessageType
  texto: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

const MESSAGE_ICONS = {
  success: IoCheckmarkCircle,
  error: IoClose,
  warning: IoWarning,
  info: IoInformationCircle
}

/**
 * Componente reutilizable para mostrar mensajes/alertas
 * Usado en: NuevoAnalisis, AgregarAtleta, FormularioAnalisis
 */
function MessageAlert({ 
  tipo, 
  texto, 
  onClose,
  autoClose = false,
  duration = 5000
}: MessageAlertProps) {
  const Icon = MESSAGE_ICONS[tipo]

  // Auto-close functionality
  if (autoClose && onClose) {
    setTimeout(() => {
      onClose()
    }, duration)
  }

  return (
    <div className={`message-alert ${tipo}`}>
      <div className="message-content">
        <Icon className="message-icon" />
        <span className="message-text">{texto}</span>
      </div>
      {onClose && (
        <button className="message-close" onClick={onClose} aria-label="Cerrar">
          <IoClose />
        </button>
      )}
    </div>
  )
}

export default MessageAlert
