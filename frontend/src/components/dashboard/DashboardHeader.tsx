import { useEffect, useState } from 'react'
import './DashboardHeader.css'

function getDateTimeLabels(date: Date) {
    return {
        dateLabel: date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        timeLabel: date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }
}

function DashboardHeader() {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60_000)
        return () => clearInterval(interval)
    }, [])

    const { dateLabel, timeLabel } = getDateTimeLabels(now)

    return (
        <div className="dashboard-header">
            <div className="dashboard-header-greeting">
                <h1 className="dashboard-header-title">Welcome back, Administrator</h1>
                <p className="dashboard-header-subtitle">
                    Here's an overview of your clinic and recent activity.
                </p>
            </div>
            <div className="dashboard-header-datetime">
                <span className="dashboard-header-date">{dateLabel}</span>
                <span className="dashboard-header-time">{timeLabel}</span>
            </div>
        </div>
    )
}

export default DashboardHeader
