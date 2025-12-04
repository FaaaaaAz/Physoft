import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoSearch, IoChevronDown, IoChevronUp, IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import { athleteAPI, analysisAPI, type Athlete, type Analysis } from '../services/api'
import '../styles/TodosAnalisis.css'

type SortField = 'atleta' | 'evaluador' | 'clasificacion' | 'fecha'
type SortDirection = 'asc' | 'desc'

interface AtletaConAnalisis {
  athlete: Athlete
  latestAnalysis: Analysis
}

function TodosAnalisis() {
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [debouncedBusqueda, setDebouncedBusqueda] = useState('')
  const [filtroEvaluador, setFiltroEvaluador] = useState('')
  const [filtroClasificacion, setFiltroClasificacion] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [sortField, setSortField] = useState<SortField>('atleta')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Data state
  const [atletasConAnalisis, setAtletasConAnalisis] = useState<AtletaConAnalisis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // Scroll to top cuando el componente se monta
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // Fetch all athletes and analyses
      const [athletesResponse, analysesResponse] = await Promise.all([
        athleteAPI.getAll(),
        analysisAPI.getAll()
      ])

      // Group analyses by athlete and get the latest one
      const athleteAnalysisMap = new Map<string, Analysis>()
      
      analysesResponse.data.forEach((analysis) => {
        const existingAnalysis = athleteAnalysisMap.get(analysis.athleteId)
        if (!existingAnalysis || new Date(analysis.evaluationDate) > new Date(existingAnalysis.evaluationDate)) {
          athleteAnalysisMap.set(analysis.athleteId, analysis)
        }
      })

      // Create combined data structure
      const combined: AtletaConAnalisis[] = athletesResponse.data
        .filter(athlete => athleteAnalysisMap.has(athlete.id))
        .map(athlete => ({
          athlete,
          latestAnalysis: athleteAnalysisMap.get(athlete.id)!
        }))

      setAtletasConAnalisis(combined)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Error al cargar los datos. Por favor, intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce para el buscador
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBusqueda(busqueda)
      setCurrentPage(1) // Reset a primera página al buscar
    }, 300)
    return () => clearTimeout(timer)
  }, [busqueda])

  // Función de ordenamiento
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Aplicar filtros y ordenamiento
  const atletasFiltrados = useMemo(() => {
    let resultado = [...atletasConAnalisis]

    // Filtro de búsqueda
    if (debouncedBusqueda) {
      resultado = resultado.filter(item =>
        item.athlete.name.toLowerCase().includes(debouncedBusqueda.toLowerCase())
      )
    }

    // Filtro por clasificación
    if (filtroClasificacion) {
      resultado = resultado.filter(item =>
        item.latestAnalysis.globalClassification === filtroClasificacion
      )
    }

    // Filtro por fecha (mes/año)
    if (filtroFecha) {
      resultado = resultado.filter(item => {
        const fecha = new Date(item.latestAnalysis.evaluationDate)
        const fechaStr = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
        return fechaStr === filtroFecha
      })
    }

    // Ordenamiento
    resultado.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'atleta':
          comparison = a.athlete.name.localeCompare(b.athlete.name)
          break
        case 'clasificacion':
          const orden: Record<string, number> = { 'high': 3, 'medium': 2, 'low': 1 }
          const aVal = orden[a.latestAnalysis.globalClassification || 'medium']
          const bVal = orden[b.latestAnalysis.globalClassification || 'medium']
          comparison = aVal - bVal
          break
        case 'fecha':
          comparison = new Date(b.latestAnalysis.evaluationDate).getTime() - new Date(a.latestAnalysis.evaluationDate).getTime()
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return resultado
  }, [atletasConAnalisis, debouncedBusqueda, filtroClasificacion, filtroFecha, sortField, sortDirection])

  // Paginación
  const totalPages = Math.ceil(atletasFiltrados.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const atletasPaginados = atletasFiltrados.slice(startIndex, endIndex)

  // Reset página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [filtroEvaluador, filtroClasificacion, filtroFecha])

  const handleVerDetalles = (item: AtletaConAnalisis) => {
    navigate(`/athlete-detail/${item.athlete.id}`, { state: { from: 'all-analysis' } })
  }

  const limpiarFiltros = () => {
    setFiltroEvaluador('')
    setFiltroClasificacion('')
    setFiltroFecha('')
    setBusqueda('')
  }

  const getBadgeClass = (clasificacion: string | null | undefined) => {
    if (clasificacion === 'high') return 'badge-encima'
    if (clasificacion === 'medium') return 'badge-promedio'
    return 'badge-debajo'
  }

  const getClassificationLabel = (clasificacion: string | null | undefined) => {
    if (clasificacion === 'high') return 'Encima del Promedio'
    if (clasificacion === 'medium') return 'Promedio'
    if (clasificacion === 'low') return 'Debajo del Promedio'
    return 'Sin clasificar'
  }

  return (
    <PageTemplate
      title="Todos los Análisis"
      className="todos-analisis-page"
      showBackButton={true}
      backTo="/analysis"
    >
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-item" onClick={() => navigate('/analysis')}>Ánalisis</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item active">Todos los Análisis</span>
      </div>

      {/* Buscador y Filtros */}
      <div className="todos-analisis-header">
        <div className="search-container">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por atleta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <select 
            className="filter-select"
            value={filtroClasificacion}
            onChange={(e) => setFiltroClasificacion(e.target.value)}
          >
            <option value="">Todas las clasificaciones</option>
            <option value="high">Encima del Promedio</option>
            <option value="medium">Promedio</option>
            <option value="low">Debajo del Promedio</option>
          </select>

          {(filtroClasificacion || filtroFecha || busqueda) && (
            <button className="btn-clear-filters" onClick={limpiarFiltros}>
              <IoClose /> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla de análisis */}
      <div className="todos-analisis-content">
        {isLoading ? (
          <div className="loading-state">Cargando análisis...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <>
            <div className="analisis-table-container">
              <table className="analisis-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort('atleta')}>
                      <div className="th-content">
                        Atleta
                        {sortField === 'atleta' && (
                          sortDirection === 'asc' ? <IoChevronUp /> : <IoChevronDown />
                        )}
                      </div>
                    </th>
                    <th className="sortable" onClick={() => handleSort('clasificacion')}>
                      <div className="th-content">
                        Clasificación
                        {sortField === 'clasificacion' && (
                          sortDirection === 'asc' ? <IoChevronUp /> : <IoChevronDown />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {atletasPaginados.length > 0 ? (
                    atletasPaginados.map(item => (
                      <tr 
                        key={item.athlete.id}
                        className="clickable-row"
                        onClick={() => handleVerDetalles(item)}
                      >
                        <td>
                          <div className="atleta-cell">
                            <div className="atleta-avatar">
                              {item.athlete.name.charAt(0)}
                            </div>
                            <span className="atleta-nombre">{item.athlete.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getBadgeClass(item.latestAnalysis.globalClassification)}`}>
                            {getClassificationLabel(item.latestAnalysis.globalClassification)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="no-results">
                        No se encontraron atletas que coincidan con los filtros
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <IoChevronBack />
                </button>
                
                <div className="pagination-info">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button 
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <IoChevronForward />
                </button>
              </div>
            )}

            <div className="results-info">
              Mostrando {startIndex + 1}-{Math.min(endIndex, atletasFiltrados.length)} de {atletasFiltrados.length} atletas
            </div>
          </>
        )}
      </div>
    </PageTemplate>
  )
}

export default TodosAnalisis
