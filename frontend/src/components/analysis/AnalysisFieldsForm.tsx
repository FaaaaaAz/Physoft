interface AnalysisFieldsFormProps {
    formData: {
        analisisFlexibilidad: string
        analisisBiobit: string
        asimetriaMuscular: string
        controlMotorActivo: string
        fatigaMuscular: string
        controlFuerzaInercia: string
    }
    onChange: (field: string, value: string) => void
}

export function AnalysisFieldsForm({ formData, onChange }: AnalysisFieldsFormProps) {
    const fields = [
        { key: 'analisisFlexibilidad', label: '1. Análisis de flexibilidad', placeholder: 'Describe el análisis de flexibilidad...' },
        { key: 'analisisBiobit', label: '2. Análisis Biobit', placeholder: 'Describe el análisis biobit...' },
        { key: 'asimetriaMuscular', label: '3. Asimetría muscular en activación', placeholder: 'Describe las asimetrías musculares detectadas...' },
        { key: 'controlMotorActivo', label: '4. Control motor activo', placeholder: 'Describe el control motor activo...' },
        { key: 'fatigaMuscular', label: '5. Fatiga muscular funcional', placeholder: 'Describe la fatiga muscular funcional...' },
        { key: 'controlFuerzaInercia', label: '6. Control de fuerza de inercia', placeholder: 'Describe el control de fuerza de inercia...' }
    ]

    return (
        <div className="analisis-textual-grid">
            {fields.map(({ key, label, placeholder }) => (
                <div key={key} className="form-group">
                    <label htmlFor={key}>{label}</label>
                    <textarea
                        id={key}
                        value={formData[key as keyof typeof formData]}
                        onChange={(e) => onChange(key, e.target.value)}
                        placeholder={placeholder}
                        rows={8}
                    />
                </div>
            ))}
        </div>
    )
}
