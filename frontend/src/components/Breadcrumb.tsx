import { useNavigate } from 'react-router-dom'
import { IoChevronForward } from 'react-icons/io5'
import '../styles/Breadcrumb.css'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

function Breadcrumb({ items }: BreadcrumbProps) {
  const navigate = useNavigate()

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li key={index} className="breadcrumb-list-item">
              {!isLast && item.path ? (
                <>
                  <span 
                    className="breadcrumb-link" 
                    onClick={() => navigate(item.path!)}
                  >
                    {item.label}
                  </span>
                  <IoChevronForward className="breadcrumb-separator" />
                </>
              ) : (
                <span className="breadcrumb-current">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
