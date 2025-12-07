import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onNext?: () => void
  onPrevious?: () => void
  maxVisiblePages?: number
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrevious,
  maxVisiblePages = 5
}: PaginationProps) {
  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: number[] = []
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    } else {
      onPageChange(Math.max(1, currentPage - 1))
    }
  }

  const handleNext = () => {
    if (onNext) {
      onNext()
    } else {
      onPageChange(Math.min(totalPages, currentPage + 1))
    }
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <IoChevronBack />
      </button>

      <div className="pagination-info">
        {visiblePages.map(page => (
          <button
            key={page}
            className={`pagination-page ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <IoChevronForward />
      </button>
    </div>
  )
}

export default Pagination
