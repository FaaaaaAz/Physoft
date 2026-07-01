import { IoCheckmark } from 'react-icons/io5'
import type { AnalysisCheckboxes } from '../../types/analysis.types'
import './AIAnalysisPanel.css'

interface AIAnalysisPanelProps {
    checkboxes: AnalysisCheckboxes
    onCheckboxChange: (field: keyof AnalysisCheckboxes) => void
    onGenerateAI: () => void
    onManualAnalysis: () => void
    isProcessing: boolean
    progress: number
    isOnline: boolean
    disabled?: boolean
}

function AIAnalysisPanel({
    checkboxes,
    onCheckboxChange,
    onGenerateAI,
    onManualAnalysis,
    isProcessing,
    progress,
    isOnline,
    disabled = false
}: AIAnalysisPanelProps) {
    const analysisTypes = [
        { key: 'flexibility' as const, label: '1. Flexibility Analysis', description: 'AI will analyze range of motion and joint flexibility' },
        { key: 'biobit' as const, label: '2. Biobit Analysis', description: 'AI will evaluate muscle activation patterns' },
        { key: 'asymmetry' as const, label: '3. Muscular Activation Asymmetry', description: 'AI will detect bilateral muscle imbalances' },
        { key: 'motorControl' as const, label: '4. Active Motor Control Analysis', description: 'AI will evaluate neuromuscular stability and control' },
        { key: 'fatigue' as const, label: '5. Functional Muscle Fatigue Analysis', description: 'AI will measure endurance and fatigue indices' },
        { key: 'inertiaForce' as const, label: '6. Inertia Force Control Analysis', description: 'AI will analyze force generation and control capacity' }
    ]

    return (
        <div className="ai-analysis-panel">
            <h3 className="section-title">
                <span className="section-number">2</span>
                Textual Analysis
            </h3>
            <p className="section-description">
                Select the types of analysis you want AI to generate.
                AI will analyze the attached images and produce detailed reports.
            </p>

            <div className="ai-checkbox-grid">
                {analysisTypes.map(({ key, label, description }) => (
                    <label key={key} className="ai-checkbox-item">
                        <input
                            type="checkbox"
                            checked={checkboxes[key]}
                            onChange={() => onCheckboxChange(key)}
                            disabled={disabled || isProcessing}
                        />
                        <span className="checkbox-label">
                            <IoCheckmark className="check-icon" />
                            {label}
                        </span>
                        <p className="checkbox-description">{description}</p>
                    </label>
                ))}
            </div>

            <div className="ai-actions">
                <button
                    type="button"
                    className="btn-generate-ai"
                    onClick={onGenerateAI}
                    disabled={isProcessing || !isOnline || disabled}
                >
                    {isProcessing ? 'Analyzing with AI...' : 'Generate Analysis with AI'}
                    {!isOnline && ' (Offline)'}
                </button>

                <button
                    type="button"
                    className="btn-manual-analysis"
                    onClick={onManualAnalysis}
                    disabled={isProcessing || disabled}
                >
                    Perform Manual Analysis
                </button>
            </div>

            {isProcessing && (
                <div className="ai-progress-container">
                    <div className="ai-progress-bar">
                        <div
                            className="ai-progress-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="ai-progress-text">
                        Processing images and generating analysis... {progress}%
                    </p>
                </div>
            )}
        </div>
    )
}

export default AIAnalysisPanel
