import { useEffect } from 'react'
import { IoCheckmarkCircle, IoAlertCircle, IoClose } from 'react-icons/io5'
import './Toast.css'

export type ToastType = 'success' | 'error'

interface ToastProps {
    type: ToastType
    message: string
    onClose: () => void
    duration?: number
}

const TOAST_ICONS = {
    success: IoCheckmarkCircle,
    error: IoAlertCircle
}

/**
 * Floating, auto-dismissing notification. Meant to survive a page
 * navigation by being read from `location.state` on the destination page
 * (see Patients.tsx), rather than being tied to the lifetime of the page
 * that triggered it.
 */
function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const Icon = TOAST_ICONS[type]

    return (
        <div className={`toast toast-${type}`} role="status">
            <Icon className="toast-icon" />
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={onClose} aria-label="Dismiss">
                <IoClose />
            </button>
        </div>
    )
}

export default Toast
