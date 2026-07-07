import { ReactNode } from 'react'
import './ComingSoon.css'

interface ComingSoonProps {
    icon: ReactNode
    title: string
    description?: string
}

/**
 * Elegant placeholder for sections that are planned but not yet implemented.
 * Reusable across Analytics, Reports, Protocols and any future module.
 */
function ComingSoon({ icon, title, description }: ComingSoonProps) {
    return (
        <div className="coming-soon">
            <div className="coming-soon-icon">{icon}</div>
            <span className="coming-soon-badge">Coming Soon</span>
            <h2 className="coming-soon-title">{title}</h2>
            {description && <p className="coming-soon-desc">{description}</p>}
        </div>
    )
}

export default ComingSoon
