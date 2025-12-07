import { useMemo } from 'react'
import { IoClose, IoFootball } from 'react-icons/io5'
import { usePentagonChart, usePentagonGuideLines, usePentagonRadialLines } from '../../hooks/usePentagonChart'
import type { AthleteDisplay } from '../../types/athlete.types'
import './AthleteModal.css'

interface AthleteModalProps {
    athlete: AthleteDisplay | null
    onClose: () => void
    onDelete?: (id: string) => void
}

function AthleteModal({ athlete, onClose, onDelete }: AthleteModalProps) {
    // Pentagon chart configuration
    const chartConfig = { centerX: 170, centerY: 170, maxRadius: 100, labelOffset: 30 }

    // Always call hooks unconditionally - use default values if athlete is null
    const defaultCapacities = { potencia: 0, fuerza: 0, velocidad: 0, flexibilidad: 0, resistencia: 0 }
    const pentagonData = usePentagonChart(athlete?.capacities ? {
        potencia: athlete.capacities.power,
        fuerza: athlete.capacities.strength,
        velocidad: athlete.capacities.speed,
        flexibilidad: athlete.capacities.flexibility,
        resistencia: athlete.capacities.endurance
    } : defaultCapacities, chartConfig)
    const guideLines = usePentagonGuideLines(chartConfig)
    const radialLines = usePentagonRadialLines(chartConfig)

    // Calculate average
    const average = useMemo(() => {
        if (!athlete) return 0
        const { power, strength, speed, flexibility, endurance } = athlete.capacities
        return Math.round((power + strength + speed + flexibility + endurance) / 5)
    }, [athlete])

    // Early return AFTER all hooks
    if (!athlete) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <IoClose />
                </button>

                <div className="modal-header">
                    <div className="modal-image-container">
                        <img src={athlete.photo} alt={athlete.name} className="modal-image" />
                        <div className="modal-sport-badge">
                            <IoFootball /> {athlete.sport}
                        </div>
                    </div>

                    <div className="modal-info">
                        <h2 className="modal-name">{athlete.name}</h2>
                        <p className="modal-club">{athlete.club}</p>
                        <div className="modal-overall">
                            <span className="overall-label">Overall</span>
                            <span className="overall-value">{average}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="modal-section">
                        <h3 className="section-title">Personal Information</h3>
                        <div className="info-grid">
                            {athlete.accessCode && (
                                <div className="info-item">
                                    <span className="info-label">Access Code</span>
                                    <span className="info-value access-code">{athlete.accessCode}</span>
                                </div>
                            )}
                            <div className="info-item">
                                <span className="info-label">Age</span>
                                <span className="info-value">{athlete.age} years</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Nationality</span>
                                <span className="info-value">{athlete.nationality || 'Not specified'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Height</span>
                                <span className="info-value">{athlete.height || 'N/A'} cm</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Weight</span>
                                <span className="info-value">{athlete.weight || 'N/A'} kg</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Body Type</span>
                                <span className="info-value">{athlete.bodyType || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-section">
                        <h3 className="section-title">Physical Capacities</h3>
                        <div className="chart-container">
                            <svg width="340" height="340" viewBox="0 0 340 340">
                                {/* Guide lines (20%, 40%, 60%, 80%, 100%) */}
                                {guideLines.map((path, idx) => (
                                    <polygon
                                        key={`guide-${idx}`}
                                        points={path}
                                        fill="none"
                                        stroke="rgba(255, 255, 255, 0.1)"
                                        strokeWidth="1"
                                    />
                                ))}

                                {/* Radial lines from center to vertices */}
                                {radialLines.map((line, idx) => (
                                    <line
                                        key={`radial-${idx}`}
                                        x1={line.x1}
                                        y1={line.y1}
                                        x2={line.x2}
                                        y2={line.y2}
                                        stroke="rgba(255, 255, 255, 0.1)"
                                        strokeWidth="1"
                                    />
                                ))}

                                {/* Athlete data polygon */}
                                <polygon
                                    points={pentagonData.pointsPath}
                                    fill="rgba(20, 184, 166, 0.3)"
                                    stroke="#14b8a6"
                                    strokeWidth="2"
                                />

                                {/* Points at vertices */}
                                {pentagonData.points.map((point, idx) => (
                                    <circle
                                        key={`point-${idx}`}
                                        cx={point.x}
                                        cy={point.y}
                                        r="4"
                                        fill="#14b8a6"
                                    />
                                ))}

                                {/* Labels and values */}
                                {pentagonData.points.map((point, idx) => (
                                    <g key={`label-${idx}`}>
                                        <text
                                            x={point.labelX}
                                            y={point.labelY - 10}
                                            textAnchor="middle"
                                            fill="rgba(255, 255, 255, 0.7)"
                                            fontSize="12"
                                            fontWeight="bold"
                                        >
                                            {point.nombre}
                                        </text>
                                        <text
                                            x={point.labelX}
                                            y={point.labelY + 10}
                                            textAnchor="middle"
                                            fill="#14b8a6"
                                            fontSize="14"
                                            fontWeight="bold"
                                        >
                                            {point.valor}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </div>
                </div>

                {onDelete && (
                    <div className="modal-footer">
                        <button
                            className="btn-delete"
                            onClick={() => onDelete(athlete.id)}
                        >
                            Delete Athlete
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AthleteModal
