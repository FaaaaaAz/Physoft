import { useState, useEffect } from 'react'
import { IoSearch } from 'react-icons/io5'
import { athleteAPI } from '../../services/api'
import type { Athlete } from '../../services/api'
import './AthleteSelector.css'

interface AthleteSelectorProps {
    selectedAthlete: Athlete | null
    onSelect: (athlete: Athlete) => void
    disabled?: boolean
}

function AthleteSelector({ selectedAthlete, onSelect, disabled = false }: AthleteSelectorProps) {
    const [athletes, setAthletes] = useState<Athlete[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadAthletes()
    }, [])

    useEffect(() => {
        if (selectedAthlete) {
            setSearchQuery(`${selectedAthlete.accessCode} - ${selectedAthlete.name}`)
        }
    }, [selectedAthlete])

    const loadAthletes = async () => {
        try {
            setLoading(true)
            const response = await athleteAPI.getAll()
            setAthletes(response.data || [])

            if (response.data?.length === 0) {
                setError('No athletes in database. Create one first in the Athletes section.')
            }
        } catch (err) {
            console.error('Error loading athletes:', err)
            setError('Error loading athletes. Check that the backend is running.')
        } finally {
            setLoading(false)
        }
    }

    const filteredAthletes = athletes.filter(athlete =>
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.accessCode.includes(searchQuery)
    )

    const handleSelect = (athlete: Athlete) => {
        onSelect(athlete)
        setSearchQuery(`${athlete.accessCode} - ${athlete.name}`)
        setShowDropdown(false)
    }

    return (
        <div className="athlete-selector">
            <label htmlFor="athleteSearch">Athlete / Code *</label>
            <div className="athlete-search-wrapper">
                <input
                    type="text"
                    id="athleteSearch"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowDropdown(true)
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search by code or name"
                    required
                    disabled={disabled || loading}
                />
                <IoSearch className="search-icon" />

                {showDropdown && filteredAthletes.length > 0 && (
                    <div className="athlete-dropdown">
                        {filteredAthletes.slice(0, 5).map((athlete) => (
                            <div
                                key={athlete.id}
                                className="athlete-dropdown-item"
                                onClick={() => handleSelect(athlete)}
                            >
                                <span className="athlete-code">{athlete.accessCode}</span>
                                <span className="athlete-name">{athlete.name}</span>
                                <span className="athlete-sport">{athlete.sport}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && <p className="field-error">{error}</p>}

            <p className="field-hint">
                {selectedAthlete
                    ? `✓ Athlete: ${selectedAthlete.name} - ${selectedAthlete.sport}`
                    : 'Enter athlete code or search by name'
                }
            </p>
        </div>
    )
}

export default AthleteSelector
