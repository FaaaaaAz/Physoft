import { useState } from 'react'
import { IoSearch, IoSettings, IoPerson, IoFootball } from 'react-icons/io5'
import AtletaCard from '../components/AtletaCard'
import AtletaModal from '../components/AtletaModal'
import '../styles/Dashboard.css'

interface DashboardProps {
  onNavigate: (page: string) => void
}

const atletasEjemplo = [
  {
    id: 1,
    nombre: 'Lionel Messi',
    foto: '/src/assets/players/player1.png',
    deporte: 'Fútbol',
    edad: 36,
    nacionalidad: 'Argentina',
    altura: 170,
    peso: 72,
    club: 'Inter Miami',
    somatotipo: 'Mesomorfo',
    capacidades: {
      potencia: 92,
      fuerza: 78,
      velocidad: 88,
      flexibilidad: 85,
      resistencia: 90
    }
  },
  {
    id: 2,
    nombre: 'Cristiano Ronaldo',
    foto: '/src/assets/players/player2.png',
    deporte: 'Fútbol',
    edad: 38,
    nacionalidad: 'Portugal',
    altura: 187,
    peso: 84,
    club: 'Al Nassr',
    somatotipo: 'Mesomorfo Atlético',
    capacidades: {
      potencia: 95,
      fuerza: 92,
      velocidad: 86,
      flexibilidad: 80,
      resistencia: 88
    }
  },
  {
    id: 3,
    nombre: 'Neymar Jr',
    foto: '/src/assets/players/player3.png',
    deporte: 'Fútbol',
    edad: 31,
    nacionalidad: 'Brasil',
    altura: 175,
    peso: 68,
    club: 'Al Hilal',
    somatotipo: 'Ectomorfo',
    capacidades: {
      potencia: 88,
      fuerza: 75,
      velocidad: 94,
      flexibilidad: 92,
      resistencia: 84
    }
  },
  {
    id: 4,
    nombre: 'Kylian Mbappé',
    foto: '/src/assets/players/player4.png',
    deporte: 'Fútbol',
    edad: 24,
    nacionalidad: 'Francia',
    altura: 178,
    peso: 73,
    club: 'PSG',
    somatotipo: 'Mesomorfo',
    capacidades: {
      potencia: 94,
      fuerza: 82,
      velocidad: 98,
      flexibilidad: 88,
      resistencia: 86
    }
  },
  {
    id: 5,
    nombre: 'Erling Haaland',
    foto: '/src/assets/players/player5.png',
    deporte: 'Fútbol',
    edad: 23,
    nacionalidad: 'Noruega',
    altura: 194,
    peso: 88,
    club: 'Manchester City',
    somatotipo: 'Mesomorfo Endomorfo',
    capacidades: {
      potencia: 96,
      fuerza: 94,
      velocidad: 91,
      flexibilidad: 78,
      resistencia: 85
    }
  },
  {
    id: 6,
    nombre: 'Kevin De Bruyne',
    foto: '/src/assets/players/player1.png',
    deporte: 'Fútbol',
    edad: 32,
    nacionalidad: 'Bélgica',
    altura: 181,
    peso: 76,
    club: 'Manchester City',
    somatotipo: 'Mesomorfo',
    capacidades: {
      potencia: 85,
      fuerza: 80,
      velocidad: 82,
      flexibilidad: 84,
      resistencia: 88
    }
  },
  {
    id: 7,
    nombre: 'Luka Modrić',
    foto: '/src/assets/players/player2.png',
    deporte: 'Fútbol',
    edad: 38,
    nacionalidad: 'Croacia',
    altura: 172,
    peso: 66,
    club: 'Real Madrid',
    somatotipo: 'Ectomorfo',
    capacidades: {
      potencia: 78,
      fuerza: 72,
      velocidad: 80,
      flexibilidad: 88,
      resistencia: 92
    }
  },
  {
    id: 8,
    nombre: 'Vinícius Jr',
    foto: '/src/assets/players/player3.png',
    deporte: 'Fútbol',
    edad: 23,
    nacionalidad: 'Brasil',
    altura: 176,
    peso: 73,
    club: 'Real Madrid',
    somatotipo: 'Mesomorfo',
    capacidades: {
      potencia: 90,
      fuerza: 78,
      velocidad: 96,
      flexibilidad: 90,
      resistencia: 82
    }
  },
  {
    id: 9,
    nombre: 'Robert Lewandowski',
    foto: '/src/assets/players/player4.png',
    deporte: 'Fútbol',
    edad: 35,
    nacionalidad: 'Polonia',
    altura: 185,
    peso: 81,
    club: 'FC Barcelona',
    somatotipo: 'Mesomorfo',
    capacidades: {
      potencia: 93,
      fuerza: 88,
      velocidad: 84,
      flexibilidad: 82,
      resistencia: 86
    }
  },
  {
    id: 10,
    nombre: 'Jude Bellingham',
    foto: '/src/assets/players/player5.png',
    deporte: 'Fútbol',
    edad: 20,
    nacionalidad: 'Inglaterra',
    altura: 186,
    peso: 75,
    club: 'Real Madrid',
    somatotipo: 'Mesomorfo',
    capacidades: {
      potencia: 88,
      fuerza: 84,
      velocidad: 86,
      flexibilidad: 85,
      resistencia: 90
    }
  }
]

function Dashboard({ onNavigate }: DashboardProps) {
  const [busqueda, setBusqueda] = useState('')
  const [deporteFiltro, setDeporteFiltro] = useState('Todos')
  const [atletaSeleccionado, setAtletaSeleccionado] = useState<typeof atletasEjemplo[0] | null>(null)

  // Filtrar atletas
  const atletasFiltrados = atletasEjemplo.filter(atleta => {
    const coincideNombre = atleta.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideDeporte = deporteFiltro === 'Todos' || atleta.deporte === deporteFiltro
    return coincideNombre && coincideDeporte
  })

  // Obtener deportes únicos
  const deportes = ['Todos', ...Array.from(new Set(atletasEjemplo.map(a => a.deporte)))]

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <a href="#" className="navbar-brand">
            <img src="/src/assets/physoft.png" alt="Physoft" className="navbar-logo" />
            <span className="navbar-title">Physoft</span>
          </a>
          
          <ul className="navbar-menu">
            <li><a href="#" onClick={() => onNavigate('dashboard')} className="navbar-link active">Inicio</a></li>
            <li><a href="#" onClick={() => onNavigate('analisis')} className="navbar-link">Análisis</a></li>
            <li><a href="#" onClick={() => onNavigate('agregar')} className="navbar-link">Agregar Atleta</a></li>
          </ul>
          
          <div className="navbar-actions">
            <button className="navbar-icon-btn">
              <IoSettings />
            </button>
            <button className="navbar-icon-btn">
              <IoPerson />
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="dashboard-content">
        {/* Buscador y Filtros */}
        <div className="dashboard-filters">
          <div className="search-container">
            <IoSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar atleta por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={deporteFiltro}
            onChange={(e) => setDeporteFiltro(e.target.value)}
            className="filter-select"
          >
            {deportes.map(deporte => (
              <option key={deporte} value={deporte}>{deporte}</option>
            ))}
          </select>
        </div>

        {/* Grid de Atletas */}
        {atletasFiltrados.length > 0 ? (
          <div className="atletas-grid">
            {atletasFiltrados.map(atleta => (
              <AtletaCard
                key={atleta.id}
                atleta={atleta}
                onClick={() => setAtletaSeleccionado(atleta)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <IoFootball />
            <h3>No se encontraron atletas</h3>
            <p>Intenta con otros criterios de búsqueda</p>
          </div>
        )}
      </main>

      {/* Modal de Atleta */}
      <AtletaModal
        atleta={atletaSeleccionado}
        onClose={() => setAtletaSeleccionado(null)}
      />
    </div>
  )
}

export default Dashboard
