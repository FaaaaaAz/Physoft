import { useEffect, useState } from 'react'
import FlexibilityExerciseRow, { FlexibilityExercise, FlexibilityRating } from './FlexibilityExerciseRow'
import './FlexibilityAssessmentSection.css'

import ej1Mal from '@/assets/Flexibility_Assessment/physoft_ej1_mal.png'
import ej1Normal from '@/assets/Flexibility_Assessment/physoft_ej1_normal.png'
import ej1Bien from '@/assets/Flexibility_Assessment/physoft_ej1_bien.png'
import ej2Mal from '@/assets/Flexibility_Assessment/physoft_ej2_mal.png'
import ej2Normal from '@/assets/Flexibility_Assessment/physoft_ej2_normal.png'
import ej2Bien from '@/assets/Flexibility_Assessment/physoft_ej2_bien.png'
import ej3Mal from '@/assets/Flexibility_Assessment/physoft_ej3_mal.png'
import ej3Normal from '@/assets/Flexibility_Assessment/physoft_ej3_normal.png'
import ej3Bien from '@/assets/Flexibility_Assessment/physoft_ej3_bien.png'
import ej4Mal from '@/assets/Flexibility_Assessment/physoft_ej4_mal.png'
import ej4Normal from '@/assets/Flexibility_Assessment/physoft_ej4_normal.png'
import ej4Bien from '@/assets/Flexibility_Assessment/physoft_ej4_bien.png'

const FLEXIBILITY_EXERCISES: FlexibilityExercise[] = [
    {
        id: 'forwardFlexion',
        name: 'Forward Flexion Test',
        description: 'Can the patient touch the floor with straight knees?',
        images: { poor: ej1Mal, average: ej1Normal, excellent: ej1Bien }
    },
    {
        id: 'shoulderMobility',
        name: 'Shoulder Mobility Test',
        description: "Can the patient's hands meet behind the back?",
        images: { poor: ej2Mal, average: ej2Normal, excellent: ej2Bien }
    },
    {
        id: 'butterfly',
        name: 'Butterfly Test',
        description: 'How close are the knees to the floor while sitting?',
        images: { poor: ej3Mal, average: ej3Normal, excellent: ej3Bien }
    },
    {
        id: 'deepSquat',
        name: 'Deep Squat Test',
        description: 'Can the patient perform a full squat while keeping the heels on the ground?',
        images: { poor: ej4Mal, average: ej4Normal, excellent: ej4Bien }
    }
]

interface ExerciseState {
    rating: FlexibilityRating | null
    evidence: File | null
    evidencePreview: string | null
}

function emptyExerciseState(): ExerciseState {
    return { rating: null, evidence: null, evidencePreview: null }
}

function FlexibilityAssessmentSection() {
    const [results, setResults] = useState<Record<string, ExerciseState>>(() =>
        Object.fromEntries(FLEXIBILITY_EXERCISES.map((exercise) => [exercise.id, emptyExerciseState()]))
    )

    // Revoke object URLs on unmount to avoid leaking memory
    useEffect(() => {
        return () => {
            Object.values(results).forEach((state) => {
                if (state.evidencePreview) URL.revokeObjectURL(state.evidencePreview)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleRatingSelect = (exerciseId: string, rating: FlexibilityRating) => {
        setResults((prev) => ({
            ...prev,
            [exerciseId]: { ...prev[exerciseId], rating }
        }))
    }

    const handleEvidenceChange = (exerciseId: string, file: File | null) => {
        setResults((prev) => {
            const previous = prev[exerciseId]
            if (previous.evidencePreview) URL.revokeObjectURL(previous.evidencePreview)
            return {
                ...prev,
                [exerciseId]: {
                    ...previous,
                    evidence: file,
                    evidencePreview: file ? URL.createObjectURL(file) : null
                }
            }
        })
    }

    return (
        <div className="flexibility-assessment-section">
            {FLEXIBILITY_EXERCISES.map((exercise, index) => (
                <FlexibilityExerciseRow
                    key={exercise.id}
                    index={index + 1}
                    exercise={exercise}
                    rating={results[exercise.id].rating}
                    evidence={results[exercise.id].evidence}
                    evidencePreview={results[exercise.id].evidencePreview}
                    onRatingSelect={(rating) => handleRatingSelect(exercise.id, rating)}
                    onEvidenceChange={(file) => handleEvidenceChange(exercise.id, file)}
                />
            ))}
        </div>
    )
}

export default FlexibilityAssessmentSection
