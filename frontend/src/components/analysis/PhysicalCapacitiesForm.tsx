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
            <h4>Capacidades físicas</h4>
            <p className="subsection-description">
                La IA evaluará estos valores basándose en el análisis. Puede ajustarlos manualmente.
            </p>

            <div className="capacidades-grid">
                <div className="capacidad-item">
                    <label htmlFor="potencia">Potencia</label>
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
                    <label htmlFor="resistencia">Resistencia</label>
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
                    <label htmlFor="fuerza">Fuerza</label>
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
                    <label htmlFor="flexibilidad">Flexibilidad</label>
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
                    <label htmlFor="velocidad">Velocidad</label>
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
