interface CapacidadesFisicas {
    potencia: number
    resistencia: number
    fuerza: number
    flexibilidad: number
    velocidad: number
}

interface PhysicalCapacitiesFormProps {
    capacidades: CapacidadesFisicas
    onChange: (capacidad: keyof CapacidadesFisicas, value: number) => void
}

export function PhysicalCapacitiesForm({ capacidades, onChange }: PhysicalCapacitiesFormProps) {
    return (
        <div className="subsection">
            <h4>Physical Capacities</h4>
            <p className="subsection-description">
                AI will estimate these values based on the analysis. You can adjust them manually.
            </p>

            <div className="capacidades-grid">
                <div className="capacidad-item">
                    <label htmlFor="potencia">Power</label>
                    <div className="capacidad-input-group">
                        <input
                            type="range"
                            id="potencia"
                            min="0"
                            max="100"
                            value={capacidades.potencia}
                            onChange={(e) => onChange('potencia', Number(e.target.value))}
                            className="capacidad-slider"
                        />
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={capacidades.potencia}
                            onChange={(e) => onChange('potencia', Number(e.target.value))}
                            className="capacidad-number"
                        />
                    </div>
                </div>

                <div className="capacidad-item">
                    <label htmlFor="resistencia">Endurance</label>
                    <div className="capacidad-input-group">
                        <input
                            type="range"
                            id="resistencia"
                            min="0"
                            max="100"
                            value={capacidades.resistencia}
                            onChange={(e) => onChange('resistencia', Number(e.target.value))}
                            className="capacidad-slider"
                        />
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={capacidades.resistencia}
                            onChange={(e) => onChange('resistencia', Number(e.target.value))}
                            className="capacidad-number"
                        />
                    </div>
                </div>

                <div className="capacidad-item">
                    <label htmlFor="fuerza">Strength</label>
                    <div className="capacidad-input-group">
                        <input
                            type="range"
                            id="fuerza"
                            min="0"
                            max="100"
                            value={capacidades.fuerza}
                            onChange={(e) => onChange('fuerza', Number(e.target.value))}
                            className="capacidad-slider"
                        />
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={capacidades.fuerza}
                            onChange={(e) => onChange('fuerza', Number(e.target.value))}
                            className="capacidad-number"
                        />
                    </div>
                </div>

                <div className="capacidad-item">
                    <label htmlFor="flexibilidad">Flexibility</label>
                    <div className="capacidad-input-group">
                        <input
                            type="range"
                            id="flexibilidad"
                            min="0"
                            max="100"
                            value={capacidades.flexibilidad}
                            onChange={(e) => onChange('flexibilidad', Number(e.target.value))}
                            className="capacidad-slider"
                        />
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={capacidades.flexibilidad}
                            onChange={(e) => onChange('flexibilidad', Number(e.target.value))}
                            className="capacidad-number"
                        />
                    </div>
                </div>

                <div className="capacidad-item">
                    <label htmlFor="velocidad">Speed</label>
                    <div className="capacidad-input-group">
                        <input
                            type="range"
                            id="velocidad"
                            min="0"
                            max="100"
                            value={capacidades.velocidad}
                            onChange={(e) => onChange('velocidad', Number(e.target.value))}
                            className="capacidad-slider"
                        />
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={capacidades.velocidad}
                            onChange={(e) => onChange('velocidad', Number(e.target.value))}
                            className="capacidad-number"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
