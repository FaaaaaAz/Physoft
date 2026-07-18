import { IoGolfOutline, IoImageOutline } from 'react-icons/io5'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
    SPORT_IMAGES,
    SPORT_TITLES,
    SPORT_PLACEHOLDERS,
    DEFAULT_SPORT_PLACEHOLDER,
    inertialForcePhasesMock,
    sportInterpretationMock,
    sportMetricsMock
} from './mockSportAnalysis'
import './charts/ChartCard.css'
import './SportReportSection.css'

interface SportReportSectionProps {
    sport?: string | null
}

function InertialForceTooltip({ active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null
    return (
        <div className="chart-card-tooltip">
            <div style={{ fontWeight: 700 }}>{label}</div>
            <div style={{ color: payload[0].color }}>{payload[0].value}</div>
        </div>
    )
}

/**
 * Sport Report — dynamic title/image driven by SPORT_TITLES/SPORT_IMAGES/
 * SPORT_PLACEHOLDERS (mockSportAnalysis.ts). Not Golf-specific: adding a
 * new sport is adding one entry to each map, no component changes.
 */
function SportReportSection({ sport }: SportReportSectionProps) {
    const title = sport ? SPORT_TITLES[sport] || `INERTIAL FORCE IN ${sport.toUpperCase()}` : 'INERTIAL FORCE ANALYSIS'
    const image = sport ? SPORT_IMAGES[sport] : undefined
    const placeholderText = sport ? SPORT_PLACEHOLDERS[sport] || DEFAULT_SPORT_PLACEHOLDER : DEFAULT_SPORT_PLACEHOLDER

    return (
        <section className="analysis-section">
            <h2>
                <IoGolfOutline /> {title}
            </h2>

            <div className="sport-report-body">
                <div className="sport-report-visual">
                    {image ? (
                        <img src={image} alt={sport || 'Sport'} className="sport-report-image" />
                    ) : (
                        <div className="sport-report-placeholder">
                            <IoImageOutline />
                            <p>{placeholderText}</p>
                        </div>
                    )}

                    <div className="chart-card sport-report-chart-card">
                        <div className="chart-card-header">
                            <h3>Inertial Force by Phase</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={inertialForcePhasesMock} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="var(--border-color)" strokeOpacity={0.5} />
                                <XAxis dataKey="phase" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
                                <Tooltip content={<InertialForceTooltip />} cursor={{ stroke: 'var(--border-color)' }} />
                                <Line type="monotone" dataKey="value" name="Inertial Force" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 4, fill: '#14b8a6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="sport-report-side">
                    <div className="chart-card">
                        <div className="chart-card-header">
                            <h3>Interpretation</h3>
                        </div>
                        <ul className="sport-report-bullets">
                            {sportInterpretationMock.map((point, idx) => (
                                <li key={idx}>{point}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="chart-card">
                        <div className="chart-card-header">
                            <h3>Metrics</h3>
                        </div>
                        <div className="sport-report-metrics">
                            {sportMetricsMock.map((metric) => (
                                <div key={metric.label} className="sport-report-metric">
                                    <span className="sport-report-metric-label">{metric.label}</span>
                                    <span className="sport-report-metric-value">{metric.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SportReportSection
