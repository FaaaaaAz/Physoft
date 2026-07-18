import { IoAnalyticsOutline } from 'react-icons/io5'
import CircularProgress from './CircularProgress'
import { executiveSummaryMock, STATUS_COLORS } from './mockExecutiveSummary'
import './ExecutiveSummaryCard.css'

/**
 * Executive Summary — global score gauge (left), narrative summary
 * (middle), key stats (right). Data comes entirely from mockExecutiveSummary.ts.
 */
function ExecutiveSummaryCard() {
    const { score, maxScore, status, summaryText, stats } = executiveSummaryMock
    const color = STATUS_COLORS[status]

    return (
        <section className="analysis-section executive-summary-card">
            <h2>
                <IoAnalyticsOutline /> Executive Summary
            </h2>

            <div className="executive-summary-body">
                <div className="executive-summary-gauge">
                    <CircularProgress value={score} max={maxScore} color={color} label={status} />
                    <span className="executive-summary-gauge-caption">Global Classification</span>
                </div>

                <div className="executive-summary-text">
                    <p>{summaryText}</p>
                </div>

                <div className="executive-summary-stats">
                    <div className="executive-summary-stat">
                        <span className="executive-summary-stat-label">Completed Evaluations</span>
                        <span className="executive-summary-stat-value">{stats.completedEvaluations}</span>
                    </div>
                    <div className="executive-summary-stat">
                        <span className="executive-summary-stat-label">Data Sources Analyzed</span>
                        <span className="executive-summary-stat-value">{stats.dataSourcesAnalyzed}</span>
                    </div>
                    <div className="executive-summary-stat">
                        <span className="executive-summary-stat-label">Cohort Comparison</span>
                        <span className="executive-summary-stat-value">{stats.cohortComparison}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ExecutiveSummaryCard
