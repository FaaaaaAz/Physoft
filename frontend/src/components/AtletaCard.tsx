import { IoFootball } from 'react-icons/io5'
import '../styles/AtletaCard.css'

interface AtletaCardProps {
  atleta: {
    id: number
    nombre: string
    foto: string
    deporte: string
    edad: number
    club: string
    capacidades: {
      potencia: number
      fuerza: number
      velocidad: number
      flexibilidad: number
      resistencia: number
    }
  }
  onClick: () => void
}

function AtletaCard({ atleta, onClick }: AtletaCardProps) {
  // Calcular promedio de capacidades
  const promedio = Math.round(
    (atleta.capacidades.potencia +
      atleta.capacidades.fuerza +
      atleta.capacidades.velocidad +
      atleta.capacidades.flexibilidad +
      atleta.capacidades.resistencia) / 5
  )

  return (
    <div className="atleta-card" onClick={onClick}>
      <div className="card-image-container">
        <img src={atleta.foto} alt={atleta.nombre} className="card-image" />
        <div className="card-overlay">
          <span className="card-deporte">
            <IoFootball /> {atleta.deporte}
          </span>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-nombre">{atleta.nombre}</h3>
        <p className="card-club">{atleta.club}</p>
        
        <div className="card-stats">
          <div className="stat-item">
            <span className="stat-label">Edad</span>
            <span className="stat-value">{atleta.edad}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Overall</span>
            <span className="stat-value stat-overall">{promedio}</span>
          </div>
        </div>
      </div>
      
      <div className="card-hover-effect"></div>
    </div>
  )
}

export default AtletaCard
