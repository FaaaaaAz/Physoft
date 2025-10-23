import { useEffect, useState } from 'react'
import { apiClient } from '../services/api'

function Home() {
  const [status, setStatus] = useState<string>('Conectando...')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Verificar conexión con el backend
    const checkBackend = async () => {
      try {
        const response = await apiClient.get('/ping')
        setStatus(response.data.message || '✓ Backend conectado')
        setLoading(false)
      } catch (error) {
        setStatus('✗ Error al conectar con el backend')
        setLoading(false)
        console.error('Error conectando al backend:', error)
      }
    }

    checkBackend()
  }, [])

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="logo">Physoft</h1>
        <p className="tagline">Plataforma de Análisis Deportivo</p>
      </header>

      <main className="main-content">
        <section className="hero">
          <h2>Bienvenido al MVP de Physoft</h2>
          <p>
            Análisis musculoesquelético avanzado para atletas de alto rendimiento.
          </p>
        </section>

        <section className="status-card">
          <h3>Estado del Sistema</h3>
          <p className={loading ? 'status-loading' : 'status-ready'}>
            {status}
          </p>
        </section>

        <section className="features">
          <h3>Funcionalidades del MVP</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>📊 Análisis BTS</h4>
              <p>Subida e importación de datos musculoesqueléticos</p>
            </div>
            <div className="feature-card">
              <h4>🔍 Comparación</h4>
              <p>Comparación inteligente con cohortes similares</p>
            </div>
            <div className="feature-card">
              <h4>📈 Reportes</h4>
              <p>Informes detallados con márgenes de mejora</p>
            </div>
            <div className="feature-card">
              <h4>📉 Timeline</h4>
              <p>Gráficas de progreso por sesiones</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Physoft v1.0.0 - MVP</p>
      </footer>
    </div>
  )
}

export default Home
