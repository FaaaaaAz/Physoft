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
        { key: 'analisisFlexibilidad', label: '1. Flexibility Analysis', placeholder: 'Describe the flexibility analysis...' },
        { key: 'analisisBiobit', label: '2. Biobit Analysis', placeholder: 'Describe the biobit analysis...' },
        { key: 'asimetriaMuscular', label: '3. Muscular Activation Asymmetry', placeholder: 'Describe detected muscular asymmetries...' },
        { key: 'controlMotorActivo', label: '4. Active Motor Control', placeholder: 'Describe active motor control...' },
        { key: 'fatigaMuscular', label: '5. Functional Muscle Fatigue', placeholder: 'Describe functional muscle fatigue...' },
        { key: 'controlFuerzaInercia', label: '6. Inertia Force Control', placeholder: 'Describe inertia force control...' }
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
