import { IoCheckmark } from 'react-icons/io5'
import '../../styles/AIAnalysisSelector.css'

export interface AnalysisCheckboxes {
  flexibilidad: boolean
  biobit: boolean
  asimetria: boolean
  controlMotor: boolean
  fatiga: boolean
  fuerzaInercia: boolean
}

interface AIAnalysisSelectorProps {
  checkboxes: AnalysisCheckboxes
  onChange: (field: keyof AnalysisCheckboxes) => void
  onGenerateAI: () => void
  onManualAnalysis: () => void
  aiProcessing: boolean
  aiProgress: number
  isOnline: boolean
  disabled?: boolean
}

const ANALYSIS_OPTIONS = [
  {
    key: 'flexibilidad' as keyof AnalysisCheckboxes,
    label: '1. Análisis de flexibilidad articular',
    description: 'La IA medirá rangos de movimiento en articulaciones clave'
  },
  {
    key: 'biobit' as keyof AnalysisCheckboxes,
    label: '2. Análisis Biobit / BTS',
    description: 'La IA evaluará activación muscular y patrones de disparo'
  },
  {
    key: 'asimetria' as keyof AnalysisCheckboxes,
    label: '3. Asimetría muscular en activación',
    description: 'La IA comparará simetrías y detectará desbalances'
  },
  {
    key: 'controlMotor' as keyof AnalysisCheckboxes,
    label: '4. Análisis de control motor activo',
    description: 'La IA analizará coordinación y respuesta neuromuscular'
  },
  {
    key: 'fatiga' as keyof AnalysisCheckboxes,
    label: '5. Análisis de fatiga muscular funcional',
    description: 'La IA medirá resistencia y índices de fatiga'
  },
  {
    key: 'fuerzaInercia' as keyof AnalysisCheckboxes,
    label: '6. Análisis de control de fuerza inercia',
    description: 'La IA analizará capacidad de generación y control de fuerza'
  }
]

/**
 * Selector de tipos de análisis con IA
 * Usado en: NuevoAnalisis.tsx
 */
function AIAnalysisSelector({
  checkboxes,
  onChange,
  onGenerateAI,
  onManualAnalysis,
  aiProcessing,
  aiProgress,
  isOnline,
  disabled = false
}: AIAnalysisSelectorProps) {
  return (
    <div className="ai-analysis-selector">
      <h4 className="selector-title">Selecciona los tipos de análisis que deseas generar con IA:</h4>
      
      <div className="checkbox-grid">
        {ANALYSIS_OPTIONS.map((option) => (
          <label key={option.key} className="ai-checkbox-item">
            <input
              type="checkbox"
              checked={checkboxes[option.key]}
              onChange={() => onChange(option.key)}
              disabled={disabled || aiProcessing}
            />
            <span className="checkbox-label">
              <IoCheckmark className="check-icon" />
              {option.label}
            </span>
            <p className="checkbox-description">{option.description}</p>
          </label>
        ))}
      </div>

      <div className="action-buttons">
        <button
          type="button"
          className="btn-generate-ai"
          onClick={onGenerateAI}
          disabled={aiProcessing || !isOnline || disabled}
        >
          {aiProcessing ? 'Analizando con IA...' : 'Generar Análisis con IA'}
          {!isOnline && ' (Sin conexión)'}
        </button>

        <button
          type="button"
          className="btn-manual-analysis"
          onClick={onManualAnalysis}
          disabled={aiProcessing || disabled}
        >
          Realizar Análisis Manual
        </button>
      </div>

      {aiProcessing && (
        <div className="ai-progress-container">
          <div className="ai-progress-bar">
            <div 
              className="ai-progress-fill" 
              style={{ width: `${aiProgress}%` }}
            />
          </div>
          <p className="ai-progress-text">
            Procesando imágenes y generando análisis... {aiProgress}%
          </p>
        </div>
      )}
    </div>
  )
}

export default AIAnalysisSelector
