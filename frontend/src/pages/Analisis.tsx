import { useState } from 'react'
import { IoAdd, IoSearch, IoFitness, IoTrendingUp, IoDocument } from 'react-icons/io5'
import AtletaSelectionModal from '../components/AtletaSelectionModal'
import FormularioAnalisis from '../components/FormularioAnalisis'
import '../styles/Analisis.css'

function Analisis() {
  const [showAtletaModal, setShowAtletaModal] = useState(false)
  const [showFormulario, setShowFormulario] = useState(false)
  const [atletaSeleccionado, setAtletaSeleccionado] = useState<any>(null)
  const [busqueda, setBusqueda] = useState('')

  // Datos de ejemplo de análisis previos
  const analisisRecientes = [
    {
      id: 1,
      atleta: 'Lionel Messi',
      fecha: '2025-10-20',
      evaluador: 'Dr. Juan Pérez',
      clasificacion: 'Alto',
      puntoDebil: 'Oblicuidad de cadera'
    },
    {
      id: 2,
      atleta: 'Cristiano Ronaldo',
      fecha: '2025-10-18',
      evaluador: 'Dra. María González',
      clasificacion: 'Alto',
      puntoDebil: 'Balance de activación'
    },
    {
      id: 3,
      atleta: 'Neymar Jr',
      fecha: '2025-10-15',
      evaluador: 'Dr. Juan Pérez',
      clasificacion: 'Medio',
      puntoDebil: 'Equilibrio pierna izquierda'
    }
  ]

  const handleCrearAnalisis = () => {
    setShowAtletaModal(true)
  }

  const handleAtletaSeleccionado = (atleta: any, esNuevo: boolean) => {
    setAtletaSeleccionado(atleta)
    setShowAtletaModal(false)
    setShowFormulario(true)
  }

  const handleCerrarFormulario = () => {
    setShowFormulario(false)
    setAtletaSeleccionado(null)
  }

  if (showFormulario) {
    return (
      <FormularioAnalisis
        atleta={atletaSeleccionado}
        onClose={handleCerrarFormulario}
      />
    )
  }

  return (
    <div className="analisis-page">
      {/* Header con acción principal */}
      <div className="analisis-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="page-title">
              <IoFitness className="title-icon" />
              Análisis Kinesiológico
            </h1>
            <p className="page-subtitle">
              Gestiona y crea evaluaciones deportivas completas
            </p>
          </div>
          <button className="btn-primary-large" onClick={handleCrearAnalisis}>
            <IoAdd />
            Crear Nuevo Análisis
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(20, 184, 166, 0.1)' }}>
            <IoDocument style={{ color: 'var(--primary-color)' }} />
          </div>
          <div className="stat-info">
            <h3>156</h3>
            <p>Análisis Totales</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.1)' }}>
            <IoTrendingUp style={{ color: '#34d399' }} />
          </div>
          <div className="stat-info">
            <h3>23</h3>
            <p>Este Mes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(96, 165, 250, 0.1)' }}>
            <IoFitness style={{ color: '#60a5fa' }} />
          </div>
          <div className="stat-info">
            <h3>89</h3>
            <p>Atletas Evaluados</p>
          </div>
        </div>
      </div>

      {/* Análisis recientes */}
      <div className="analisis-section">
        <div className="section-header">
          <h2 className="section-title">Análisis Recientes</h2>
          <div className="search-small">
            <IoSearch className="search-icon-small" />
            <input
              type="text"
              placeholder="Buscar análisis..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input-small"
            />
          </div>
        </div>

        <div className="analisis-table-container">
          <table className="analisis-table">
            <thead>
              <tr>
                <th>Atleta</th>
                <th>Fecha</th>
                <th>Evaluador</th>
                <th>Clasificación</th>
                <th>Principal Punto Débil</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {analisisRecientes.map(analisis => (
                <tr key={analisis.id}>
                  <td>
                    <div className="atleta-cell">
                      <div className="atleta-avatar">
                        {analisis.atleta.charAt(0)}
                      </div>
                      <span className="atleta-nombre">{analisis.atleta}</span>
                    </div>
                  </td>
                  <td>{new Date(analisis.fecha).toLocaleDateString('es-ES')}</td>
                  <td>{analisis.evaluador}</td>
                  <td>
                    <span className={`badge badge-${analisis.clasificacion.toLowerCase()}`}>
                      {analisis.clasificacion}
                    </span>
                  </td>
                  <td>{analisis.puntoDebil}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon-small" title="Ver detalles">
                        👁️
                      </button>
                      <button className="btn-icon-small" title="Descargar">
                        📥
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de selección de atleta */}
      {showAtletaModal && (
        <AtletaSelectionModal
          onClose={() => setShowAtletaModal(false)}
          onSelect={handleAtletaSeleccionado}
        />
      )}
    </div>
  )
}

export default Analisis
