import { useEffect, useRef } from 'react'
import { IoClose, IoFootball } from 'react-icons/io5'
import '../styles/AtletaModal.css'

interface AtletaModalProps {
  atleta: {
    id: number
    nombre: string
    foto: string
    deporte: string
    edad: number
    nacionalidad?: string
    altura?: number
    peso?: number
    club: string
    somatotipo?: string
    capacidades: {
      potencia: number
      fuerza: number
      velocidad: number
      flexibilidad: number
      resistencia: number
    }
  } | null
  onClose: () => void
}

function AtletaModal({ atleta, onClose }: AtletaModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!atleta || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuración
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 100
    const stats = [
      { label: 'Potencia', value: atleta.capacidades.potencia },
      { label: 'Fuerza', value: atleta.capacidades.fuerza },
      { label: 'Velocidad', value: atleta.capacidades.velocidad },
      { label: 'Flexibilidad', value: atleta.capacidades.flexibilidad },
      { label: 'Resistencia', value: atleta.capacidades.resistencia }
    ]

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dibujar líneas de fondo (pentágono guía)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1

    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      for (let j = 0; j <= stats.length; j++) {
        const angle = (Math.PI * 2 * j) / stats.length - Math.PI / 2
        const r = (radius * i) / 5
        const x = centerX + r * Math.cos(angle)
        const y = centerY + r * Math.sin(angle)
        if (j === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
    }

    // Dibujar líneas radiales
    stats.forEach((_, i) => {
      const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      )
      ctx.stroke()
    })

    // Dibujar datos del atleta
    ctx.fillStyle = 'rgba(20, 184, 166, 0.3)'
    ctx.strokeStyle = '#14b8a6'
    ctx.lineWidth = 2

    ctx.beginPath()
    stats.forEach((stat, i) => {
      const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2
      const r = (radius * stat.value) / 100
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Dibujar puntos
    ctx.fillStyle = '#14b8a6'
    stats.forEach((stat, i) => {
      const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2
      const r = (radius * stat.value) / 100
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // Dibujar etiquetas
    ctx.fillStyle = 'white'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    stats.forEach((stat, i) => {
      const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2
      const labelRadius = radius + 30
      const x = centerX + labelRadius * Math.cos(angle)
      const y = centerY + labelRadius * Math.sin(angle)
      
      // Etiqueta
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.fillText(stat.label, x, y - 10)
      
      // Valor
      ctx.fillStyle = '#14b8a6'
      ctx.font = 'bold 14px sans-serif'
      ctx.fillText(stat.value.toString(), x, y + 10)
      ctx.font = 'bold 12px sans-serif'
    })
  }, [atleta])

  if (!atleta) return null

  const promedio = Math.round(
    (atleta.capacidades.potencia +
      atleta.capacidades.fuerza +
      atleta.capacidades.velocidad +
      atleta.capacidades.flexibilidad +
      atleta.capacidades.resistencia) / 5
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <IoClose />
        </button>

        <div className="modal-header">
          <div className="modal-image-container">
            <img src={atleta.foto} alt={atleta.nombre} className="modal-image" />
            <div className="modal-deporte-badge">
              <IoFootball /> {atleta.deporte}
            </div>
          </div>

          <div className="modal-info">
            <h2 className="modal-nombre">{atleta.nombre}</h2>
            <p className="modal-club">{atleta.club}</p>
            <div className="modal-overall">
              <span className="overall-label">Overall</span>
              <span className="overall-value">{promedio}</span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h3 className="section-title">Información Personal</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Edad</span>
                <span className="info-value">{atleta.edad} años</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nacionalidad</span>
                <span className="info-value">{atleta.nacionalidad || 'No especificado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Altura</span>
                <span className="info-value">{atleta.altura || 'N/A'} cm</span>
              </div>
              <div className="info-item">
                <span className="info-label">Peso</span>
                <span className="info-value">{atleta.peso || 'N/A'} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Somatotipo</span>
                <span className="info-value">{atleta.somatotipo || 'No especificado'}</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3 className="section-title">Capacidades Físicas</h3>
            <div className="chart-container">
              <canvas 
                ref={canvasRef} 
                width="340" 
                height="340"
                className="radar-chart"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AtletaModal
