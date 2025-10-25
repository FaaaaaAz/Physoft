import { useState } from 'react'
import { IoClose, IoSearch, IoPerson, IoAdd, IoCheckmark } from 'react-icons/io5'
import '../styles/AtletaSelectionModal.css'

interface AtletaSelectionModalProps {
  onClose: () => void
  onSelect: (atleta: any, esNuevo: boolean) => void
}

function AtletaSelectionModal({ onClose, onSelect }: AtletaSelectionModalProps) {
  const [paso, setPaso] = useState<'pregunta' | 'buscar' | 'nuevo'>('pregunta')
  const [busqueda, setBusqueda] = useState('')
  const [atletaSeleccionado, setAtletaSeleccionado] = useState<any>(null)

  // Atletas existentes con análisis
  const atletasExistentes = [
    { id: 1, nombre: 'Lionel Messi', club: 'Inter Miami', analisisCount: 5 },
    { id: 2, nombre: 'Cristiano Ronaldo', club: 'Al Nassr', analisisCount: 3 },
    { id: 3, nombre: 'Neymar Jr', club: 'Al Hilal', analisisCount: 2 },
    { id: 4, nombre: 'Kylian Mbappé', club: 'PSG', analisisCount: 4 },
    { id: 5, nombre: 'Erling Haaland', club: 'Manchester City', analisisCount: 6 }
  ]

  const atletasFiltrados = atletasExistentes.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleExiste = () => {
    setPaso('buscar')
  }

  const handleNoExiste = () => {
    onSelect({ nombre: '', nuevo: true }, true)
  }

  const handleSeleccionarAtleta = (atleta: any) => {
    setAtletaSeleccionado(atleta)
  }

  const handleConfirmar = () => {
    if (atletaSeleccionado) {
      onSelect(atletaSeleccionado, false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="selection-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <IoClose />
        </button>

        {/* Paso 1: Pregunta inicial */}
        {paso === 'pregunta' && (
          <div className="modal-paso">
            <div className="modal-icon-large">
              <IoPerson />
            </div>
            <h2 className="modal-title">¿El atleta ya está registrado?</h2>
            <p className="modal-description">
              Si el atleta ya tiene análisis previos, podrás ver su historial y timeline de mejoría
            </p>
            
            <div className="modal-actions-vertical">
              <button className="btn-modal-primary" onClick={handleExiste}>
                <IoCheckmark />
                Sí, buscar atleta existente
              </button>
              <button className="btn-modal-secondary" onClick={handleNoExiste}>
                <IoAdd />
                No, crear nuevo atleta
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Buscar atleta existente */}
        {paso === 'buscar' && (
          <div className="modal-paso">
            <h2 className="modal-title">Selecciona el Atleta</h2>
            <p className="modal-description">
              Busca y selecciona el atleta para ver su historial o crear un nuevo análisis
            </p>

            <div className="modal-search">
              <IoSearch className="search-icon-modal" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input-modal"
                autoFocus
              />
            </div>

            <div className="atletas-list">
              {atletasFiltrados.length > 0 ? (
                atletasFiltrados.map(atleta => (
                  <div
                    key={atleta.id}
                    className={`atleta-item ${atletaSeleccionado?.id === atleta.id ? 'selected' : ''}`}
                    onClick={() => handleSeleccionarAtleta(atleta)}
                  >
                    <div className="atleta-item-avatar">
                      {atleta.nombre.split(' ').map(n => n.charAt(0)).join('')}
                    </div>
                    <div className="atleta-item-info">
                      <h4>{atleta.nombre}</h4>
                      <p>{atleta.club}</p>
                    </div>
                    <div className="atleta-item-badge">
                      {atleta.analisisCount} análisis
                    </div>
                    {atletaSeleccionado?.id === atleta.id && (
                      <IoCheckmark className="check-icon" />
                    )}
                  </div>
                ))
              ) : (
                <div className="no-results-modal">
                  <p>No se encontraron atletas</p>
                  <button className="btn-link" onClick={handleNoExiste}>
                    Crear nuevo atleta
                  </button>
                </div>
              )}
            </div>

            <div className="modal-actions-horizontal">
              <button className="btn-modal-cancel" onClick={() => setPaso('pregunta')}>
                Volver
              </button>
              <button
                className="btn-modal-primary"
                onClick={handleConfirmar}
                disabled={!atletaSeleccionado}
              >
                Continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AtletaSelectionModal
