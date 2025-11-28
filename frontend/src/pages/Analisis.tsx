import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoSearch, IoFitness, IoTrendingUp, IoDocument } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import AtletaSelectionModal from '../components/AtletaSelectionModal'
import AtletaAnalisisModal from '../components/AtletaAnalisisModal'
import FormularioAnalisis from '../components/FormularioAnalisis'
import '../styles/Analisis.css'

function Analisis() {
  const navigate = useNavigate()
  const [showAtletaModal, setShowAtletaModal] = useState(false)
  const [showFormulario, setShowFormulario] = useState(false)
  const [showDetallesModal, setShowDetallesModal] = useState(false)
  const [atletaSeleccionado, setAtletaSeleccionado] = useState<any>(null)
  const [busqueda, setBusqueda] = useState('')

  // Datos de ejemplo - Solo los 3 más recientes
  const atletasRecientes = [
    {
      nombre: 'Lionel Messi',
      foto: undefined,
      edad: 37,
      somatipo: 'Mesomorfo',
      altura: 170,
      peso: 67,
      posicion: 'Delantero',
      club: 'Inter Miami',
      codigoAcceso: '00000',
      capacidades: {
        velocidad: 80,
        resistencia: 85,
        fuerza: 75,
        potencia: 95,
        flexibilidad: 88
      },
      analisis: [
        { 
          id: 701, 
          fecha: '2025-11-22', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Oblicuidad de cadera',
          capacidades: { velocidad: 80, resistencia: 85, fuerza: 75, potencia: 95, flexibilidad: 88 }
        },
        { 
          id: 702, 
          fecha: '2025-10-20', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Estabilidad pélvica',
          capacidades: { velocidad: 79, resistencia: 84, fuerza: 74, potencia: 94, flexibilidad: 87 }
        },
        { 
          id: 703, 
          fecha: '2025-08-12', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Fuerza',
          capacidades: { velocidad: 78, resistencia: 83, fuerza: 73, potencia: 93, flexibilidad: 86 }
        },
        { 
          id: 704, 
          fecha: '2025-06-08', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Velocidad',
          capacidades: { velocidad: 77, resistencia: 82, fuerza: 72, potencia: 92, flexibilidad: 85 }
        },
        { 
          id: 705, 
          fecha: '2025-04-02', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Resistencia',
          capacidades: { velocidad: 76, resistencia: 81, fuerza: 71, potencia: 91, flexibilidad: 84 }
        }
      ]
    },
    {
      nombre: 'Kylian Mbappé',
      foto: undefined,
      edad: 25,
      somatipo: 'Mesomorfo',
      altura: 178,
      peso: 73,
      posicion: 'Delantero',
      club: 'Real Madrid',
      codigoAcceso: '00003',
      capacidades: {
        velocidad: 98,
        resistencia: 88,
        fuerza: 85,
        potencia: 92,
        flexibilidad: 80
      },
      analisis: [
        { 
          id: 601, 
          fecha: '2025-10-25', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Estabilidad del core',
          capacidades: { velocidad: 98, resistencia: 88, fuerza: 85, potencia: 92, flexibilidad: 80 }
        },
        { 
          id: 602, 
          fecha: '2025-10-12', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Balance de activación',
          capacidades: { velocidad: 97, resistencia: 87, fuerza: 84, potencia: 90, flexibilidad: 79 }
        },
        { 
          id: 603, 
          fecha: '2025-08-20', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Flexibilidad',
          capacidades: { velocidad: 96, resistencia: 86, fuerza: 83, potencia: 89, flexibilidad: 78 }
        },
        { 
          id: 604, 
          fecha: '2025-06-18', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Fuerza',
          capacidades: { velocidad: 95, resistencia: 85, fuerza: 82, potencia: 88, flexibilidad: 77 }
        },
        { 
          id: 605, 
          fecha: '2025-04-12', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Resistencia',
          capacidades: { velocidad: 94, resistencia: 84, fuerza: 81, potencia: 87, flexibilidad: 76 }
        }
      ]
    },
    {
      nombre: 'Neymar Jr',
      foto: undefined,
      edad: 32,
      somatipo: 'Ectomorfo',
      altura: 175,
      peso: 68,
      posicion: 'Extremo',
      club: 'Al-Hilal',
      codigoAcceso: '00002',
      capacidades: {
        velocidad: 88,
        resistencia: 80,
        fuerza: 72,
        potencia: 95,
        flexibilidad: 92
      },
      analisis: [
        { 
          id: 901, 
          fecha: '2025-10-20', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Equilibrio pierna izquierda',
          capacidades: { velocidad: 88, resistencia: 80, fuerza: 72, potencia: 95, flexibilidad: 92 }
        },
        { 
          id: 902, 
          fecha: '2025-10-15', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Debajo del Promedio' as const, 
          puntoDebil: 'Estabilidad del core',
          capacidades: { velocidad: 87, resistencia: 79, fuerza: 71, potencia: 94, flexibilidad: 91 }
        },
        { 
          id: 903, 
          fecha: '2025-08-25', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Fuerza',
          capacidades: { velocidad: 86, resistencia: 78, fuerza: 70, potencia: 93, flexibilidad: 90 }
        },
        { 
          id: 904, 
          fecha: '2025-06-20', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Debajo del Promedio' as const, 
          puntoDebil: 'Resistencia',
          capacidades: { velocidad: 85, resistencia: 77, fuerza: 69, potencia: 92, flexibilidad: 89 }
        },
        { 
          id: 905, 
          fecha: '2025-04-18', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Core',
          capacidades: { velocidad: 84, resistencia: 76, fuerza: 68, potencia: 91, flexibilidad: 88 }
        }
      ]
    }
  ]

  const handleCrearAnalisis = () => {
    navigate('/nuevo-analisis')
  }

  const handleAtletaSeleccionado = (atleta: any, _esNuevo: boolean) => {
    setAtletaSeleccionado(atleta)
    setShowAtletaModal(false)
    setShowFormulario(true)
  }

  const handleCerrarFormulario = () => {
    setShowFormulario(false)
    setAtletaSeleccionado(null)
  }

  const handleVerDetalles = (atleta: any) => {
    setAtletaSeleccionado(atleta)
    setShowDetallesModal(true)
  }

  const handleVerAnalisis = (analisisId: number) => {
    console.log('Ver análisis:', analisisId)
    // Aquí irá la lógica para ver el análisis completo
  }

  const handleDescargarAnalisis = (analisisId: number) => {
    console.log('Descargar análisis:', analisisId)
    // Aquí irá la lógica para descargar el análisis
  }

  const getBadgeClass = (clasificacion: string) => {
    if (clasificacion === 'Encima del Promedio') return 'badge-encima'
    if (clasificacion === 'Promedio') return 'badge-promedio'
    return 'badge-debajo'
  }

  const atletasFiltrados = atletasRecientes.filter(atleta =>
    atleta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    atleta.analisis.some(a => a.evaluador.toLowerCase().includes(busqueda.toLowerCase()))
  )

  if (showFormulario) {
    return (
      <FormularioAnalisis
        atleta={atletaSeleccionado}
        onClose={handleCerrarFormulario}
      />
    )
  }

  return (
    <PageTemplate
      title="Análisis Kinesiológico"
      subtitle="Gestiona y crea evaluaciones deportivas completas"
      className="analisis-page"
      showAddButton={true}
      onAddClick={handleCrearAnalisis}
      addButtonText="Crear Nuevo Análisis"
    >
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(20, 184, 166, 0.1)' }}>
            <IoDocument style={{ color: 'var(--primary-color)' }} />
          </div>
          <div className="stat-info">
            <h3>10</h3>
            <p>Análisis Totales</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.1)' }}>
            <IoTrendingUp style={{ color: '#34d399' }} />
          </div>
          <div className="stat-info">
            <h3>0</h3>
            <p>Esta Semana</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(96, 165, 250, 0.1)' }}>
            <IoFitness style={{ color: '#60a5fa' }} />
          </div>
          <div className="stat-info">
            <h3>0</h3>
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
              placeholder="Buscar atleta..."
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
                <th>Evaluador</th>
                <th>Clasificación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {atletasFiltrados.map(atleta => {
                const ultimoAnalisis = atleta.analisis[0]
                return (
                  <tr key={atleta.codigoAcceso}>
                    <td>
                      <div className="atleta-cell">
                        <div className="atleta-avatar">
                          {atleta.nombre.charAt(0)}
                        </div>
                        <span className="atleta-nombre">{atleta.nombre}</span>
                      </div>
                    </td>
                    <td>{ultimoAnalisis.evaluador}</td>
                    <td>
                      <span className={`badge ${getBadgeClass(ultimoAnalisis.clasificacion)}`}>
                        {ultimoAnalisis.clasificacion}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-icon-small" 
                          title="Ver detalles"
                          onClick={() => handleVerDetalles(atleta)}
                        >
                          👁️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        <div className="ver-todos-container">
          <button 
            className="btn-ver-todos" 
            onClick={() => navigate('/todos-analisis')}
          >
            Ver Todos
          </button>
        </div>
      </div>

      {/* Modal de selección de atleta */}
      {showAtletaModal && (
        <AtletaSelectionModal
          onClose={() => setShowAtletaModal(false)}
          onSelect={handleAtletaSeleccionado}
        />
      )}

      {/* Modal de detalles del atleta */}
      {showDetallesModal && atletaSeleccionado && (
        <AtletaAnalisisModal
          atleta={atletaSeleccionado}
          onClose={() => setShowDetallesModal(false)}
          onVerAnalisis={handleVerAnalisis}
          onDescargarAnalisis={handleDescargarAnalisis}
        />
      )}
    </PageTemplate>
  )
}

export default Analisis
