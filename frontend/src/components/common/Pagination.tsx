import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import './Pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
  showInfo?: boolean
  totalItems?: number
  itemsPerPage?: number
}

/**
 * Componente de paginación reutilizable
 * Usado en: TodosAnalisis.tsx, Dashboard (si se implementa)
 */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showInfo = true,
  totalItems = 0,
  itemsPerPage = 10
}: PaginationProps) {
  const generatePageNumbers = (): (number | string)[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | string)[] = []
    const halfVisible = Math.floor(maxVisiblePages / 2)
    
    // Siempre mostrar primera página
    pages.push(1)
    
    let start = Math.max(2, currentPage - halfVisible)
    let end = Math.min(totalPages - 1, currentPage + halfVisible)
    
    // Ajustar si estamos cerca del inicio
    if (currentPage <= halfVisible + 1) {
      end = Math.min(maxVisiblePages - 1, totalPages - 1)
    }
    
    // Ajustar si estamos cerca del final
    if (currentPage >= totalPages - halfVisible) {
      start = Math.max(2, totalPages - maxVisiblePages + 2)
    }
    
    // Agregar '...' si hay salto
    if (start > 2) {
      pages.push('...')
    }
    
    // Agregar páginas del medio
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Agregar '...' si hay salto
    if (end < totalPages - 1) {
      pages.push('...')
    }
    
    // Siempre mostrar última página
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages
  }

  const pageNumbers = generatePageNumbers()
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  return (
    <div className="pagination-container">
      <div className="pagination">
        <button 
          className="pagination-btn"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <IoChevronBack />
        </button>
        
        <div className="pagination-info">
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
            ) : (
              <button
                key={page}
                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button 
          className="pagination-btn"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          <IoChevronForward />
        </button>
      </div>

      {showInfo && totalItems > 0 && (
        <div className="results-info">
          Mostrando {startIndex + 1}-{endIndex} de {totalItems}
        </div>
      )}
    </div>
  )
}

export default Pagination
