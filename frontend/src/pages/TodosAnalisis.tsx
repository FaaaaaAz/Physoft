import { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import PageTemplate from '../components/templates/PageTemplate'
import AtletaAnalisisModal from '../components/AtletaAnalisisModal'
import '../styles/TodosAnalisis.css'

function TodosAnalisis() {
  const [busqueda, setBusqueda] = useState('')
  const [atletaSeleccionado, setAtletaSeleccionado] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  // Datos de ejemplo - Agrupados por atleta con sus análisis
  const atletasConAnalisis = [
    {
      nombre: 'Bukayo Saka',
      foto: undefined,
      edad: 22,
      somatipo: 'Mesomorfo',
      altura: 178,
      peso: 72,
      posicion: 'Extremo',
      club: 'Arsenal FC',
      codigoAcceso: '00009',
      capacidades: {
        velocidad: 88,
        resistencia: 82,
        fuerza: 75,
        potencia: 90,
        flexibilidad: 78
      },
      analisis: [
        { 
          id: 101, 
          fecha: '2025-11-20', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Estabilidad pélvica',
          capacidades: { velocidad: 88, resistencia: 82, fuerza: 75, potencia: 90, flexibilidad: 78 }
        },
        { 
          id: 102, 
          fecha: '2025-09-25', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Flexibilidad lumbar',
          capacidades: { velocidad: 85, resistencia: 80, fuerza: 73, potencia: 87, flexibilidad: 75 }
        },
        { 
          id: 103, 
          fecha: '2025-07-15', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Fuerza del core',
          capacidades: { velocidad: 82, resistencia: 78, fuerza: 70, potencia: 84, flexibilidad: 73 }
        },
        { 
          id: 104, 
          fecha: '2025-05-10', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Debajo del Promedio' as const, 
          puntoDebil: 'Movilidad cadera',
          capacidades: { velocidad: 80, resistencia: 75, fuerza: 68, potencia: 82, flexibilidad: 70 }
        },
        { 
          id: 105, 
          fecha: '2025-03-05', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Debajo del Promedio' as const, 
          puntoDebil: 'Estabilidad',
          capacidades: { velocidad: 78, resistencia: 73, fuerza: 65, potencia: 80, flexibilidad: 68 }
        }
      ]
    },
    {
      nombre: 'Cristiano Ronaldo',
      foto: undefined,
      edad: 39,
      somatipo: 'Mesomorfo',
      altura: 187,
      peso: 84,
      posicion: 'Delantero',
      club: 'Al-Nassr',
      codigoAcceso: '00001',
      capacidades: {
        velocidad: 85,
        resistencia: 90,
        fuerza: 92,
        potencia: 82,
        flexibilidad: 75
      },
      analisis: [
        { 
          id: 201, 
          fecha: '2025-11-15', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Balance de activación',
          capacidades: { velocidad: 85, resistencia: 90, fuerza: 92, potencia: 82, flexibilidad: 75 }
        },
        { 
          id: 202, 
          fecha: '2025-10-18', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Movilidad de tobillo',
          capacidades: { velocidad: 84, resistencia: 89, fuerza: 91, potencia: 81, flexibilidad: 74 }
        },
        { 
          id: 203, 
          fecha: '2025-08-22', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Flexibilidad',
          capacidades: { velocidad: 83, resistencia: 87, fuerza: 89, potencia: 80, flexibilidad: 72 }
        },
        { 
          id: 204, 
          fecha: '2025-06-12', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Potencia explosiva',
          capacidades: { velocidad: 82, resistencia: 86, fuerza: 88, potencia: 78, flexibilidad: 71 }
        },
        { 
          id: 205, 
          fecha: '2025-04-08', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Velocidad de sprint',
          capacidades: { velocidad: 80, resistencia: 85, fuerza: 87, potencia: 77, flexibilidad: 70 }
        }
      ]
    },
    {
      nombre: 'Erling Haaland',
      foto: undefined,
      edad: 24,
      somatipo: 'Mesomorfo Atlético',
      altura: 194,
      peso: 88,
      posicion: 'Delantero',
      club: 'Manchester City',
      codigoAcceso: '00004',
      capacidades: {
        velocidad: 92,
        resistencia: 85,
        fuerza: 95,
        potencia: 80,
        flexibilidad: 72
      },
      analisis: [
        { 
          id: 301, 
          fecha: '2025-11-10', 
          evaluador: 'Dr. Carlos Rodríguez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Flexibilidad lumbar',
          capacidades: { velocidad: 92, resistencia: 85, fuerza: 95, potencia: 80, flexibilidad: 72 }
        },
        { 
          id: 302, 
          fecha: '2025-10-10', 
          evaluador: 'Dr. Carlos Rodríguez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Estabilidad del core',
          capacidades: { velocidad: 91, resistencia: 84, fuerza: 94, potencia: 79, flexibilidad: 71 }
        },
        { 
          id: 303, 
          fecha: '2025-08-05', 
          evaluador: 'Dr. Carlos Rodríguez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Movilidad',
          capacidades: { velocidad: 90, resistencia: 83, fuerza: 92, potencia: 78, flexibilidad: 70 }
        },
        { 
          id: 304, 
          fecha: '2025-06-01', 
          evaluador: 'Dr. Carlos Rodríguez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Flexibilidad',
          capacidades: { velocidad: 89, resistencia: 82, fuerza: 91, potencia: 77, flexibilidad: 69 }
        },
        { 
          id: 305, 
          fecha: '2025-04-15', 
          evaluador: 'Dr. Carlos Rodríguez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Balance muscular',
          capacidades: { velocidad: 88, resistencia: 81, fuerza: 90, potencia: 76, flexibilidad: 68 }
        }
      ]
    },
    {
      nombre: 'Jude Bellingham',
      foto: undefined,
      edad: 21,
      somatipo: 'Mesomorfo',
      altura: 186,
      peso: 75,
      posicion: 'Centrocampista',
      club: 'Real Madrid',
      codigoAcceso: '00008',
      capacidades: {
        velocidad: 84,
        resistencia: 88,
        fuerza: 82,
        potencia: 86,
        flexibilidad: 80
      },
      analisis: [
        { 
          id: 401, 
          fecha: '2025-11-05', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Activación glútea',
          capacidades: { velocidad: 84, resistencia: 88, fuerza: 82, potencia: 86, flexibilidad: 80 }
        },
        { 
          id: 402, 
          fecha: '2025-09-28', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Control postural',
          capacidades: { velocidad: 83, resistencia: 86, fuerza: 81, potencia: 84, flexibilidad: 78 }
        },
        { 
          id: 403, 
          fecha: '2025-07-20', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Estabilidad',
          capacidades: { velocidad: 82, resistencia: 85, fuerza: 80, potencia: 83, flexibilidad: 77 }
        },
        { 
          id: 404, 
          fecha: '2025-05-15', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Fuerza',
          capacidades: { velocidad: 81, resistencia: 84, fuerza: 79, potencia: 82, flexibilidad: 76 }
        },
        { 
          id: 405, 
          fecha: '2025-03-10', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Velocidad',
          capacidades: { velocidad: 80, resistencia: 83, fuerza: 78, potencia: 81, flexibilidad: 75 }
        }
      ]
    },
    {
      nombre: 'Kevin De Bruyne',
      foto: undefined,
      edad: 33,
      somatipo: 'Ectomorfo Atlético',
      altura: 181,
      peso: 70,
      posicion: 'Centrocampista',
      club: 'Manchester City',
      codigoAcceso: '00005',
      capacidades: {
        velocidad: 78,
        resistencia: 85,
        fuerza: 80,
        potencia: 88,
        flexibilidad: 82
      },
      analisis: [
        { 
          id: 501, 
          fecha: '2025-10-28', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Movilidad de tobillo',
          capacidades: { velocidad: 78, resistencia: 85, fuerza: 80, potencia: 88, flexibilidad: 82 }
        },
        { 
          id: 502, 
          fecha: '2025-10-08', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Asimetría muscular',
          capacidades: { velocidad: 77, resistencia: 84, fuerza: 79, potencia: 86, flexibilidad: 81 }
        },
        { 
          id: 503, 
          fecha: '2025-08-15', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Fuerza',
          capacidades: { velocidad: 76, resistencia: 83, fuerza: 78, potencia: 85, flexibilidad: 80 }
        },
        { 
          id: 504, 
          fecha: '2025-06-10', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Velocidad',
          capacidades: { velocidad: 75, resistencia: 82, fuerza: 77, potencia: 84, flexibilidad: 79 }
        },
        { 
          id: 505, 
          fecha: '2025-04-05', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Debajo del Promedio' as const, 
          puntoDebil: 'Sprint',
          capacidades: { velocidad: 74, resistencia: 81, fuerza: 76, potencia: 83, flexibilidad: 78 }
        }
      ]
    },
    {
      nombre: 'Kylian Mbappé',
      foto: undefined,
      edad: 25,
      somatipo: 'Mesomorfo',
      altura: 178,
      peso: 73,
      posicion: 'Delantero',
      club: 'Real Madrid',
      codigoAcceso: '00003',
      capacidades: {
        velocidad: 98,
        resistencia: 88,
        fuerza: 85,
        potencia: 92,
        flexibilidad: 80
      },
      analisis: [
        { 
          id: 601, 
          fecha: '2025-10-25', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Estabilidad del core',
          capacidades: { velocidad: 98, resistencia: 88, fuerza: 85, potencia: 92, flexibilidad: 80 }
        },
        { 
          id: 602, 
          fecha: '2025-10-12', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Balance de activación',
          capacidades: { velocidad: 97, resistencia: 87, fuerza: 84, potencia: 90, flexibilidad: 79 }
        },
        { 
          id: 603, 
          fecha: '2025-08-20', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Flexibilidad',
          capacidades: { velocidad: 96, resistencia: 86, fuerza: 83, potencia: 89, flexibilidad: 78 }
        },
        { 
          id: 604, 
          fecha: '2025-06-18', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Fuerza',
          capacidades: { velocidad: 95, resistencia: 85, fuerza: 82, potencia: 88, flexibilidad: 77 }
        },
        { 
          id: 605, 
          fecha: '2025-04-12', 
          evaluador: 'Dra. María González', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Resistencia',
          capacidades: { velocidad: 94, resistencia: 84, fuerza: 81, potencia: 87, flexibilidad: 76 }
        }
      ]
    },
    {
      nombre: 'Lionel Messi',
      foto: undefined,
      edad: 37,
      somatipo: 'Mesomorfo',
      altura: 170,
      peso: 67,
      posicion: 'Delantero',
      club: 'Inter Miami',
      codigoAcceso: '00000',
      capacidades: {
        velocidad: 80,
        resistencia: 85,
        fuerza: 75,
        potencia: 95,
        flexibilidad: 88
      },
      analisis: [
        { 
          id: 701, 
          fecha: '2025-11-22', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Oblicuidad de cadera',
          capacidades: { velocidad: 80, resistencia: 85, fuerza: 75, potencia: 95, flexibilidad: 88 }
        },
        { 
          id: 702, 
          fecha: '2025-10-20', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Estabilidad pélvica',
          capacidades: { velocidad: 79, resistencia: 84, fuerza: 74, potencia: 94, flexibilidad: 87 }
        },
        { 
          id: 703, 
          fecha: '2025-08-12', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Fuerza',
          capacidades: { velocidad: 78, resistencia: 83, fuerza: 73, potencia: 93, flexibilidad: 86 }
        },
        { 
          id: 704, 
          fecha: '2025-06-08', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Velocidad',
          capacidades: { velocidad: 77, resistencia: 82, fuerza: 72, potencia: 92, flexibilidad: 85 }
        },
        { 
          id: 705, 
          fecha: '2025-04-02', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Resistencia',
          capacidades: { velocidad: 76, resistencia: 81, fuerza: 71, potencia: 91, flexibilidad: 84 }
        }
      ]
    },
    {
      nombre: 'Mohamed Salah',
      foto: undefined,
      edad: 32,
      somatipo: 'Ectomorfo Atlético',
      altura: 175,
      peso: 71,
      posicion: 'Extremo',
      club: 'Liverpool FC',
      codigoAcceso: '00006',
      capacidades: {
        velocidad: 90,
        resistencia: 88,
        fuerza: 78,
        potencia: 89,
        flexibilidad: 82
      },
      analisis: [
        { 
          id: 801, 
          fecha: '2025-10-22', 
          evaluador: 'Dra. Laura Fernández', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Asimetría muscular',
          capacidades: { velocidad: 90, resistencia: 88, fuerza: 78, potencia: 89, flexibilidad: 82 }
        },
        { 
          id: 802, 
          fecha: '2025-10-05', 
          evaluador: 'Dra. Laura Fernández', 
          clasificacion: 'Debajo del Promedio' as const, 
          puntoDebil: 'Flexibilidad lumbar',
          capacidades: { velocidad: 89, resistencia: 87, fuerza: 77, potencia: 88, flexibilidad: 81 }
        },
        { 
          id: 803, 
          fecha: '2025-08-18', 
          evaluador: 'Dra. Laura Fernández', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Fuerza',
          capacidades: { velocidad: 88, resistencia: 86, fuerza: 76, potencia: 87, flexibilidad: 80 }
        },
        { 
          id: 804, 
          fecha: '2025-06-14', 
          evaluador: 'Dra. Laura Fernández', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Potencia',
          capacidades: { velocidad: 87, resistencia: 85, fuerza: 75, potencia: 86, flexibilidad: 79 }
        },
        { 
          id: 805, 
          fecha: '2025-04-10', 
          evaluador: 'Dra. Laura Fernández', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Resistencia',
          capacidades: { velocidad: 86, resistencia: 84, fuerza: 74, potencia: 85, flexibilidad: 78 }
        }
      ]
    },
    {
      nombre: 'Neymar Jr',
      foto: undefined,
      edad: 32,
      somatipo: 'Ectomorfo',
      altura: 175,
      peso: 68,
      posicion: 'Extremo',
      club: 'Al-Hilal',
      codigoAcceso: '00002',
      capacidades: {
        velocidad: 88,
        resistencia: 80,
        fuerza: 72,
        potencia: 95,
        flexibilidad: 92
      },
      analisis: [
        { 
          id: 901, 
          fecha: '2025-10-20', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Equilibrio pierna izquierda',
          capacidades: { velocidad: 88, resistencia: 80, fuerza: 72, potencia: 95, flexibilidad: 92 }
        },
        { 
          id: 902, 
          fecha: '2025-10-15', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Debajo del Promedio' as const, 
          puntoDebil: 'Estabilidad del core',
          capacidades: { velocidad: 87, resistencia: 79, fuerza: 71, potencia: 94, flexibilidad: 91 }
        },
        { 
          id: 903, 
          fecha: '2025-08-25', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Fuerza',
          capacidades: { velocidad: 86, resistencia: 78, fuerza: 70, potencia: 93, flexibilidad: 90 }
        },
        { 
          id: 904, 
          fecha: '2025-06-20', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Debajo del Promedio' as const, 
          puntoDebil: 'Resistencia',
          capacidades: { velocidad: 85, resistencia: 77, fuerza: 69, potencia: 92, flexibilidad: 89 }
        },
        { 
          id: 905, 
          fecha: '2025-04-18', 
          evaluador: 'Dr. Juan Pérez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Core',
          capacidades: { velocidad: 84, resistencia: 76, fuerza: 68, potencia: 91, flexibilidad: 88 }
        }
      ]
    },
    {
      nombre: 'Vinícius Jr',
      foto: undefined,
      edad: 24,
      somatipo: 'Mesomorfo',
      altura: 176,
      peso: 73,
      posicion: 'Extremo',
      club: 'Real Madrid',
      codigoAcceso: '00007',
      capacidades: {
        velocidad: 95,
        resistencia: 85,
        fuerza: 78,
        potencia: 93,
        flexibilidad: 85
      },
      analisis: [
        { 
          id: 1001, 
          fecha: '2025-10-18', 
          evaluador: 'Dr. Carlos Rodríguez', 
          clasificacion: 'Debajo del Promedio' as const, 
          puntoDebil: 'Control postural',
          capacidades: { velocidad: 95, resistencia: 85, fuerza: 78, potencia: 93, flexibilidad: 85 }
        },
        { 
          id: 1002, 
          fecha: '2025-10-03', 
          evaluador: 'Dr. Carlos Rodríguez', 
          clasificacion: 'Debajo del Promedio' as const, 
          puntoDebil: 'Activación glútea',
          capacidades: { velocidad: 94, resistencia: 84, fuerza: 77, potencia: 92, flexibilidad: 84 }
        },
        { 
          id: 1003, 
          fecha: '2025-08-28', 
          evaluador: 'Dr. Carlos Rodríguez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Fuerza',
          capacidades: { velocidad: 93, resistencia: 83, fuerza: 76, potencia: 91, flexibilidad: 83 }
        },
        { 
          id: 1004, 
          fecha: '2025-06-25', 
          evaluador: 'Dr. Carlos Rodríguez', 
          clasificacion: 'Promedio' as const, 
          puntoDebil: 'Balance',
          capacidades: { velocidad: 92, resistencia: 82, fuerza: 75, potencia: 90, flexibilidad: 82 }
        },
        { 
          id: 1005, 
          fecha: '2025-04-22', 
          evaluador: 'Dr. Carlos Rodríguez', 
          clasificacion: 'Encima del Promedio' as const, 
          puntoDebil: 'Estabilidad',
          capacidades: { velocidad: 91, resistencia: 81, fuerza: 74, potencia: 89, flexibilidad: 81 }
        }
      ]
    }
  ]

  // Ordenar alfabéticamente
  const atletasOrdenados = [...atletasConAnalisis].sort((a, b) => 
    a.nombre.localeCompare(b.nombre)
  )

  // Filtrar por búsqueda
  const atletasFiltrados = atletasOrdenados.filter(atleta =>
    atleta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    atleta.analisis.some(a => a.evaluador.toLowerCase().includes(busqueda.toLowerCase()))
  )

  const handleVerDetalles = (atleta: any) => {
    setAtletaSeleccionado(atleta)
    setShowModal(true)
  }

  const handleVerAnalisis = (analisisId: number) => {
    console.log('Ver análisis:', analisisId)
    // Aquí irá la lógica para ver el análisis completo
  }

  const handleDescargarAnalisis = (analisisId: number) => {
    console.log('Descargar análisis:', analisisId)
    // Aquí irá la lógica para descargar el análisis
  }

  const getBadgeClass = (clasificacion: string) => {
    if (clasificacion === 'Encima del Promedio') return 'badge-encima'
    if (clasificacion === 'Promedio') return 'badge-promedio'
    return 'badge-debajo'
  }

  return (
    <PageTemplate
      title="Todos los Análisis"
      subtitle={`${atletasOrdenados.length} atletas con análisis registrados`}
      className="todos-analisis-page"
      showBackButton={true}
      backTo="/analisis"
    >
      {/* Buscador */}
      <div className="todos-analisis-header">
        <div className="search-container">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por atleta o evaluador..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tabla de análisis */}
      <div className="todos-analisis-content">
        <div className="analisis-table-container">
          <table className="analisis-table">
            <thead>
              <tr>
                <th>Atleta</th>
                <th>Evaluador</th>
                <th>Clasificación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {atletasFiltrados.length > 0 ? (
                atletasFiltrados.map(atleta => {
                  const ultimoAnalisis = atleta.analisis[0]
                  return (
                    <tr key={atleta.codigoAcceso}>
                      <td>
                        <div className="atleta-cell">
                          <div className="atleta-avatar">
                            {atleta.nombre.charAt(0)}
                          </div>
                          <span className="atleta-nombre">{atleta.nombre}</span>
                        </div>
                      </td>
                      <td>{ultimoAnalisis.evaluador}</td>
                      <td>
                        <span className={`badge ${getBadgeClass(ultimoAnalisis.clasificacion)}`}>
                          {ultimoAnalisis.clasificacion}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="btn-icon-small" 
                            title="Ver detalles"
                            onClick={() => handleVerDetalles(atleta)}
                          >
                            👁️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="no-results">
                    No se encontraron atletas que coincidan con tu búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles del Atleta */}
      {showModal && atletaSeleccionado && (
        <AtletaAnalisisModal
          atleta={atletaSeleccionado}
          onClose={() => setShowModal(false)}
          onVerAnalisis={handleVerAnalisis}
          onDescargarAnalisis={handleDescargarAnalisis}
        />
      )}
    </PageTemplate>
  )
}

export default TodosAnalisis
