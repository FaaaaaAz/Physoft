import type { PhysicalCapacities } from '../../types/analysis.types'
import './PhysicalCapacitiesSliders.css'

interface PhysicalCapacitiesSlidersProps {
    capacities: PhysicalCapacities
    onChange: (capacity: keyof PhysicalCapacities, value: number) => void
    disabled?: boolean
    isOnline?: boolean
}

function PhysicalCapacitiesSliders({
    capacities,
    onChange,
    disabled = false,
    isOnline = true
}: PhysicalCapacitiesSlidersProps) {
    const capacityLabels: Record<keyof PhysicalCapacities, string> = {
        power: 'Potencia',
        endurance: 'Resistencia',
        strength: 'Fuerza',
        flexibility: 'Flexibilidad',
        speed: 'Velocidad'
    }

    return (
        <div className="physical-capacities-sliders">
            <h4>Capacidades Físicas</h4>
            <p className="subsection-description">
                La IA evaluará estos valores basándose en el análisis. Puedes ajustarlos manualmente.
            </p>

            {!isOnline && (
                <div className="offline-warning">
                    ⚠️ Análisis de capacidades físicas con IA no disponible sin conexión
                </div>
            )}

            <div className="capacities-grid">
                {(Object.keys(capacityLabels) as Array<keyof PhysicalCapacities>).map((key) => (
                    <div key={key} className="capacity-item">
                        <label htmlFor={key}>{capacityLabels[key]}</label>
                        <div className="capacity-input-group">
                            <input
                                type="range"
                                id={key}
                                min="0"
                                max="100"
                                value={capacities[key]}
                                onChange={(e) => onChange(key, Number(e.target.value))}
                                className="capacity-slider"
                                disabled={disabled}
                            />
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={capacities[key]}
                                onChange={(e) => onChange(key, Number(e.target.value))}
                                className="capacity-number"
                                disabled={disabled}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PhysicalCapacitiesSliders
