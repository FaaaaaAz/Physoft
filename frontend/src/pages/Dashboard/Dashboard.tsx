import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoFootball } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import AthleteCard from '../../components/athlete/AthleteCard'
import AthleteModal from '../../components/athlete/AthleteModal'
import { SearchBar } from '@/components/common/data-display/SearchBar'
import LoadingSpinner from '@/components/common/feedback/LoadingSpinner'
import EmptyState from '@/components/common/feedback/EmptyState'
import { useAthletes, useDebounce } from '../../hooks'
import { calculateAge } from '../../utils/date.utils'
import { getPhotoUrl, analysisAPI, Analysis } from '../../services/api'
import { ROUTES, MESSAGES } from '../../constants'
import type { AthleteDisplay } from '../../types/athlete.types'
import './Dashboard.css'

function Dashboard() {
    const navigate = useNavigate()
    const { athletes, loading, error, deleteAthlete } = useAthletes()

    // Local state
    const [searchTerm, setSearchTerm] = useState('')
    const [sportFilter, setSportFilter] = useState('All')
    const [selectedAthlete, setSelectedAthlete] = useState<AthleteDisplay | null>(null)
    const [athleteAnalyses, setAthleteAnalyses] = useState<Record<string, Analysis[]>>({})
    const [loadingAnalyses, setLoadingAnalyses] = useState(false)

    // Debounce search for better performance
    const debouncedSearch = useDebounce(searchTerm, 300)

    // Load all analyses for all athletes
    useEffect(() => {
        const loadAnalyses = async () => {
            if (athletes.length === 0) return
            
            try {
                setLoadingAnalyses(true)
                const analysesPromises = athletes.map(athlete => 
                    analysisAPI.getAll({ athleteId: athlete.id })
                )
                const analysesResponses = await Promise.all(analysesPromises)
                
                const analysesMap: Record<string, Analysis[]> = {}
                athletes.forEach((athlete, index) => {
                    const athleteAnalysesList = analysesResponses[index].data
                    // Sort by date descending to get latest first
                    analysesMap[athlete.id] = athleteAnalysesList.sort((a, b) => 
                        new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime()
                    )
                })
                
                setAthleteAnalyses(analysesMap)
            } catch (err) {
                console.error('Error loading analyses:', err)
            } finally {
                setLoadingAnalyses(false)
            }
        }

        loadAnalyses()
    }, [athletes])

    // Transform athletes for display - memoized to avoid recalculation
    const athletesDisplay = useMemo((): AthleteDisplay[] => {
        return athletes.map(athlete => {
            // Get latest analysis for this athlete
            const latestAnalysis = athleteAnalyses[athlete.id]?.[0]
            
            return {
                id: athlete.id,
                name: athlete.name,
                photo: getPhotoUrl(athlete.photo),
                sport: athlete.sport,
                age: calculateAge(athlete.birthDate),
                nationality: athlete.nationality || 'Not specified',
                height: athlete.height,
                weight: athlete.weight,
                club: athlete.club || athlete.position || 'No team',
                bodyType: athlete.bodyType,
                accessCode: athlete.accessCode,
                capacities: {
                    power: latestAnalysis?.power || 0,
                    strength: latestAnalysis?.strength || 0,
                    speed: latestAnalysis?.speed || 0,
                    flexibility: latestAnalysis?.flexibility || 0,
                    endurance: latestAnalysis?.endurance || 0
                }
            }
        })
    }, [athletes, athleteAnalyses])

    // Filter athletes - memoized
    const filteredAthletes = useMemo(() => {
        return athletesDisplay.filter(athlete => {
            const matchesName = athlete.name.toLowerCase().includes(debouncedSearch.toLowerCase())
            const matchesSport = sportFilter === 'All' || athlete.sport === sportFilter
            return matchesName && matchesSport
        })
    }, [athletesDisplay, debouncedSearch, sportFilter])

    // Get unique sports - memoized
    const sports = useMemo(() => {
        return ['All', ...Array.from(new Set(athletesDisplay.map(a => a.sport)))]
    }, [athletesDisplay])

    // Handle athlete selection
    const handleAthleteClick = useCallback((athlete: AthleteDisplay) => {
        setSelectedAthlete(athlete)
    }, [])

    // Handle athlete deletion
    const handleDeleteAthlete = useCallback(async (id: string) => {
        if (!window.confirm(MESSAGES.CONFIRM.DELETE_ATHLETE)) {
            return
        }

        try {
            await deleteAthlete(id)
            setSelectedAthlete(null)
        } catch (err) {
            console.error('Error deleting athlete:', err)
            alert(MESSAGES.ERROR.DELETING_ATHLETE)
        }
    }, [deleteAthlete])

    return (
        <PageTemplate
            title="Dashboard"
            subtitle="Gestiona tus atletas y análisis kinesiológicos"
            className="dashboard"
        >
            {/* Filters */}
            <div className="dashboard-filters">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar atleta por nombre..."
                />

                <select
                    value={sportFilter}
                    onChange={(e) => setSportFilter(e.target.value)}
                    className="filter-select"
                >
                    {sports.map(sport => (
                        <option key={sport} value={sport}>{sport === 'All' ? 'Todos' : sport}</option>
                    ))}
                </select>

                <button
                    className="btn-add-athlete"
                    onClick={() => navigate(ROUTES.ADD_ATHLETE)}
                    title="Agregar Atleta"
                >
                    <IoFootball />
                    Agregar Atleta
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <LoadingSpinner message="Cargando atletas..." />
            ) : filteredAthletes.length > 0 ? (
                <div className="athletes-grid">
                    {filteredAthletes.map((athlete) => (
                        <AthleteCard
                            key={athlete.id}
                            athlete={athlete}
                            onClick={() => handleAthleteClick(athlete)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<IoFootball />}
                    title="No se encontraron atletas"
                    message="Intenta con diferentes criterios de búsqueda o agrega uno nuevo"
                    action={{
                        label: "Agregar Atleta",
                        onClick: () => navigate(ROUTES.ADD_ATHLETE)
                    }}
                />
            )}

            {/* Athlete Modal */}
            <AthleteModal
                athlete={selectedAthlete}
                onClose={() => setSelectedAthlete(null)}
                onDelete={handleDeleteAthlete}
            />
        </PageTemplate>
    )
}

export default Dashboard
