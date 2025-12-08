import { useMemo } from 'react'
import { IoFootball } from 'react-icons/io5'
import type { AthleteDisplay } from '../../types/athlete.types'
import './AthleteCard.css'

interface AthleteCardProps {
    athlete: AthleteDisplay
    onClick: () => void
}

function AthleteCard({ athlete, onClick }: AthleteCardProps) {
    const average = useMemo(() => {
        const { power, strength, speed, flexibility, endurance } = athlete.capacities
        return Math.round((power + strength + speed + flexibility + endurance) / 5)
    }, [athlete.capacities])

    return (
        <div className="atleta-card" onClick={onClick}>
            <div className="card-image-container">
                {athlete.photo && athlete.photo !== '/default-avatar.png' && athlete.photo !== 'default-avatar.png' ? (
                    <img
                        src={athlete.photo}
                        alt={athlete.name}
                        className="card-image"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const placeholder = e.currentTarget.parentElement?.querySelector('.card-image-placeholder') as HTMLElement
                            if (placeholder) placeholder.style.display = 'flex'
                        }}
                    />
                ) : null}
                <div
                    className="card-image-placeholder"
                    style={{ display: (athlete.photo && athlete.photo !== '/default-avatar.png' && athlete.photo !== 'default-avatar.png') ? 'none' : 'flex' }}
                >
                    {athlete.name.charAt(0).toUpperCase()}
                </div>
                <div className="card-overlay">
                    <span className="card-sport">
                        <IoFootball /> {athlete.sport}
                    </span>
                </div>
            </div>

            <div className="card-content">
                <h3 className="card-name">{athlete.name}</h3>
                <p className="card-club">{athlete.club}</p>
                {athlete.accessCode && (
                    <p className="card-code">Code: {athlete.accessCode}</p>
                )}

                <div className="card-stats">
                    <div className="stat-item">
                        <span className="stat-label">Edad</span>
                        <span className="stat-value">{athlete.age || '-'}</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-label">Overall</span>
                        <span className="stat-value stat-overall">{average}</span>
                    </div>
                </div>
            </div>

            <div className="card-hover-effect"></div>
        </div>
    )
}

export default AthleteCard
