import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoSearch, IoSettings, IoPerson, IoFootball, IoAdd } from 'react-icons/io5'
import AtletaCard from '../components/AtletaCard'
import AtletaModal from '../components/AtletaModal'
import { db } from '../services/database'
import { atletasEjemplo } from '../data/atletasData'
import type { Atleta } from '../electron'
import '../styles/Dashboard.css'

// Tipo para el atleta mostrado en el dashboard
interface AtletaMostrado {
  id: number
  nombre: string
  foto: string
  deporte: string
  edad: number
  nacionalidad?: string
  altura?: number
  peso?: number
  club: string
  somatotipo?: string
  capacidades: {
    potencia: number
    fuerza: number
    velocidad: number
    flexibilidad: number
    resistencia: number
  }
  esHardcoded?: boolean // Para saber si viene de ejemplos
}

function Dashboard() {
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [deporteFiltro, setDeporteFiltro] = useState('Todos')
  const [atletaSeleccionado, setAtletaSeleccionado] = useState<AtletaMostrado | null>(null)
  const [atletasDB, setAtletasDB] = useState<Atleta[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarAtletas()
  }, [])

  const cargarAtletas = async () => {
    setCargando(true)
    const response = await db.obtenerAtletas()
    if (response.success && response.data) {
      setAtletasDB(response.data)
    } else {
      console.error('Error al cargar atletas:', response.error)
    }
    setCargando(false)
  }

  // Combinar atletas hardcodeados + atletas de la DB
  const todosLosAtletas: AtletaMostrado[] = [
    // Atletas hardcodeados (ejemplos)
    ...atletasEjemplo.map(a => ({ ...a, esHardcoded: true })),
    
    // Atletas de la base de datos
    ...atletasDB.map(atleta => ({
      id: 0,
      nombre: atleta.nombre,
      foto: '/src/assets/players/default.png',
      deporte: atleta.disciplina,
      edad: atleta.edad,
      nacionalidad: 'No especificado',
      altura: atleta.altura,
      peso: atleta.peso,
      club: atleta.posicion || 'Sin equipo',
      somatotipo: atleta.somatotipo,
      capacidades: {
        potencia: 75,
        fuerza: 75,
        velocidad: 75,
        flexibilidad: 75,
        resistencia: 75
      },
      esHardcoded: false
    }))
  ]

  const atletasFiltrados = todosLosAtletas.filter(atleta => {
    const coincideNombre = atleta.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideDeporte = deporteFiltro === 'Todos' || atleta.deporte === deporteFiltro
    return coincideNombre && coincideDeporte
  })

  const deportes = ['Todos', ...Array.from(new Set(todosLosAtletas.map(a => a.deporte)))]

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <a href="#" className="navbar-brand" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <img src="/src/assets/physoft.png" alt="Physoft" className="navbar-logo" />
            <span className="navbar-title">Physoft</span>
          </a>
          
          <ul className="navbar-menu">
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="navbar-link active">Inicio</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/analisis'); }} className="navbar-link">Análisis</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/agregar-atleta'); }} className="navbar-link">Agregar Atleta</a></li>
          </ul>
          
          <div className="navbar-actions">
            <button className="navbar-icon-btn" onClick={() => navigate('/agregar-atleta')}>
              <IoAdd />
            </button>
            <button className="navbar-icon-btn">
              <IoSettings />
            </button>
            <button className="navbar-icon-btn">
              <IoPerson />
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="dashboard-filters">
          <div className="search-container">
            <IoSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar atleta por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={deporteFiltro}
            onChange={(e) => setDeporteFiltro(e.target.value)}
            className="filter-select"
          >
            {deportes.map(deporte => (
              <option key={deporte} value={deporte}>{deporte}</option>
            ))}
          </select>
        </div>

        {cargando ? (
          <div className="empty-state">
            <p>Cargando atletas...</p>
          </div>
        ) : atletasFiltrados.length > 0 ? (
          <div className="atletas-grid">
            {atletasFiltrados.map((atleta, index) => (
              <AtletaCard
                key={atleta.esHardcoded ? atleta.id : `db-${index}`}
                atleta={atleta}
                onClick={() => setAtletaSeleccionado(atleta)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <IoFootball />
            <h3>No se encontraron atletas</h3>
            <p>Intenta con otros criterios de búsqueda o <button onClick={() => navigate('/agregar-atleta')} style={{textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer'}}>agrega uno nuevo</button></p>
          </div>
        )}
      </main>

      <AtletaModal
        atleta={atletaSeleccionado}
        onClose={() => setAtletaSeleccionado(null)}
      />
    </div>
  )
}

export default Dashboard
