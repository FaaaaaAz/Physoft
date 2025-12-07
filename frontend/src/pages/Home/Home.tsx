import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoCheckmarkCircle, IoCloseCircle, IoRocket } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import { apiClient } from '../../services/api'
import './Home.css'

function Home() {
    const navigate = useNavigate()
    const [status, setStatus] = useState<string>('Conectando...')
    const [loading, setLoading] = useState<boolean>(true)
    const [isConnected, setIsConnected] = useState<boolean>(false)

    useEffect(() => {
        // Check backend connection
        const checkBackend = async () => {
            try {
                const response = await apiClient.get('/ping')
                setStatus(response.data.message || 'Backend conectado')
                setIsConnected(true)
                setLoading(false)
            } catch (error) {
                setStatus('Trabajando en modo offline con SQLite local')
                setIsConnected(false)
                setLoading(false)
                console.info('Backend not available, using SQLite:', error)
            }
        }

        checkBackend()
    }, [])

    return (
        <PageTemplate
            title="Estado del Sistema"
            subtitle="Verificación de conectividad y funcionalidad"
            className="home-page"
        >
            <div className="home-content">
                {/* Connection Status */}
                <section className="status-card">
                    <div className="status-header">
                        <h3>Conexión Backend</h3>
                        {loading ? (
                            <div className="status-loading">⏳ Verificando...</div>
                        ) : (
                            <div className={`status-badge ${isConnected ? 'connected' : 'offline'}`}>
                                {isConnected ? (
                                    <><IoCheckmarkCircle /> Conectado</>
                                ) : (
                                    <><IoCloseCircle /> Modo Offline</>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="status-message">{status}</p>
                </section>

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-icon">
                        <IoRocket />
                    </div>
                    <h2>Bienvenido a Physoft</h2>
                    <p className="hero-description">
                        Sistema avanzado de análisis musculoesquelético para atletas de alto rendimiento
                    </p>
                    <button className="btn-primary btn-primary-large" onClick={() => navigate('/dashboard')}>
                        Ir al Dashboard
                    </button>
                </section>

                {/* Features Grid */}
                <section className="features-section">
                    <h3 className="section-title">Características Principales</h3>
                    <div className="feature-grid">
                        <div className="feature-card">
                            <h4>📊 Análisis BTS</h4>
                            <p>Carga e importa datos musculoesqueléticos</p>
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
                            <h4>📉 Línea de Tiempo</h4>
                            <p>Gráficos de progreso por sesiones</p>
                        </div>
                    </div>
                </section>

                {/* Additional Info */}
                <section className="info-section">
                    <div className="info-card">
                        <h4>💾 Almacenamiento Local</h4>
                        <p>Los datos se guardan en SQLite local para acceso offline</p>
                    </div>
                    <div className="info-card">
                        <h4>☁️ Sincronización en la Nube</h4>
                        <p>Próximamente: sincronización automática con Supabase</p>
                    </div>
                </section>
            </div>
        </PageTemplate>
    )
}

export default Home
