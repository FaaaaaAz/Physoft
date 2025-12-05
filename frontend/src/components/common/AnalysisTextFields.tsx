import '../../styles/AnalysisTextFields.css'

export interface AnalysisCheckboxes {
  flexibilidad: boolean
  biobit: boolean
  asimetria: boolean
  controlMotor: boolean
  fatiga: boolean
  fuerzaInercia: boolean
}

interface AnalysisTextFieldsProps {
  checkboxes: AnalysisCheckboxes
  formData: {
    analisisFlexibilidad: string
    analisisBiobit: string
    asimetriaMuscular: string
    controlMotorActivo: string
    fatigaMuscular: string
    controlFuerzaInercia: string
  }
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  usedAI: boolean
  onRegenerate: () => void
  disabled?: boolean
}

const FIELDS_CONFIG = [
  {
    key: 'flexibilidad',
    name: 'analisisFlexibilidad',
    label: '1. Análisis de flexibilidad'
  },
  {
    key: 'biobit',
    name: 'analisisBiobit',
    label: '2. Análisis Biobit'
  },
  {
    key: 'asimetria',
    name: 'asimetriaMuscular',
    label: '3. Asimetría muscular en activación'
  },
  {
    key: 'controlMotor',
    name: 'controlMotorActivo',
    label: '4. Análisis de control motor activo'
  },
  {
    key: 'fatiga',
    name: 'fatigaMuscular',
    label: '5. Análisis de fatiga muscular funcional'
  },
  {
    key: 'fuerzaInercia',
    name: 'controlFuerzaInercia',
    label: '6. Análisis de control de fuerza inercia'
  }
]

/**
 * Grid de campos de texto para análisis textual
 * Usado en: NuevoAnalisis.tsx
 */
function AnalysisTextFields({
  checkboxes,
  formData,
  onChange,
  usedAI,
  onRegenerate,
  disabled = false
}: AnalysisTextFieldsProps) {
  return (
    <div className="analysis-text-fields">
      <div className="fields-grid">
        {FIELDS_CONFIG.map((field) => {
          const checkboxKey = field.key as keyof AnalysisCheckboxes
          if (!checkboxes[checkboxKey]) return null

          return (
            <div key={field.name} className="field-group">
              <label htmlFor={field.name} className="field-label">
                {field.label}
                {usedAI && <span className="ai-badge">Generado por IA</span>}
              </label>
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={onChange}
                rows={5}
                className="field-textarea"
                disabled={disabled}
                placeholder={`Ingrese ${field.label.toLowerCase()}...`}
              />
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className="btn-regenerate"
        onClick={onRegenerate}
        disabled={disabled}
      >
        {usedAI ? 'Volver a generar con IA' : 'Generar con IA'}
      </button>
    </div>
  )
}

export default AnalysisTextFields
