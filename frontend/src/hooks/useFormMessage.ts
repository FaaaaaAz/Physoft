import { useState } from 'react'

export type MessageType = 'success' | 'error' | 'warning' | 'info'

interface Message {
  tipo: MessageType
  texto: string
}

interface UseFormMessageReturn {
  mensaje: Message | null
  showMessage: (tipo: MessageType, texto: string) => void
  clearMessage: () => void
  showSuccess: (texto: string) => void
  showError: (texto: string) => void
  showWarning: (texto: string) => void
  showInfo: (texto: string) => void
}

/**
 * Hook para gestionar mensajes de formulario (success/error/warning/info)
 * Usado en: NuevoAnalisis.tsx, AgregarAtleta.tsx, FormularioAnalisis.tsx
 */
export function useFormMessage(): UseFormMessageReturn {
  const [mensaje, setMensaje] = useState<Message | null>(null)

  const showMessage = (tipo: MessageType, texto: string) => {
    setMensaje({ tipo, texto })
  }

  const clearMessage = () => {
    setMensaje(null)
  }

  const showSuccess = (texto: string) => showMessage('success', texto)
  const showError = (texto: string) => showMessage('error', texto)
  const showWarning = (texto: string) => showMessage('warning', texto)
  const showInfo = (texto: string) => showMessage('info', texto)

  return {
    mensaje,
    showMessage,
    clearMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
