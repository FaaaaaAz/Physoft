import { useState } from 'react'
import { IoClose, IoLockClosed } from 'react-icons/io5'
import { authAPI } from '../../../services/authApi'
import { VALIDATION, MESSAGES } from '../../../constants'
import { ButtonLoadingContent } from './ButtonSpinner'
import './ChangePasswordModal.css'

interface ChangePasswordModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const initialFields = { currentPassword: '', newPassword: '', confirmPassword: '' }

/**
 * Small centered modal for changing the signed-in user's password.
 * Modeled structurally on ConfirmModal (locally-scoped .modal-overlay,
 * only one modal ever open at a time app-wide).
 */
function ChangePasswordModal({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) {
    const [fields, setFields] = useState(initialFields)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleChange = (field: keyof typeof initialFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFields((prev) => ({ ...prev, [field]: e.target.value }))
    }

    const handleClose = () => {
        setFields(initialFields)
        setError(null)
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (fields.newPassword.length < VALIDATION.MIN_PASSWORD_LENGTH) {
            setError(`New password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`)
            return
        }

        // useForm's ValidationRule only sees one field at a time, so this
        // cross-field check is done here rather than in a schema rule.
        if (fields.newPassword !== fields.confirmPassword) {
            setError(MESSAGES.ERROR.PASSWORDS_DO_NOT_MATCH)
            return
        }

        setIsSubmitting(true)
        try {
            await authAPI.changePassword(fields.currentPassword, fields.newPassword)
            setFields(initialFields)
            onSuccess()
        } catch (err: any) {
            const backendMessage = err.response?.data?.error
            setError(backendMessage || 'Could not update password')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div
            className="cpm-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) handleClose()
            }}
        >
            <div className="cpm-modal" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
                <button className="cpm-close" onClick={handleClose} aria-label="Close">
                    <IoClose />
                </button>

                <div className="cpm-icon">
                    <IoLockClosed />
                </div>
                <h2 id="change-password-title">Change Password</h2>

                <form className="cpm-form" onSubmit={handleSubmit}>
                    {error && <div className="cpm-error" role="alert">{error}</div>}

                    <div className="cpm-field">
                        <label htmlFor="current-password">Current Password</label>
                        <input
                            id="current-password"
                            type="password"
                            value={fields.currentPassword}
                            onChange={handleChange('currentPassword')}
                            autoComplete="current-password"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="cpm-field">
                        <label htmlFor="new-password">New Password</label>
                        <input
                            id="new-password"
                            type="password"
                            value={fields.newPassword}
                            onChange={handleChange('newPassword')}
                            autoComplete="new-password"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="cpm-field">
                        <label htmlFor="confirm-password">Confirm New Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={fields.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            autoComplete="new-password"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="cpm-buttons">
                        <button type="button" className="cpm-btn cpm-btn-cancel" onClick={handleClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="cpm-btn cpm-btn-confirm" disabled={isSubmitting}>
                            {isSubmitting ? <ButtonLoadingContent text="Updating..." /> : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePasswordModal
