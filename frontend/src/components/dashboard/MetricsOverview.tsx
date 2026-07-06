import { ReactNode } from 'react'
import { IoPeople, IoDocumentText, IoCalendar, IoAlertCircle } from 'react-icons/io5'
import './MetricsOverview.css'

interface MetricCardProps {
    icon: ReactNode
    value: number
    label: string
    accent?: 'primary' | 'warning'
    loading?: boolean
}

function MetricCard({ icon, value, label, accent = 'primary', loading = false }: MetricCardProps) {
    return (
        <div className="metric-card">
            <div className={`metric-card-icon metric-card-icon-${accent}`}>{icon}</div>
            <div className="metric-card-info">
                <h3 className="metric-card-value">{loading ? '…' : value}</h3>
                <p className="metric-card-label">{label}</p>
            </div>
        </div>
    )
}

interface MetricsOverviewProps {
    totalPatients: number
    totalAssessments: number
    assessmentsThisWeek: number
    pendingFollowUps: number
    loading?: boolean
}

function MetricsOverview({
    totalPatients,
    totalAssessments,
    assessmentsThisWeek,
    pendingFollowUps,
    loading = false
}: MetricsOverviewProps) {
    return (
        <div className="metrics-overview">
            <MetricCard icon={<IoPeople />} value={totalPatients} label="Total Patients" loading={loading} />
            <MetricCard icon={<IoDocumentText />} value={totalAssessments} label="Total Assessments" loading={loading} />
            <MetricCard icon={<IoCalendar />} value={assessmentsThisWeek} label="Assessments This Week" loading={loading} />
            <MetricCard
                icon={<IoAlertCircle />}
                value={pendingFollowUps}
                label="Pending Follow-ups"
                accent="warning"
                loading={loading}
            />
        </div>
    )
}

export default MetricsOverview
