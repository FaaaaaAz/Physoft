import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cohortComparisonMock } from '../mockCharts'
import './ChartCard.css'

function CohortTooltip({ active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null
    return (
        <div className="chart-card-tooltip">
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
            {payload.map((entry: any) => (
                <div key={entry.dataKey} style={{ color: entry.color }}>
                    {entry.name}: {entry.value}
                </div>
            ))}
        </div>
    )
}

function CohortComparisonCard() {
    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <h3>Cohort Comparison</h3>
                <p>Patient vs. cohort average</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={cohortComparisonMock} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--border-color)" strokeOpacity={0.5} />
                    <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
                    <Tooltip content={<CohortTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                    <Bar dataKey="patient" name="Patient" fill="var(--color-primary, #14b8a6)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cohortAverage" name="Cohort Average" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CohortComparisonCard
