import { useNavigate } from 'react-router-dom'
import { IoTime } from 'react-icons/io5'
import { getPhotoUrl } from '../../services/api'
import { getRelativeTime } from '../../utils/date.utils'
import './RecentActivityCard.css'

export interface RecentActivityItem {
    id: number
    athleteId: string
    patientName: string
    photo?: string | null
    evaluationDate: string
    classification?: string | null
}

interface RecentActivityCardProps {
    items: RecentActivityItem[]
    loading?: boolean
}

const CLASSIFICATION_LABELS: Record<string, { label: string; color: string }> = {
    ELITE: { label: 'Elite', color: 'var(--success-color)' },
    AVANZADO: { label: 'Advanced', color: 'var(--info-color)' },
    INTERMEDIO: { label: 'Intermediate', color: 'var(--warning-color)' },
    PRINCIPIANTE: { label: 'Beginner', color: 'var(--text-muted)' },
    ATENCION_REQUERIDA: { label: 'Needs Attention', color: 'var(--error-color)' },
    low: { label: 'Low', color: 'var(--warning-color)' },
    medium: { label: 'Medium', color: 'var(--info-color)' },
    high: { label: 'High', color: 'var(--success-color)' }
}

function getClassificationBadge(classification?: string | null) {
    if (!classification) return null
    return CLASSIFICATION_LABELS[classification] || { label: classification, color: 'var(--text-muted)' }
}

function RecentActivityCard({ items, loading = false }: RecentActivityCardProps) {
    const navigate = useNavigate()

    return (
        <div className="recent-activity-card">
            <div className="dashboard-card-header">
                <h2>Recent Activity</h2>
                <p>Last {items.length} assessments performed</p>
            </div>

            {loading ? (
                <div className="recent-activity-empty">Loading activity...</div>
            ) : items.length === 0 ? (
                <div className="recent-activity-empty">
                    <IoTime />
                    No assessments recorded yet.
                </div>
            ) : (
                <ul className="recent-activity-list">
                    {items.map(item => {
                        const badge = getClassificationBadge(item.classification)
                        return (
                            <li
                                key={item.id}
                                className="recent-activity-row"
                                onClick={() => navigate(`/athlete-detail/${item.athleteId}`)}
                            >
                                <img
                                    src={getPhotoUrl(item.photo)}
                                    alt={item.patientName}
                                    className="recent-activity-avatar"
                                />
                                <div className="recent-activity-info">
                                    <span className="recent-activity-name">{item.patientName}</span>
                                    <span className="recent-activity-meta">
                                        Assessment &middot; {getRelativeTime(item.evaluationDate)}
                                    </span>
                                </div>
                                {badge && (
                                    <span
                                        className="recent-activity-badge"
                                        style={{ color: badge.color, borderColor: badge.color }}
                                    >
                                        {badge.label}
                                    </span>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default RecentActivityCard
