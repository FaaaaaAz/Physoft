import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoSearch, IoFootball } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import AtletaCard from '../components/AtletaCard'
import AtletaModal from '../components/AtletaModal'
import { athleteAPI, type Athlete, getPhotoUrl } from '../services/api'
import '../styles/Dashboard.css'

// Type for athlete displayed in dashboard
interface AtletaMostrado {
  id: string
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
}

function Dashboard() {
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [deporteFiltro, setDeporteFiltro] = useState('Todos')
  const [atletaSeleccionado, setAtletaSeleccionado] = useState<AtletaMostrado | null>(null)
  const [atletasDB, setAtletasDB] = useState<Athlete[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch athletes from backend
  const cargarAtletas = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const response = await athleteAPI.getAll()
      if (response.success && response.data) {
        setAtletasDB(response.data)
      }
    } catch (err) {
      console.error('Error loading athletes:', err)
      setError('No se pudieron cargar los atletas del servidor')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarAtletas()
  }, [cargarAtletas])

  // Transform athletes for display - memoized to avoid recalculation
  const atletasMostrados = useMemo((): AtletaMostrado[] => {
    return atletasDB.map(atleta => {
      // Calculate age from birthDate if available
      let edad = 0
      if (atleta.birthDate) {
        const birthDate = new Date(atleta.birthDate)
        const today = new Date()
        edad = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          edad--
        }
      }

      return {
        id: atleta.id,
        nombre: atleta.name,
        foto: getPhotoUrl(atleta.photo),
        deporte: atleta.sport,
        edad: edad,
        nacionalidad: atleta.nationality || 'No especificado',
        altura: atleta.height,
        peso: atleta.weight,
        club: atleta.club || atleta.position || 'Sin equipo',
        somatotipo: atleta.bodyType,
        codigoAcceso: atleta.accessCode,
        capacidades: {
          // Default values - will be populated from analyses in the future
          potencia: 75,
          fuerza: 75,
          velocidad: 75,
          flexibilidad: 75,
          resistencia: 75
        }
      }
    })
  }, [atletasDB])

  // Filter athletes - memoized to avoid recalculation
  const atletasFiltrados = useMemo(() => {
    return atletasMostrados.filter(atleta => {
      const coincideNombre = atleta.nombre.toLowerCase().includes(busqueda.toLowerCase())
      const coincideDeporte = deporteFiltro === 'Todos' || atleta.deporte === deporteFiltro
      return coincideNombre && coincideDeporte
    })
  }, [atletasMostrados, busqueda, deporteFiltro])

  // Get unique sports - memoized
  const deportes = useMemo(() => {
    return ['Todos', ...Array.from(new Set(atletasMostrados.map(a => a.deporte)))]
  }, [atletasMostrados])

  // Handle athlete selection
  const handleAtletaClick = useCallback(async (atleta: AtletaMostrado) => {
    try {
      // Fetch full athlete details including analyses
      const response = await athleteAPI.getById(atleta.id)
      if (response.success && response.data) {
        // Transform to display format
        setAtletaSeleccionado(atleta)
      }
    } catch (err) {
      console.error('Error fetching athlete details:', err)
      // Still show modal with cached data
      setAtletaSeleccionado(atleta)
    }
  }, [])

  // Handle athlete deletion
  const handleDeleteAtleta = useCallback(async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este atleta?')) {
      return
    }

    try {
      await athleteAPI.delete(id)
      // Reload athletes
      await cargarAtletas()
      setAtletaSeleccionado(null)
    } catch (err) {
      console.error('Error deleting athlete:', err)
      alert('Error al eliminar el atleta')
    }
  }, [cargarAtletas])

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

      {error && (
        <div className="error-message" style={{ padding: '1rem', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {cargando ? (
        <div className="empty-state">
          <p>Cargando atletas...</p>
        </div>
      ) : atletasFiltrados.length > 0 ? (
        <div className="atletas-grid">
          {atletasFiltrados.map((atleta) => (
            <AtletaCard
              key={atleta.id}
              atleta={atleta}
              onClick={() => handleAtletaClick(atleta)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <IoFootball />
          <h3>No se encontraron atletas</h3>
          <p>Intenta con otros criterios de búsqueda o <button onClick={() => navigate('/agregar-atleta')} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>agrega uno nuevo</button></p>
        </div>
      )}

      <AtletaModal
        atleta={atletaSeleccionado}
        onClose={() => setAtletaSeleccionado(null)}
        onDelete={handleDeleteAtleta}
      />
    </PageTemplate>
  )
}

export default Dashboard
