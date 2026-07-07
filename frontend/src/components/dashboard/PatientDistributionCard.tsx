import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import './PatientDistributionCard.css'

interface PatientDistributionCardProps {
    low: number
    medium: number
    high: number
    loading?: boolean
}

// Exact colors required: LOW = orange, MEDIUM = blue, HIGH = green.
// These match the app palette (--color-warning / --color-info / --color-success).
const CATEGORY_META = [
    { key: 'low', label: 'Low', color: '#f59e0b' },
    { key: 'medium', label: 'Medium', color: '#3b82f6' },
    { key: 'high', label: 'High', color: '#22c55e' }
] as const

interface LegendEntry {
    key: string
    label: string
    color: string
    value: number
    pct: number
}

function DistributionTooltip({ active, payload }: any) {
    if (!active || !payload || payload.length === 0) return null
    const entry = payload[0].payload as LegendEntry
    return (
        <div className="pd-tooltip">
            <span className="pd-tooltip-name">
                <span className="pd-tooltip-dot" style={{ background: entry.color }} />
                {entry.label}
            </span>
            <span className="pd-tooltip-value">
                {entry.value} {entry.value === 1 ? 'patient' : 'patients'} &middot; {entry.pct}%
            </span>
        </div>
    )
}

function PatientDistributionCard({ low, medium, high, loading = false }: PatientDistributionCardProps) {
    const counts = { low, medium, high }
    const total = low + medium + high

    const legend: LegendEntry[] = CATEGORY_META.map(category => {
        const value = counts[category.key]
        return {
            ...category,
            value,
            pct: total > 0 ? Math.round((value / total) * 100) : 0
        }
    })

    // Only render segments for categories that actually have patients.
    const chartData = legend.filter(entry => entry.value > 0)

    return (
        <div className="patient-distribution-card">
            <div className="dashboard-card-header">
                <h2>Patient Distribution</h2>
                <p>Based on each patient's latest assessment</p>
            </div>

            {loading ? (
                <div className="pd-empty">Loading distribution...</div>
            ) : total === 0 ? (
                <div className="pd-empty">No classified assessments yet.</div>
            ) : (
                <>
                    <div className="pd-chart">
                        <ResponsiveContainer width="100%" height={190}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={62}
                                    outerRadius={90}
                                    paddingAngle={chartData.length > 1 ? 3 : 0}
                                    cornerRadius={4}
                                    stroke="var(--surface-color)"
                                    strokeWidth={2}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    {chartData.map(entry => (
                                        <Cell key={entry.key} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<DistributionTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pd-center">
                            <span className="pd-center-value">{total}</span>
                            <span className="pd-center-label">
                                {total === 1 ? 'Patient' : 'Patients'}
                            </span>
                        </div>
                    </div>

                    <ul className="pd-legend">
                        {legend.map(entry => (
                            <li key={entry.key} className="pd-legend-row">
                                <span className="pd-legend-dot" style={{ background: entry.color }} />
                                <span className="pd-legend-label">{entry.label}</span>
                                <span className="pd-legend-count">
                                    {entry.value} {entry.value === 1 ? 'patient' : 'patients'}
                                </span>
                                <span className="pd-legend-pct">{entry.pct}%</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}

export default PatientDistributionCard
