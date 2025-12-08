import { IoAdd, IoTrash } from 'react-icons/io5'
import type { WeakPoint } from '../../types/analysis.types'
import './WeakPointsList.css'

interface WeakPointsListProps {
    weakPoints: WeakPoint[]
    onAdd: () => void
    onRemove: (id: number) => void
    onChange: (id: number, text: string) => void
    disabled?: boolean
}

function WeakPointsList({
    weakPoints,
    onAdd,
    onRemove,
    onChange,
    disabled = false
}: WeakPointsListProps) {
    return (
        <div className="weak-points-list">
            <div className="subsection-header">
                <h4>Puntos Débiles</h4>
                <button
                    type="button"
                    className="btn-add-point"
                    onClick={onAdd}
                    disabled={disabled}
                >
                    <IoAdd /> Agregar punto débil
                </button>
            </div>

            {weakPoints.length === 0 ? (
                <p className="empty-message">
                    La IA identificará puntos débiles automáticamente. También puedes agregarlos manualmente.
                </p>
            ) : (
                <div className="weak-points-items">
                    {weakPoints.map((point, index) => (
                        <div key={point.id} className="weak-point-item">
                            <span className="point-number">Punto débil {index + 1}</span>
                            <input
                                type="text"
                                value={point.text}
                                onChange={(e) => onChange(point.id, e.target.value)}
                                placeholder="Describe el punto débil..."
                                className="weak-point-input"
                                disabled={disabled}
                            />
                            <button
                                type="button"
                                className="btn-remove-point"
                                onClick={() => onRemove(point.id)}
                                disabled={disabled}
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

export default WeakPointsList
