import { IoSearch } from 'react-icons/io5'
import './SearchBar.css'
import '@/styles/SearchBar.css'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/**
 * Barra de búsqueda reutilizable
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = ''
}: SearchBarProps) {
  return (
    <div className={`search-container ${className}`}>
      <IoSearch className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  )
}
