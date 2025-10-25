import { useState } from 'react'
import { IoFootball } from 'react-icons/io5'
import '../styles/Welcome.css'

interface WelcomeProps {
  onEnter: () => void
}

function Welcome({ onEnter }: WelcomeProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleEnter = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onEnter()
    }, 600)
  }

  return (
    <div className={`welcome-container ${isAnimating ? 'fade-out' : ''}`}>
      <div className="welcome-content">
        <div className="logo-container">
          <img 
            src="/src/assets/physoft.png" 
            alt="Physoft Logo" 
            className="welcome-logo"
          />
        </div>
        
        <h1 className="welcome-title">Physoft</h1>
        <p className="welcome-subtitle">Plataforma de Análisis Deportivo</p>
        
        <div className="welcome-description">
          <p>Sistema avanzado de análisis musculoesquelético</p>
          <p>para atletas de alto rendimiento</p>
        </div>

        <button className="welcome-button" onClick={handleEnter}>
          <span>Ingresar a la Plataforma</span>
          <IoFootball className="button-icon" />
        </button>

        <div className="welcome-footer">
          <p>Physoft Datasoftware © 2025</p>
        </div>
      </div>

      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
    </div>
  )
}

export default Welcome
