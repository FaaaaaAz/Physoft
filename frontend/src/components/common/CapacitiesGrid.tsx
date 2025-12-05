import '../../styles/CapacitiesGrid.css'

export interface PhysicalCapacities {
  potencia: number
  resistencia: number
  fuerza: number
  flexibilidad: number
  velocidad: number
}

interface CapacitiesGridProps {
  capacities: PhysicalCapacities
  onChange: (capacity: keyof PhysicalCapacities, value: number) => void
  disabled?: boolean
  showDescription?: boolean
  isOnline?: boolean
}

const CAPACITY_LABELS: Record<keyof PhysicalCapacities, string> = {
  potencia: 'Potencia',
  resistencia: 'Resistencia',
  fuerza: 'Fuerza',
  flexibilidad: 'Flexibilidad',
  velocidad: 'Velocidad'
}

/**
 * Componente reutilizable para grid de capacidades físicas (sliders + number inputs)
 * Usado en: NuevoAnalisis.tsx, FormularioAnalisis.tsx
 */
function CapacitiesGrid({ 
  capacities, 
  onChange, 
  disabled = false,
  showDescription = true,
  isOnline = true
}: CapacitiesGridProps) {
  return (
    <div className="capacities-container">
      <h4>Capacidades físicas</h4>
      
      {showDescription && (
        <p className="capacities-description">
          La IA evaluará estos valores basándose en el análisis. Puede ajustarlos manualmente.
        </p>
      )}
      
      {!isOnline && (
        <div className="offline-warning">
          ⚠️ Análisis de Capacidades físicas con IA no disponible sin conexión
        </div>
      )}
      
      <div className="capacities-grid">
        {(Object.keys(CAPACITY_LABELS) as Array<keyof PhysicalCapacities>).map((key) => (
          <div key={key} className="capacity-item">
            <label htmlFor={key}>{CAPACITY_LABELS[key]}</label>
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

export default CapacitiesGrid
