import { useEffect, useRef, useState } from 'react'
import {
    FLEXIBILITY_EXERCISE_IDS,
    type FlexibilityExerciseId,
    type FlexibilityRating,
    type FlexibilityAssessmentResult
} from '@/services/api'

export interface FlexibilityExerciseFormState {
    exerciseId: FlexibilityExerciseId
    rating: FlexibilityRating | null
    evidenceFile: File | null      // newly picked, not-yet-uploaded (create flow)
    evidenceUrl: string | null     // persisted Cloudinary URL (edit/view flow)
    evidencePreview: string | null // local blob: URL for evidenceFile, kept in sync with it
}

export type FlexibilityAssessmentFormState = Record<FlexibilityExerciseId, FlexibilityExerciseFormState>

function emptyState(): FlexibilityAssessmentFormState {
    return Object.fromEntries(
        FLEXIBILITY_EXERCISE_IDS.map((exerciseId) => [
            exerciseId,
            { exerciseId, rating: null, evidenceFile: null, evidenceUrl: null, evidencePreview: null }
        ])
    ) as FlexibilityAssessmentFormState
}

function fromResults(results: FlexibilityAssessmentResult[] | null | undefined): FlexibilityAssessmentFormState {
    const state = emptyState()
    for (const result of results || []) {
        if (state[result.exerciseId]) {
            state[result.exerciseId] = {
                ...state[result.exerciseId],
                rating: result.rating,
                evidenceUrl: result.evidenceUrl
            }
        }
    }
    return state
}

/** Image src to render for an exercise: the local pick takes priority over the persisted URL. */
export function getEvidencePreviewSrc(item: FlexibilityExerciseFormState): string | null {
    return item.evidencePreview ?? item.evidenceUrl
}

export interface UseFlexibilityAssessmentFormReturn {
    items: FlexibilityAssessmentFormState
    setRating: (exerciseId: FlexibilityExerciseId, rating: FlexibilityRating) => void
    setEvidenceFile: (exerciseId: FlexibilityExerciseId, file: File | null) => void
    setEvidenceUrl: (exerciseId: FlexibilityExerciseId, url: string | null) => void
}

/**
 * Local form state for the Flexibility Assessment section, shared by the
 * create (NewAnalysis) and edit (EditAnalysis) flows. Each exercise tracks a
 * rating plus either a locally-picked (not yet uploaded) evidence file or an
 * already-persisted evidence URL - never both, `setEvidenceFile`/`setEvidenceUrl`
 * clear the other when one is set.
 */
export function useFlexibilityAssessmentForm(initial?: FlexibilityAssessmentResult[] | null): UseFlexibilityAssessmentFormReturn {
    const [items, setItems] = useState<FlexibilityAssessmentFormState>(() => fromResults(initial))
    const itemsRef = useRef(items)
    itemsRef.current = items

    // `initial` arrives asynchronously (the analysis loads after mount), so
    // re-sync once real data shows up rather than relying on useState's
    // mount-only initializer.
    useEffect(() => {
        if (initial) setItems(fromResults(initial))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initial])

    // Revoke any still-mounted preview blob URLs on unmount
    useEffect(() => {
        return () => {
            Object.values(itemsRef.current).forEach((item) => {
                if (item.evidencePreview) URL.revokeObjectURL(item.evidencePreview)
            })
        }
    }, [])

    const setRating = (exerciseId: FlexibilityExerciseId, rating: FlexibilityRating) => {
        setItems((prev) => ({ ...prev, [exerciseId]: { ...prev[exerciseId], rating } }))
    }

    const setEvidenceFile = (exerciseId: FlexibilityExerciseId, file: File | null) => {
        setItems((prev) => {
            const current = prev[exerciseId]
            if (current.evidencePreview) URL.revokeObjectURL(current.evidencePreview)
            return {
                ...prev,
                [exerciseId]: {
                    ...current,
                    evidenceFile: file,
                    evidencePreview: file ? URL.createObjectURL(file) : null,
                    evidenceUrl: file ? null : current.evidenceUrl
                }
            }
        })
    }

    const setEvidenceUrl = (exerciseId: FlexibilityExerciseId, url: string | null) => {
        setItems((prev) => {
            const current = prev[exerciseId]
            if (current.evidencePreview) URL.revokeObjectURL(current.evidencePreview)
            return {
                ...prev,
                [exerciseId]: { ...current, evidenceFile: null, evidencePreview: null, evidenceUrl: url }
            }
        })
    }

    return { items, setRating, setEvidenceFile, setEvidenceUrl }
}
