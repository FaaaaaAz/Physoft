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
        { key: 'flexibility' as const, label: '1. Análisis de Flexibilidad', description: 'La IA analizará el rango de movimiento y flexibilidad articular' },
        { key: 'biobit' as const, label: '2. Análisis Biobit', description: 'La IA evaluará los patrones de activación muscular' },
        { key: 'asymmetry' as const, label: '3. Asimetría Muscular en Activación', description: 'La IA detectará desequilibrios musculares bilaterales' },
        { key: 'motorControl' as const, label: '4. Análisis de Control Motor Activo', description: 'La IA evaluará la estabilidad y control neuromuscular' },
        { key: 'fatigue' as const, label: '5. Análisis de Fatiga Muscular Funcional', description: 'La IA medirá la resistencia e índices de fatiga' },
        { key: 'inertiaForce' as const, label: '6. Análisis de Control de Fuerza Inercial', description: 'La IA analizará la capacidad de generación y control de fuerza' }
    ]

    return (
        <div className="ai-analysis-panel">
            <h3 className="section-title">
                <span className="section-number">2</span>
                Análisis Textual
            </h3>
            <p className="section-description">
                Selecciona los tipos de análisis que deseas generar con IA.
                La IA analizará las imágenes adjuntas y generará informes detallados.
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
                    {isProcessing ? 'Analizando con IA...' : 'Generar Análisis con IA'}
                    {!isOnline && ' (Sin conexión)'}
                </button>

                <button
                    type="button"
                    className="btn-manual-analysis"
                    onClick={onManualAnalysis}
                    disabled={isProcessing || disabled}
                >
                    Realizar Análisis Manual
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
                        Procesando imágenes y generando análisis... {progress}%
                    </p>
                </div>
            )}
        </div>
    )
}

export default AIAnalysisPanel
