import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './AssessmentsTrendCard.css'

export interface TrendPoint {
    date: string
    count: number
}

interface AssessmentsTrendCardProps {
    data: TrendPoint[]
    loading?: boolean
}

function TrendTooltip({ active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null

    const count = payload[0].value

    return (
        <div className="trend-tooltip">
            <span className="trend-tooltip-date">{label}</span>
            <span className="trend-tooltip-value">
                {count} {count === 1 ? 'assessment' : 'assessments'}
            </span>
        </div>
    )
}

function AssessmentsTrendCard({ data, loading = false }: AssessmentsTrendCardProps) {
    const hasData = data.some(point => point.count > 0)

    return (
        <div className="assessments-trend-card">
            <div className="dashboard-card-header">
                <h2>Assessments Over Time</h2>
                <p>Last 30 days</p>
            </div>

            {loading ? (
                <div className="trend-empty">Loading trend...</div>
            ) : !hasData ? (
                <div className="trend-empty">No assessments in the last 30 days.</div>
            ) : (
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            stroke="var(--border-color)"
                            strokeOpacity={0.5}
                        />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            interval={Math.ceil(data.length / 6)}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            width={28}
                        />
                        <Tooltip content={<TrendTooltip />} cursor={{ stroke: 'var(--border-color)' }} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="var(--color-primary)"
                            strokeWidth={2}
                            fill="url(#trendFill)"
                            activeDot={{ r: 4, stroke: 'var(--surface-color)', strokeWidth: 2 }}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

export default AssessmentsTrendCard
