import { useEffect, useMemo, useState } from 'react'
import { IoSparklesOutline } from 'react-icons/io5'
import { analysisAPI, claudeAPI, FLEXIBILITY_EXERCISE_IDS, type AIAnalysisResult } from '@/services/api'
import type { BodyMark } from './BodyVisualization'
import type { FlexibilityAssessmentFormState } from '@/hooks/useFlexibilityAssessmentForm'
import ChecklistItem, { ChecklistItemState } from './ChecklistItem'
import { CHECKLIST_TYPES, ChecklistType } from './checklistTypes'
import './TextualAnalysisSection.css'

interface PatientContext {
    name?: string
    age?: number
    sport?: string
}

interface TextualAnalysisSectionProps {
    patientId: string | undefined
    patientContext: PatientContext
    onResultsChange: (results: AIAnalysisResult[]) => void
    onGeneratingChange?: (isGenerating: boolean) => void
    // Richer clinical context, pulled straight from NewAnalysis.tsx's existing
    // form state (nothing new computed here) so the backend can build a much
    // fuller prompt. evaluationDate/bodyMarks are always forwarded; flexibility
    // ratings are only relevant (and only sent) for the 'flexibility' type.
    evaluationDate?: string
    bodyMarks?: BodyMark[]
    flexibilityItems?: FlexibilityAssessmentFormState
}

type ChecklistMap = Record<ChecklistType, ChecklistItemState>

function emptyItemState(): ChecklistItemState {
    return { checked: false, files: [], prompt: '', loading: false, error: null, result: null }
}

function initialChecklistMap(): ChecklistMap {
    const map = {} as ChecklistMap
    for (const type of CHECKLIST_TYPES) map[type] = emptyItemState()
    return map
}

function isEligible(type: ChecklistType, state: ChecklistItemState): boolean {
    if (!state.checked) return false
    if (type === 'free') return state.prompt.trim().length > 0
    return state.files.length > 0 || state.prompt.trim().length > 0
}

function TextualAnalysisSection({
    patientId,
    patientContext,
    onResultsChange,
    onGeneratingChange,
    evaluationDate,
    bodyMarks,
    flexibilityItems
}: TextualAnalysisSectionProps) {
    const [items, setItems] = useState<ChecklistMap>(initialChecklistMap)
    const [previousAssessmentsSummary, setPreviousAssessmentsSummary] = useState<string | undefined>(undefined)

    // Best-effort: summarize the patient's recent assessments for AI context.
    // Failures here never block generation.
    useEffect(() => {
        if (!patientId) {
            setPreviousAssessmentsSummary(undefined)
            return
        }
        let cancelled = false
        analysisAPI.getByAthleteId(patientId)
            .then((res) => {
                if (cancelled) return
                const recent = [...(res.data || [])]
                    .sort((a, b) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime())
                    .slice(0, 3)
                if (recent.length === 0) {
                    setPreviousAssessmentsSummary(undefined)
                    return
                }
                const summary = recent
                    .map(a => `${new Date(a.evaluationDate).toLocaleDateString('en-GB')} (${a.globalClassification || 'unclassified'})`)
                    .join('; ')
                setPreviousAssessmentsSummary(summary)
            })
            .catch(() => {
                if (!cancelled) setPreviousAssessmentsSummary(undefined)
            })
        return () => { cancelled = true }
    }, [patientId])

    const updateItem = (type: ChecklistType, patch: Partial<ChecklistItemState>) => {
        setItems(prev => ({ ...prev, [type]: { ...prev[type], ...patch } }))
    }

    const handleToggle = (type: ChecklistType, checked: boolean) => {
        updateItem(type, checked ? { checked: true } : emptyItemState())
    }

    const eligibleTypes = useMemo(
        () => CHECKLIST_TYPES.filter(type => isEligible(type, items[type])),
        [items]
    )

    const anyLoading = useMemo(
        () => CHECKLIST_TYPES.some(type => items[type].loading),
        [items]
    )

    useEffect(() => {
        onGeneratingChange?.(anyLoading)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anyLoading])

    const canGenerate = eligibleTypes.length > 0 && !anyLoading

    const collectResults = (map: ChecklistMap): AIAnalysisResult[] =>
        CHECKLIST_TYPES.map(type => map[type].result).filter((r): r is AIAnalysisResult => r !== null)

    const generateForType = async (type: ChecklistType) => {
        updateItem(type, { loading: true, error: null })

        const state = items[type]

        // Only meaningful for the Flexibility Analysis checkbox — the backend
        // ignores this field for every other type regardless.
        const flexibilityRatings = type === 'flexibility' && flexibilityItems
            ? FLEXIBILITY_EXERCISE_IDS.map((exerciseId) => {
                const item = flexibilityItems[exerciseId]
                return {
                    exerciseId,
                    rating: item.rating,
                    hasEvidence: Boolean(item.evidenceFile || item.evidenceUrl)
                }
            })
            : undefined

        const response = await claudeAPI.analyzeAssessment({
            checkboxType: type,
            userPrompt: state.prompt.trim() || undefined,
            patientContext: { ...patientContext, previousAssessmentsSummary },
            patientId: patientId || '',
            files: state.files,
            evaluationDate,
            bodyMarks,
            flexibilityRatings
        })

        if (!response.success || !response.data) {
            updateItem(type, { loading: false, error: response.error || 'AI analysis failed. Please try again.' })
            return
        }

        const result: AIAnalysisResult = {
            id: crypto.randomUUID(),
            checkboxType: type,
            userPrompt: state.prompt.trim() || null,
            uploadedFiles: response.data.uploadedFiles,
            aiResponse: response.data.aiResponse,
            tokensUsed: response.data.tokensUsed,
            createdAt: new Date().toISOString()
        }

        setItems(prev => {
            const next = { ...prev, [type]: { ...prev[type], loading: false, error: null, result } }
            onResultsChange(collectResults(next))
            return next
        })
    }

    const handleGenerate = () => {
        eligibleTypes.forEach(type => {
            generateForType(type)
        })
    }

    return (
        <div className="textual-analysis-section">
            <div className="textual-analysis-list">
                {CHECKLIST_TYPES.map(type => (
                    <ChecklistItem
                        key={type}
                        type={type}
                        state={items[type]}
                        onToggle={(checked) => handleToggle(type, checked)}
                        onFilesChange={(files) => updateItem(type, { files })}
                        onPromptChange={(prompt) => updateItem(type, { prompt })}
                    />
                ))}
            </div>

            <button
                type="button"
                className="textual-analysis-generate-btn"
                onClick={handleGenerate}
                disabled={!canGenerate}
            >
                <IoSparklesOutline />
                {anyLoading ? 'Analyzing...' : 'Generate AI Analysis'}
            </button>
        </div>
    )
}

export default TextualAnalysisSection
