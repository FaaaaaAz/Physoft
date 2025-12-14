import { useMemo } from 'react'
import { IoClose, IoFootball, IoEye, IoCreate } from 'react-icons/io5'
import { usePentagonChart, usePentagonGuideLines, usePentagonRadialLines } from '../../hooks/usePentagonChart'
import type { AthleteDisplay } from '../../types/athlete.types'
import { translateBodyType } from '../../utils/translation.utils'
import './AthleteModal.css'

interface AthleteModalProps {
    athlete: AthleteDisplay | null
    onClose: () => void
    onDelete?: (id: string) => void
    onViewDetails?: (id: string) => void
    onEdit?: (id: string) => void
}

function AthleteModal({ athlete, onClose, onDelete, onViewDetails, onEdit }: AthleteModalProps) {
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
                        <div className="modal-overall-row">
                            <div className="modal-overall">
                                <span className="overall-label">General</span>
                                <span className="overall-value">{average}</span>
                            </div>
                        </div>
                        <div className="modal-actions">
                            {onViewDetails && (
                                <button
                                    className="btn-view-details"
                                    onClick={() => onViewDetails(athlete.id)}
                                >
                                    <IoEye /> Ver Detalles
                                </button>
                            )}
                            {onEdit && (
                                <button
                                    className="btn-edit-modal"
                                    onClick={() => onEdit(athlete.id)}
                                >
                                    <IoCreate /> Editar
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    className="btn-delete-inline"
                                    onClick={() => onDelete(athlete.id)}
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="modal-section">
                        <h3 className="section-title">Información Personal</h3>
                        <div className="info-grid">
                            {athlete.accessCode && (
                                <div className="info-item">
                                    <span className="info-label">Código de Acceso</span>
                                    <span className="info-value access-code">{athlete.accessCode}</span>
                                </div>
                            )}
                            <div className="info-item">
                                <span className="info-label">Edad</span>
                                <span className="info-value">{athlete.age} años</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Nacionalidad</span>
                                <span className="info-value">{athlete.nationality || 'No especificado'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Altura</span>
                                <span className="info-value">{athlete.height || 'N/A'} cm</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Peso</span>
                                <span className="info-value">{athlete.weight || 'N/A'} kg</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Tipo de Cuerpo</span>
                                <span className="info-value">{translateBodyType(athlete.bodyType)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-section">
                        <h3 className="section-title">Capacidades Físicas</h3>
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
                                        {/* Label background */}
                                        <rect
                                            x={point.labelX - 40}
                                            y={point.labelY - 22}
                                            width="80"
                                            height="36"
                                            fill="rgba(0, 0, 0, 0.75)"
                                            rx="6"
                                            stroke="rgba(20, 184, 166, 0.3)"
                                            strokeWidth="1"
                                        />
                                        {/* Label text */}
                                        <text
                                            x={point.labelX}
                                            y={point.labelY - 6}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="13"
                                            fontWeight="700"
                                        >
                                            {point.nombre}
                                        </text>
                                        {/* Value text */}
                                        <text
                                            x={point.labelX}
                                            y={point.labelY + 12}
                                            textAnchor="middle"
                                            fill="#14b8a6"
                                            fontSize="15"
                                            fontWeight="700"
                                        >
                                            {point.valor}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AthleteModal
