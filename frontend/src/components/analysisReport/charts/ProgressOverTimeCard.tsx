import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { progressOverTimeMock } from '../mockCharts'
import './ChartCard.css'

function ProgressTooltip({ active, payload, label }: any) {
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

function ProgressOverTimeCard() {
    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <h3>Progress Over Time</h3>
                <p>Monthly progression (last 6 months)</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={progressOverTimeMock} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--border-color)" strokeOpacity={0.5} />
                    <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
                    <Tooltip content={<ProgressTooltip />} cursor={{ stroke: 'var(--border-color)' }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                    <Line type="monotone" dataKey="strength" name="Strength" stroke="#14b8a6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="power" name="Power" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="flexibility" name="Flexibility" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ProgressOverTimeCard
