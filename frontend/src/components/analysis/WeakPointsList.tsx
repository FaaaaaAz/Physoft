import { IoAdd, IoTrash } from 'react-icons/io5'

interface PuntoDebil {
    id: number
    area: string
    descripcion: string
}

interface WeakPointsListProps {
    puntosDebiles: PuntoDebil[]
    onAdd: () => void
    onRemove: (id: number) => void
    onChange: (id: number, field: 'area' | 'descripcion', value: string) => void
}

export function WeakPointsList({ puntosDebiles, onAdd, onRemove, onChange }: WeakPointsListProps) {
    return (
        <div className="subsection">
            <div className="subsection-header">
                <h4>Weak Points</h4>
                <button
                    type="button"
                    className="btn-agregar-punto"
                    onClick={onAdd}
                >
                    <IoAdd /> Add weak point
                </button>
            </div>

            {puntosDebiles.length === 0 ? (
                <p className="empty-message">
                    The AI will identify weak points automatically. You can also add them manually.
                </p>
            ) : (
                <div className="puntos-debiles-lista">
                    {puntosDebiles.map((punto, index) => (
                        <div key={punto.id} className="punto-debil-item">
                            <span className="punto-numero">Weak point {index + 1}</span>
                            <div className="punto-debil-fields">
                                <input
                                    type="text"
                                    value={punto.area}
                                    onChange={(e) => onChange(punto.id, 'area', e.target.value)}
                                    placeholder="Problem area (e.g., Muscle fatigue)"
                                    className="punto-debil-input area"
                                />
                                <input
                                    type="text"
                                    value={punto.descripcion}
                                    onChange={(e) => onChange(punto.id, 'descripcion', e.target.value)}
                                    placeholder="Description (optional)"
                                    className="punto-debil-input descripcion"
                                />
                            </div>
                            <button
                                type="button"
                                className="btn-eliminar-punto"
                                onClick={() => onRemove(punto.id)}
                            >
                                <IoTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
