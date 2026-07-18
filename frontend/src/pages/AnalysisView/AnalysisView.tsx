import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoPerson, IoTrash, IoCreate } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import LoadingSpinner from '@/components/common/feedback/LoadingSpinner'
import { analysisAPI, Analysis } from '../../services/api'
import { useAnalysisStore } from '@/store/analysisStore'
import { MESSAGES } from '@/constants'
import ExecutiveSummaryCard from '@/components/analysisReport/ExecutiveSummaryCard'
import CapacityProfileGrid from '@/components/analysisReport/CapacityProfileGrid'
import MainChartsSection from '@/components/analysisReport/MainChartsSection'
import SportReportSection from '@/components/analysisReport/SportReportSection'
import DetailedAnalysisSection from '@/components/analysisReport/DetailedAnalysisSection'
import './AnalysisView.css'

function AnalysisView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { analyses, fetchAnalyses, getAnalysisById, deleteAnalysis } = useAnalysisStore()

  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!id) return

      try {
        setLoading(true)

        // Try to get from store first
        let analysisData = getAnalysisById(parseInt(id))

        // If not in store and store is empty, fetch all analyses
        if (!analysisData && analyses.length === 0) {
          await fetchAnalyses()
          analysisData = getAnalysisById(parseInt(id))
        }

        // If still not found, fetch directly
        if (!analysisData) {
          const response = await analysisAPI.getById(parseInt(id))
          analysisData = response.data
        }

        setAnalysis(analysisData)
      } catch (error) {
        console.error('Error loading analysis:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalysis()
  }, [id])

  const handleDelete = async () => {
    if (!id || !analysis) return

    if (!window.confirm(MESSAGES.CONFIRM.DELETE_ANALYSIS)) {
      return
    }

    try {
      await deleteAnalysis(parseInt(id))
      navigate('/analysis')
    } catch (error) {
      console.error('Error deleting analysis:', error)
      alert(MESSAGES.ERROR.DELETING_ANALYSIS)
    }
  }

  if (loading) {
    return (
      <PageTemplate title="Loading..." subtitle="">
        <LoadingSpinner message="Loading analysis..." />
      </PageTemplate>
    )
  }

  if (!analysis) {
    return (
      <PageTemplate title="Error" subtitle="">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Analysis not found</p>
          <button
            onClick={() => navigate('/analysis')}
            className="btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Back
          </button>
        </div>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate
      title={`Analysis for ${analysis.athlete?.name || 'Patient'}`}
      subtitle={`Evaluation performed on ${new Date(analysis.evaluationDate).toLocaleDateString('en-US')}`}
      className="analysis-view-page"
      showBackButton={true}
      showAddButton={false}
    >
      {/* Custom Action Buttons */}
      <div className="page-header">
        <div className="page-title-section">
          <div className="page-actions" style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
            <button
              className="btn-primary btn-primary-large"
              onClick={() => navigate(`/analysis/edit/${id}`)}
            >
              <IoCreate /> Edit Analysis
            </button>
            <button
              onClick={handleDelete}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444'
              }}
            >
              <IoTrash /> Delete Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="analysis-view-container">
        {/* Patient Information */}
        {analysis.athlete && (
          <section className="analysis-section">
            <h2>
              <IoPerson /> Patient Information
            </h2>
            <div className="athlete-info-grid">
              <div>
                <strong>Name:</strong> {analysis.athlete.name}
              </div>
              <div>
                <strong>Code:</strong> {analysis.athlete.accessCode}
              </div>
              <div>
                <strong>Sport:</strong> {analysis.athlete.sport}
              </div>
            </div>
          </section>
        )}

        {/* Executive musculoskeletal report — UI only, mock data (see components/analysisReport) */}
        <ExecutiveSummaryCard />
        <CapacityProfileGrid />
        <MainChartsSection />
        <SportReportSection sport={analysis.athlete?.sport} />
        <DetailedAnalysisSection />
      </div>
    </PageTemplate>
  )
}

export default AnalysisView
