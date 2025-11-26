import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoSearch, IoFootball } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
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
  codigoAcceso?: string
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
    ...atletasDB.map(atleta => {
      // Calcular edad desde fecha de nacimiento
      let edad = 0
      if (atleta.fechaNacimiento) {
        const birthDate = new Date(atleta.fechaNacimiento)
        const today = new Date()
        edad = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          edad--
        }
      }

      return {
        id: 0,
        nombre: atleta.nombre,
        foto: atleta.foto || '/src/assets/players/default.png',
        deporte: atleta.disciplina,
        edad: edad,
        nacionalidad: atleta.nacionalidad || 'No especificado',
        altura: atleta.altura,
        peso: atleta.peso,
        club: atleta.club || 'Sin equipo',
        somatotipo: atleta.somatotipo,
        codigoAcceso: atleta.codigoAcceso,
        capacidades: {
          potencia: 0,
          fuerza: 0,
          velocidad: 0,
          flexibilidad: 0,
          resistencia: 0
        },
        esHardcoded: false
      }
    })
  ]

  const atletasFiltrados = todosLosAtletas.filter(atleta => {
    const coincideNombre = atleta.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideDeporte = deporteFiltro === 'Todos' || atleta.deporte === deporteFiltro
    return coincideNombre && coincideDeporte
  })

  const deportes = ['Todos', ...Array.from(new Set(todosLosAtletas.map(a => a.deporte)))]

  return (
    <PageTemplate
      title="Dashboard"
      subtitle="Gestiona tus atletas y análisis kinesiológicos"
      className="dashboard"
    >
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

          <button 
            className="btn-add-atleta"
            onClick={() => navigate('/agregar-atleta')}
            title="Agregar Atleta"
          >
            <IoFootball />
            Agregar Atleta
          </button>
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

      <AtletaModal
        atleta={atletaSeleccionado}
        onClose={() => setAtletaSeleccionado(null)}
      />
    </PageTemplate>
  )
}export default Dashboard
