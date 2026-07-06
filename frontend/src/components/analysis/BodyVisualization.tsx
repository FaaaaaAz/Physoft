import { useState, useRef } from 'react'
import { IoTrash, IoClose } from 'react-icons/io5'
import './BodyVisualization.css'

// Importar las imágenes
import FrontalImg from '@/assets/PersonaPhysoft/Frontal.png'
import TraseroImg from '@/assets/PersonaPhysoft/Trasero.png'
import IzquierdoImg from '@/assets/PersonaPhysoft/Izquierdo.png'
import DerechoImg from '@/assets/PersonaPhysoft/Derecho.png'

export interface BodyMark {
  id: string
  x: number // posición X en porcentaje (0-100)
  y: number // posición Y en porcentaje (0-100)
  viewType: 'front' | 'back' | 'left' | 'right'
}

interface BodyVisualizationProps {
  marks: BodyMark[]
  onChange: (marks: BodyMark[]) => void
}

const viewTypes = [
  { id: 'front', label: 'Front View', image: FrontalImg },
  { id: 'back', label: 'Back View', image: TraseroImg },
  { id: 'left', label: 'Left Side View', image: IzquierdoImg },
  { id: 'right', label: 'Right Side View', image: DerechoImg }
] as const

function BodyVisualization({ marks, onChange }: BodyVisualizationProps) {
  const [selectedViews, setSelectedViews] = useState<string[]>(['frontal'])
  const [hoveredMark, setHoveredMark] = useState<string | null>(null)
  const imageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Manejar selección de vistas
  const handleViewToggle = (viewId: string) => {
    setSelectedViews(prev => {
      if (prev.includes(viewId)) {
        // Si es la única vista seleccionada, no permitir deseleccionar
        if (prev.length === 1) return prev
        return prev.filter(v => v !== viewId)
      } else {
        return [...prev, viewId]
      }
    })
  }

  // Manejar click en la imagen para agregar marca
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>, viewType: string) => {
    const container = imageRefs.current[viewType]
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const newMark: BodyMark = {
      id: `mark-${Date.now()}-${Math.random()}`,
      x,
      y,
      viewType: viewType as BodyMark['viewType']
    }

    onChange([...marks, newMark])
  }

  // Eliminar marca específica
  const handleRemoveMark = (markId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    onChange(marks.filter(m => m.id !== markId))
  }

  // Limpiar todas las marcas de una vista
  const handleClearViewMarks = (viewType: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(marks.filter(m => m.viewType !== viewType))
  }

  // Limpiar todas las marcas
  const handleClearAllMarks = () => {
    onChange([])
  }

  return (
    <div className="body-visualization">
      <div className="body-viz-header">
        <h4>Body Visualization - Affected Areas</h4>
        <p className="body-viz-description">
          Select the required views and click on the affected body areas to mark them. You can remove individual markers by clicking on them.
        </p>
      </div>

      {/* Selector de vistas */}
      <div className="view-selector">
        <label className="view-selector-label">Views to display:</label>
        <div className="view-checkboxes">
          {viewTypes.map(view => (
            <label key={view.id} className="view-checkbox-item">
              <input
                type="checkbox"
                checked={selectedViews.includes(view.id)}
                onChange={() => handleViewToggle(view.id)}
              />
              <span>{view.label}</span>
            </label>
          ))}
        </div>

        {marks.length > 0 && (
          <button
            type="button"
            className="btn-clear-all-marks"
            onClick={handleClearAllMarks}
            title="Clear all marks"
          >
            <IoTrash /> Clear all marks ({marks.length})
          </button>
        )}
      </div>

      {/* Contenedor de imágenes */}
      <div className="body-images-container">
        {viewTypes
          .filter(view => selectedViews.includes(view.id))
          .map(view => {
            const viewMarks = marks.filter(m => m.viewType === view.id)
            
            return (
              <div key={view.id} className="body-image-wrapper">
                <div className="body-image-header">
                  <h5>{view.label}</h5>
                  {viewMarks.length > 0 && (
                    <button
                      type="button"
                      className="btn-clear-view-marks"
                      onClick={(e) => handleClearViewMarks(view.id, e)}
                      title="Clear marks for this view"
                    >
                      <IoTrash /> {viewMarks.length}
                    </button>
                  )}
                </div>

                <div
                  ref={el => imageRefs.current[view.id] = el}
                  className="body-image-container"
                  onClick={(e) => handleImageClick(e, view.id)}
                >
                  <img
                    src={view.image}
                    alt={view.label}
                    className="body-image"
                    draggable={false}
                  />

                  {/* Marcas sobre la imagen */}
                  {viewMarks.map(mark => (
                    <div
                      key={mark.id}
                      className={`body-mark ${hoveredMark === mark.id ? 'hovered' : ''}`}
                      style={{
                        left: `${mark.x}%`,
                        top: `${mark.y}%`
                      }}
                      onClick={(e) => handleRemoveMark(mark.id, e)}
                      onMouseEnter={() => setHoveredMark(mark.id)}
                      onMouseLeave={() => setHoveredMark(null)}
                      title="Clic para eliminar"
                    >
                      <div className="body-mark-circle"></div>
                      {hoveredMark === mark.id && (
                        <div className="body-mark-delete-icon">
                          <IoClose />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="body-image-instruction">
                  Click on the affected areas
                </p>
              </div>
            )
          })}
      </div>

      {marks.length === 0 && (
        <div className="no-marks-message">
          <p>No affected areas have been marked. Click on the images to mark the affected areas.</p>
        </div>
      )}
    </div>
  )
}

export default BodyVisualization
