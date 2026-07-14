import { useEffect } from 'react'
import { IoWarningOutline } from 'react-icons/io5'
import './ConfirmModal.css'

interface ConfirmModalProps {
    isOpen: boolean
    title?: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
    onConfirm: () => void
    onCancel: () => void
}

/**
 * Reusable dark-themed confirm/cancel dialog, replacing native
 * `window.confirm()` popups (which show the raw hosting domain and can't be
 * styled).
 */
function ConfirmModal({
    isOpen,
    title = 'Confirm action',
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    danger = false,
    onConfirm,
    onCancel
}: ConfirmModalProps) {
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onCancel])

    if (!isOpen) return null

    return (
        <div
            className="confirm-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onCancel()
            }}
        >
            <div className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-modal-title">
                <div className={`confirm-modal-icon ${danger ? 'confirm-modal-icon-danger' : ''}`}>
                    <IoWarningOutline />
                </div>
                <h2 id="confirm-modal-title">{title}</h2>
                <p className="confirm-modal-message">{message}</p>
                <div className="confirm-modal-buttons">
                    <button className="confirm-modal-btn confirm-modal-btn-cancel" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button
                        className={`confirm-modal-btn ${danger ? 'confirm-modal-btn-danger' : 'confirm-modal-btn-confirm'}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
