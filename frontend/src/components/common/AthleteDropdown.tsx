import { useState, useRef, useEffect } from 'react'
import { IoSearch, IoChevronDown } from 'react-icons/io5'
import '../../styles/AthleteDropdown.css'

export interface Athlete {
  id: string
  name: string
  accessCode: string
  profileImage?: string
}

interface AthleteDropdownProps {
  athletes: Athlete[]
  selectedAthlete: Athlete | null
  onSelect: (athlete: Athlete) => void
  disabled?: boolean
  required?: boolean
  loading?: boolean
}

/**
 * Dropdown con búsqueda para seleccionar atleta
 * Usado en: NuevoAnalisis.tsx, FormularioAnalisis.tsx
 */
function AthleteDropdown({
  athletes,
  selectedAthlete,
  onSelect,
  disabled = false,
  required = false,
  loading = false
}: AthleteDropdownProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.accessCode.includes(searchQuery)
  )

  const handleSelect = (athlete: Athlete) => {
    onSelect(athlete)
    setSearchQuery(`${athlete.accessCode} - ${athlete.name}`)
    setShowDropdown(false)
  }

  const displayValue = selectedAthlete 
    ? `${selectedAthlete.accessCode} - ${selectedAthlete.name}`
    : searchQuery

  return (
    <div className="athlete-dropdown-container" ref={dropdownRef}>
      <label className="dropdown-label">
        Atleta {required && <span className="required-mark">*</span>}
      </label>
      
      <div className="dropdown-input-wrapper">
        <IoSearch className="dropdown-search-icon" />
        <input
          type="text"
          className="dropdown-input"
          placeholder={loading ? "Cargando atletas..." : "Buscar por nombre o código..."}
          value={displayValue}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          disabled={disabled || loading}
          required={required}
        />
        <IoChevronDown 
          className={`dropdown-chevron ${showDropdown ? 'open' : ''}`}
          onClick={() => !disabled && !loading && setShowDropdown(!showDropdown)}
        />
      </div>

      {showDropdown && !disabled && !loading && (
        <div className="dropdown-menu">
          {filteredAthletes.length === 0 ? (
            <div className="dropdown-empty">
              {searchQuery 
                ? 'No se encontraron atletas' 
                : 'No hay atletas disponibles'}
            </div>
          ) : (
            filteredAthletes.map(athlete => (
              <div
                key={athlete.id}
                className={`dropdown-item ${selectedAthlete?.id === athlete.id ? 'selected' : ''}`}
                onClick={() => handleSelect(athlete)}
              >
                <div className="athlete-avatar">
                  {athlete.profileImage ? (
                    <img src={athlete.profileImage} alt={athlete.name} />
                  ) : (
                    athlete.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="athlete-info">
                  <span className="athlete-name">{athlete.name}</span>
                  <span className="athlete-code">{athlete.accessCode}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default AthleteDropdown
