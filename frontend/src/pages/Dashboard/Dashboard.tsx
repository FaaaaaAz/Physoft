import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoFootball } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import AthleteCard from '../../components/athlete/AthleteCard'
import AthleteModal from '../../components/athlete/AthleteModal'
import { SearchBar } from '@/components/common/data-display/SearchBar'
import LoadingSpinner from '@/components/common/feedback/LoadingSpinner'
import EmptyState from '@/components/common/feedback/EmptyState'
import { useDebounce } from '../../hooks'
import { calculateAge } from '../../utils/date.utils'
import { getPhotoUrl, Analysis, Athlete } from '../../services/api'
import { useAthleteStore } from '@/store/athleteStore'
import { useAnalysisStore } from '@/store/analysisStore'
import { ROUTES, MESSAGES } from '../../constants'
import type { AthleteDisplay } from '../../types/athlete.types'
import './Dashboard.css'

function Dashboard() {
    const navigate = useNavigate()
    const { athletes, loading, fetchAthletes, deleteAthlete } = useAthleteStore()
    const { analyses: allAnalyses, fetchAnalyses } = useAnalysisStore()

    // Local state
    const [searchTerm, setSearchTerm] = useState('')
    const [sportFilter, setSportFilter] = useState('All')
    const [selectedAthlete, setSelectedAthlete] = useState<AthleteDisplay | null>(null)
    const [athleteAnalyses, setAthleteAnalyses] = useState<Record<string, Analysis[]>>({})
    const [error, setError] = useState('')

    // Debounce search for better performance
    const debouncedSearch = useDebounce(searchTerm, 300)

    // Fetch athletes and analyses on mount ONLY if store is empty
    useEffect(() => {
        const loadData = async () => {
            try {
                // Only fetch if stores are empty
                if (athletes.length === 0) {
                    await fetchAthletes()
                }
                if (allAnalyses.length === 0) {
                    await fetchAnalyses()
                }
            } catch (err) {
                console.error('Error loading data:', err)
                setError('Error loading data')
            }
        }

        loadData()
    }, []) // Only run once on mount

    // Map analyses to athletes
    useEffect(() => {
        if (athletes.length === 0 || allAnalyses.length === 0) return

        const analysesMap: Record<string, Analysis[]> = {}
        athletes.forEach((athlete: Athlete) => {
            const athleteAnalysesList = allAnalyses.filter((a: Analysis) => a.athleteId === athlete.id)
            analysesMap[athlete.id] = athleteAnalysesList.sort((a: Analysis, b: Analysis) =>
                new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime()
            )
        })

        setAthleteAnalyses(analysesMap)
    }, [athletes, allAnalyses])

    // Transform athletes for display - memoized to avoid recalculation
    const athletesDisplay = useMemo((): AthleteDisplay[] => {
        return athletes.map((athlete: Athlete) => {
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
            title="Patient Management"
            subtitle="Manage your patients and musculoskeletal assessments"
            className="dashboard"
        >
            {/* Filters */}
            <div className="dashboard-filters">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search patients by name..."
                />

                <select
                    value={sportFilter}
                    onChange={(e) => setSportFilter(e.target.value)}
                    className="filter-select"
                >
                    {sports.map(sport => (
                        <option key={sport} value={sport}>{sport === 'All' ? 'All' : sport}</option>
                    ))}
                </select>

                <button
                    className="btn-add-athlete"
                    onClick={() => navigate(ROUTES.ADD_ATHLETE)}
                    title="Add Patient"
                >
                    <IoFootball />
                    Add Patient
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
                <LoadingSpinner message="Loading patients..." />
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
                    title="No Patients Found"
                    message="Try different search criteria or add a new patient"
                    action={{
                        label: "Add Patient",
                        onClick: () => navigate(ROUTES.ADD_ATHLETE)
                    }}
                />
            )}

            {/* Athlete Modal */}
            <AthleteModal
                athlete={selectedAthlete}
                onClose={() => setSelectedAthlete(null)}
                onDelete={handleDeleteAthlete}
                onViewDetails={(id) => navigate(`/athlete-detail/${id}`)}
                onEdit={(id) => navigate(`/athletes/edit/${id}`)}
            />
        </PageTemplate>
    )
}

export default Dashboard
