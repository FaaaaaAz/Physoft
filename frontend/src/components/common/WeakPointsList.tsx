import { IoAdd, IoTrash } from 'react-icons/io5'
import '../../styles/WeakPointsList.css'

export interface WeakPoint {
  id: number
  texto: string
}

interface WeakPointsListProps {
  weakPoints: WeakPoint[]
  onAdd: () => void
  onChange: (id: number, value: string) => void
  onDelete: (id: number) => void
  disabled?: boolean
  emptyMessage?: string
}

/**
 * Componente reutilizable para gestionar lista de puntos débiles
 * Usado en: NuevoAnalisis.tsx, FormularioAnalisis.tsx
 */
function WeakPointsList({ 
  weakPoints, 
  onAdd, 
  onChange, 
  onDelete, 
  disabled = false,
  emptyMessage = 'No hay puntos débiles agregados. Haz clic en "Agregar" para añadir uno.'
}: WeakPointsListProps) {
  return (
    <div className="weak-points-container">
      <div className="weak-points-header">
        <h4>Puntos débiles</h4>
        <button
          type="button"
          className="btn-add-weak-point"
          onClick={onAdd}
          disabled={disabled}
        >
          <IoAdd /> Agregar punto débil
        </button>
      </div>
      
      {weakPoints.length === 0 ? (
        <p className="empty-message">{emptyMessage}</p>
      ) : (
        <div className="weak-points-list">
          {weakPoints.map((point, index) => (
            <div key={point.id} className="weak-point-item">
              <span className="weak-point-number">Punto débil {index + 1}</span>
              <input
                type="text"
                value={point.texto}
                onChange={(e) => onChange(point.id, e.target.value)}
                placeholder="Describa el punto débil..."
                className="weak-point-input"
                disabled={disabled}
              />
              <button
                type="button"
                className="btn-delete-weak-point"
                onClick={() => onDelete(point.id)}
                disabled={disabled}
                aria-label="Eliminar punto débil"
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
