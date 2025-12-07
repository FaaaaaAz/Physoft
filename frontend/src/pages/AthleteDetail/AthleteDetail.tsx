import { IoCalendar, IoBody, IoTrophy, IoResize, IoBarbell, IoMan, IoEye } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import { BreadcrumbItem } from '../../components/Breadcrumb'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { athleteAPI, analysisAPI, Athlete, Analysis } from '../../services/api'
import { usePentagonChart, usePentagonRadialLines } from '../../hooks/usePentagonChart'
import { calculateAge } from '../../utils/date.utils'
import LoadingSpinner from '@/components/common/feedback/LoadingSpinner'
import './AthleteDetail.css'

function AthleteDetail() {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{ id: string }>()
    const from = location.state?.from || 'all-analysis'

    const [athlete, setAthlete] = useState<Athlete | null>(null)
    const [analyses, setAnalyses] = useState<Analysis[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string>('')

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (id) {
            loadAthleteData(id)
        }
    }, [id])

    const loadAthleteData = async (athleteId: string) => {
        try {
            setIsLoading(true)
            setError('')

            const [athleteResponse, analysesResponse] = await Promise.all([
                athleteAPI.getById(athleteId),
                analysisAPI.getAll({ athleteId })
            ])

            setAthlete(athleteResponse.data)
            setAnalyses(analysesResponse.data.sort((a, b) =>
                new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime()
            ))
        } catch (err) {
            console.error('Error loading athlete data:', err)
            setError('Error loading athlete data')
        } finally {
            setIsLoading(false)
        }
    }

    // Calculate latest capacities from most recent analysis (before early returns for hooks)
    const latestAnalysis = analyses[0]
    const capacities = latestAnalysis ? {
        potencia: latestAnalysis.power || 0,
        fuerza: latestAnalysis.strength || 0,
        velocidad: latestAnalysis.speed || 0,
        flexibilidad: latestAnalysis.flexibility || 0,
        resistencia: latestAnalysis.endurance || 0
    } : {
        potencia: 0,
        fuerza: 0,
        velocidad: 0,
        flexibilidad: 0,
        resistencia: 0
    }

    // Pentagon chart using custom hook - MUST be called before any conditional returns
    const chartConfig = { centerX: 150, centerY: 150, maxRadius: 120, labelOffset: 30 }
    const pentagonData = usePentagonChart(capacities, chartConfig)
    // const guideLines = usePentagonGuideLines(chartConfig) // Not used currently
    const radialLines = usePentagonRadialLines(chartConfig)

    // Early returns AFTER all hooks
    if (isLoading) {
        return (
            <PageTemplate title="Loading..." showBackButton={true} backTo="/all-analysis">
                <LoadingSpinner message="Loading athlete data..." />
            </PageTemplate>
        )
    }

    if (error || !athlete) {
        return (
            <PageTemplate title="Error" showBackButton={true} backTo="/all-analysis">
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-primary)' }}>
                    <p>{error || 'Athlete not found'}</p>
                </div>
            </PageTemplate>
        )
    }

    const getClassificationLabel = (classification: string | null | undefined) => {
        if (classification === 'high') return 'Above Average'
        if (classification === 'medium') return 'Average'
        if (classification === 'low') return 'Below Average'
        return 'N/A'
    }

    const getBadgeClass = (classification: string | null | undefined) => {
        if (classification === 'high') return 'badge-high'
        if (classification === 'medium') return 'badge-medium'
        if (classification === 'low') return 'badge-low'
        return 'badge-medium'
    }

    const handleViewAnalysis = (analysisId: number) => {
        navigate(`/analysis-view/${analysisId}`)
    }

    const age = calculateAge(athlete.birthDate)
    const latestClassification = latestAnalysis?.globalClassification

    // Dynamic breadcrumb based on origin
    const breadcrumbItems: BreadcrumbItem[] = from === 'all-analyses'
        ? [
            { label: 'Analysis', path: '/analysis' },
            { label: 'All Analyses', path: '/all-analyses' },
            { label: athlete.name }
        ]
        : [
            { label: 'Analysis', path: '/analysis' },
            { label: athlete.name }
        ]

    return (
        <PageTemplate
            title={`${athlete.name} Details`}
            showBackButton={true}
            backTo={from === 'analysis' ? '/analysis' : '/all-analysis'}
            breadcrumbItems={breadcrumbItems}
        >
            <div className="athlete-detail-container">
                {/* Header with basic information */}
                <div className="detail-header">
                    <div className="detail-header-left">
                        <div className="detail-avatar">
                            {athlete.photo ? (
                                <img src={athlete.photo} alt={athlete.name} />
                            ) : (
                                <div className="detail-avatar-placeholder">
                                    {athlete.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="detail-info-main">
                            <h1 className="detail-name">{athlete.name}</h1>
                            <p className="detail-position-club">{athlete.position || 'N/A'} • {athlete.club || 'N/A'}</p>
                            <p className="detail-code">#{athlete.accessCode}</p>
                        </div>
                    </div>
                </div>

                {/* Information cards */}
                <div className="detail-info-cards">
                    <div className="detail-info-card">
                        <IoCalendar className="card-icon" />
                        <div className="card-content">
                            <span className="card-label">AGE</span>
                            <span className="card-value">{age > 0 ? `${age} years` : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="detail-info-card">
                        <IoMan className="card-icon" />
                        <div className="card-content">
                            <span className="card-label">BODY TYPE</span>
                            <span className="card-value-small">{athlete.bodyType || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="detail-info-card">
                        <IoResize className="card-icon" />
                        <div className="card-content">
                            <span className="card-label">HEIGHT</span>
                            <span className="card-value">{athlete.height ? `${athlete.height} cm` : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="detail-info-card">
                        <IoBarbell className="card-icon" />
                        <div className="card-content">
                            <span className="card-label">WEIGHT</span>
                            <span className="card-value">{athlete.weight ? `${athlete.weight} kg` : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="detail-info-card">
                        <IoBody className="card-icon" />
                        <div className="card-content">
                            <span className="card-label">TOTAL ANALYSES</span>
                            <span className="card-value">{analyses.length}</span>
                        </div>
                    </div>

                    <div className="detail-info-card">
                        <IoTrophy className="card-icon" />
                        <div className="card-content">
                            <span className="card-label">LATEST CLASSIFICATION</span>
                            <span className={`badge ${getBadgeClass(latestClassification)}`}>
                                {getClassificationLabel(latestClassification)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Current Physical Capacities */}
                {analyses.length > 0 && (
                    <div className="detail-section">
                        <h2 className="section-title">
                            <IoBody />
                            Current Physical Capacities
                        </h2>
                        <div className="pentagon-chart-container">
                            <svg width="100%" height="100%" viewBox="0 0 300 320" preserveAspectRatio="xMidYMid meet">
                                {/* Pentagon guides */}
                                <polygon
                                    points={pentagonData.backgroundPath}
                                    fill="none"
                                    stroke="rgba(255, 255, 255, 0.1)"
                                    strokeWidth="1"
                                />

                                {/* Capacities pentagon */}
                                <polygon
                                    points={pentagonData.pointsPath}
                                    fill="rgba(20, 184, 166, 0.3)"
                                    stroke="var(--primary-color)"
                                    strokeWidth="3"
                                    strokeLinejoin="round"
                                />

                                {/* Points and labels */}
                                {pentagonData.points.map((point, i) => (
                                    <g key={i}>
                                        {/* Point */}
                                        <circle
                                            cx={point.x}
                                            cy={point.y}
                                            r="6"
                                            fill="var(--primary-color)"
                                            stroke="#0a0a0a"
                                            strokeWidth="2"
                                        />

                                        {/* Label background */}
                                        <rect
                                            x={point.labelX - 45}
                                            y={point.labelY - 25}
                                            width="90"
                                            height="40"
                                            fill="rgba(0, 0, 0, 0.7)"
                                            rx="6"
                                            stroke="rgba(20, 184, 166, 0.3)"
                                            strokeWidth="1"
                                        />

                                        {/* Label */}
                                        <text
                                            x={point.labelX}
                                            y={point.labelY - 8}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="15"
                                            fontWeight="700"
                                        >
                                            {point.nombre}
                                        </text>

                                        {/* Value */}
                                        <text
                                            x={point.labelX}
                                            y={point.labelY + 10}
                                            textAnchor="middle"
                                            fill="var(--primary-color)"
                                            fontSize="16"
                                            fontWeight="700"
                                        >
                                            {point.valor}
                                        </text>
                                    </g>
                                ))}

                                {/* Lines from center to each vertex */}
                                {radialLines.map((line, i) => (
                                    <line
                                        key={`line-${i}`}
                                        x1={line.x1}
                                        y1={line.y1}
                                        x2={line.x2}
                                        y2={line.y2}
                                        stroke="rgba(255, 255, 255, 0.1)"
                                        strokeWidth="1"
                                    />
                                ))}
                            </svg>
                        </div>
                    </div>
                )}

                {/* Analysis History */}
                <div className="detail-section">
                    <h2 className="section-title">
                        <IoCalendar />
                        Analysis History
                    </h2>
                    <div className="history-table-container">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Classification</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analyses.map((analysis) => (
                                    <tr key={analysis.id}>
                                        <td>{new Date(analysis.evaluationDate).toLocaleDateString('en-US')}</td>
                                        <td>
                                            <span className={`badge ${getBadgeClass(analysis.globalClassification)}`}>
                                                {getClassificationLabel(analysis.globalClassification)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="history-actions">
                                                <button
                                                    className="action-btn action-btn-view"
                                                    onClick={() => handleViewAnalysis(analysis.id)}
                                                    title="View details"
                                                >
                                                    <IoEye />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageTemplate>
    )
}

export default AthleteDetail
