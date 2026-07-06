import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Gates navigation to `targetRoute` behind the consent modal:
 * call `requestAccess` instead of navigating directly.
 */
export function useConsentGate(targetRoute: string) {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const requestAccess = useCallback(() => setIsOpen(true), [])
    const cancel = useCallback(() => setIsOpen(false), [])
    const accept = useCallback(() => {
        setIsOpen(false)
        navigate(targetRoute)
    }, [navigate, targetRoute])

    return { isOpen, requestAccess, cancel, accept }
}
