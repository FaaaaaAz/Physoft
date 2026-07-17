import { useRef, useState } from 'react'
import { IoCameraOutline, IoClose } from 'react-icons/io5'
import './FlexibilityExerciseRow.css'

export type FlexibilityRating = 'poor' | 'average' | 'excellent'

export interface FlexibilityExercise {
    id: string
    name: string
    description: string
    images: Record<FlexibilityRating, string>
}

const RATING_OPTIONS: { value: FlexibilityRating; label: string }[] = [
    { value: 'poor', label: 'Poor' },
    { value: 'average', label: 'Average' },
    { value: 'excellent', label: 'Excellent' }
]

const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png'
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

interface FlexibilityExerciseRowProps {
    index: number
    exercise: FlexibilityExercise
    rating: FlexibilityRating | null
    evidence: File | null
    evidencePreview: string | null
    onRatingSelect: (rating: FlexibilityRating) => void
    onEvidenceChange: (file: File | null) => void
}

function FlexibilityExerciseRow({
    index,
    exercise,
    rating,
    evidence,
    evidencePreview,
    onRatingSelect,
    onEvidenceChange
}: FlexibilityExerciseRowProps) {
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) return

        if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
            setError('Only JPG, JPEG or PNG images are allowed.')
            return
        }

        setError(null)
        onEvidenceChange(file)
    }

    const handleRemoveEvidence = () => {
        onEvidenceChange(null)
        setError(null)
    }

    return (
        <div className="flexibility-exercise-row">
            <div className="flexibility-exercise-info">
                <span className="flexibility-exercise-number">{index}</span>
                <div>
                    <h4 className="flexibility-exercise-name">{exercise.name}</h4>
                    <p className="flexibility-exercise-description">{exercise.description}</p>
                </div>
            </div>

            <div className="flexibility-exercise-options">
                {RATING_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className={`flexibility-option-card ${option.value} ${rating === option.value ? 'selected' : ''}`}
                        onClick={() => onRatingSelect(option.value)}
                        aria-pressed={rating === option.value}
                    >
                        <span className="flexibility-option-image-wrap">
                            <img src={exercise.images[option.value]} alt={`${exercise.name} - ${option.label}`} />
                        </span>
                        <span className="flexibility-option-label">
                            <span className="flexibility-option-radio" />
                            {option.label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flexibility-exercise-evidence">
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED_EXTENSIONS}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                {evidencePreview ? (
                    <div className="flexibility-evidence-preview">
                        <img src={evidencePreview} alt={`${exercise.name} evidence`} />
                        <button
                            type="button"
                            className="flexibility-evidence-remove"
                            onClick={handleRemoveEvidence}
                            aria-label="Remove evidence"
                        >
                            <IoClose />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="flexibility-evidence-upload"
                        onClick={() => inputRef.current?.click()}
                    >
                        <IoCameraOutline />
                        <span>Upload Evidence</span>
                        <p>Photo (optional)</p>
                    </button>
                )}

                {evidence && evidencePreview && (
                    <p className="flexibility-evidence-filename" title={evidence.name}>{evidence.name}</p>
                )}

                {error && <p className="flexibility-evidence-error">{error}</p>}
            </div>
        </div>
    )
}

export default FlexibilityExerciseRow
