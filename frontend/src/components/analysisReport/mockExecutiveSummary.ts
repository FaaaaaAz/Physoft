// ============================================
// MOCK DATA: Executive Summary
// ============================================
// UI-only placeholder data. This is the seam a future real report
// generator swaps out — ExecutiveSummaryCard only depends on this file's
// exported shape (ExecutiveSummaryData), never on hardcoded values inline.
// ============================================

export type CapacityStatus = 'Low' | 'Medium' | 'High'

export const STATUS_COLORS: Record<CapacityStatus, string> = {
    Low: '#ef4444',
    Medium: '#f59e0b',
    High: '#22c55e'
}

export interface ExecutiveSummaryData {
    score: number
    maxScore: number
    status: CapacityStatus
    summaryText: string
    stats: {
        completedEvaluations: string
        dataSourcesAnalyzed: string
        cohortComparison: string
    }
}

export const executiveSummaryMock: ExecutiveSummaryData = {
    score: 62,
    maxScore: 100,
    status: 'Medium',
    summaryText:
        'The analysis shows a functional physical profile with strengths in power and speed, while identifying ' +
        'opportunities for improvement in flexibility, mobility, and postural control.',
    stats: {
        completedEvaluations: '4/4',
        dataSourcesAnalyzed: '12 sources',
        cohortComparison: 'Athletes 18-35 years'
    }
}
