import { useState, useMemo, useEffect } from 'react'
import PageTemplate from '../../components/templates/PageTemplate'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import MetricsOverview from '@/components/dashboard/MetricsOverview'
import QuickActionsBar from '@/components/dashboard/QuickActionsBar'
import RecentActivityCard from '@/components/dashboard/RecentActivityCard'
import AssessmentsTrendCard from '@/components/dashboard/AssessmentsTrendCard'
import { useAthleteStore } from '@/store/athleteStore'
import { useAnalysisStore } from '@/store/analysisStore'
import type { Analysis, Athlete } from '../../services/api'
import './Dashboard.css'

const TREND_DAYS = 30
const RECENT_ACTIVITY_LIMIT = 7
const FOLLOW_UP_STALE_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000

function Dashboard() {
    const { athletes, loading: athletesLoading, fetchAthletes } = useAthleteStore()
    const { analyses, loading: analysesLoading, fetchAnalyses } = useAnalysisStore()
    const [error, setError] = useState('')

    // Fetch athletes and analyses on mount ONLY if store is empty
    useEffect(() => {
        const loadData = async () => {
            try {
                if (athletes.length === 0) {
                    await fetchAthletes()
                }
                if (analyses.length === 0) {
                    await fetchAnalyses()
                }
            } catch (err) {
                console.error('Error loading dashboard data:', err)
                setError('Error loading dashboard data')
            }
        }

        loadData()
    }, []) // Only run once on mount

    const loading = athletesLoading || analysesLoading

    const athleteById = useMemo(() => {
        const map = new Map<string, Athlete>()
        athletes.forEach((athlete: Athlete) => map.set(athlete.id, athlete))
        return map
    }, [athletes])

    const latestAnalysisByAthlete = useMemo(() => {
        const map = new Map<string, Analysis>()
        analyses.forEach((analysis: Analysis) => {
            const current = map.get(analysis.athleteId)
            if (!current || new Date(analysis.evaluationDate) > new Date(current.evaluationDate)) {
                map.set(analysis.athleteId, analysis)
            }
        })
        return map
    }, [analyses])

    const assessmentsThisWeek = useMemo(() => {
        const now = Date.now()
        return analyses.filter((a: Analysis) => now - new Date(a.evaluationDate).getTime() <= 7 * DAY_MS).length
    }, [analyses])

    const pendingFollowUps = useMemo(() => {
        const now = Date.now()
        return athletes.filter((athlete: Athlete) => {
            const latest = latestAnalysisByAthlete.get(athlete.id)
            if (!latest) return true
            return now - new Date(latest.evaluationDate).getTime() > FOLLOW_UP_STALE_DAYS * DAY_MS
        }).length
    }, [athletes, latestAnalysisByAthlete])

    const recentActivity = useMemo(() => {
        return [...analyses]
            .sort((a, b) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime())
            .slice(0, RECENT_ACTIVITY_LIMIT)
            .map((analysis: Analysis) => {
                const athlete = athleteById.get(analysis.athleteId)
                return {
                    id: analysis.id,
                    athleteId: analysis.athleteId,
                    patientName: athlete?.name || analysis.athlete?.name || 'Unknown patient',
                    photo: athlete?.photo ?? analysis.athlete?.photo,
                    evaluationDate: analysis.evaluationDate,
                    classification: analysis.cohortClassification || analysis.globalClassification
                }
            })
    }, [analyses, athleteById])

    const trendData = useMemo(() => {
        const countsByDay = new Map<string, number>()
        analyses.forEach((analysis: Analysis) => {
            const day = new Date(analysis.evaluationDate)
            day.setHours(0, 0, 0, 0)
            const key = day.toISOString().slice(0, 10)
            countsByDay.set(key, (countsByDay.get(key) || 0) + 1)
        })

        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        const days = []
        for (let i = TREND_DAYS - 1; i >= 0; i--) {
            const day = new Date(todayStart.getTime() - i * DAY_MS)
            const key = day.toISOString().slice(0, 10)
            days.push({
                date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                count: countsByDay.get(key) || 0
            })
        }
        return days
    }, [analyses])

    return (
        <PageTemplate className="dashboard">
            <DashboardHeader />

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <MetricsOverview
                totalPatients={athletes.length}
                totalAssessments={analyses.length}
                assessmentsThisWeek={assessmentsThisWeek}
                pendingFollowUps={pendingFollowUps}
                loading={loading}
            />

            <QuickActionsBar />

            <div className="dashboard-columns">
                <RecentActivityCard items={recentActivity} loading={loading} />
                <AssessmentsTrendCard data={trendData} loading={loading} />
            </div>
        </PageTemplate>
    )
}

export default Dashboard
