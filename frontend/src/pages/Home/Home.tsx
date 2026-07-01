import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoCheckmarkCircle, IoCloseCircle, IoRocket } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import { apiClient } from '../../services/api'
import './Home.css'

function Home() {
    const navigate = useNavigate()
    const [status, setStatus] = useState<string>('Connecting...')
    const [loading, setLoading] = useState<boolean>(true)
    const [isConnected, setIsConnected] = useState<boolean>(false)

    useEffect(() => {
        // Check backend connection
        const checkBackend = async () => {
            try {
                const response = await apiClient.get('/ping')
                setStatus(response.data.message || 'Backend connected')
                setIsConnected(true)
                setLoading(false)
            } catch (error) {
                setStatus('Working in offline mode with local SQLite')
                setIsConnected(false)
                setLoading(false)
                console.info('Backend not available, using SQLite:', error)
            }
        }

        checkBackend()
    }, [])

    return (
        <PageTemplate
            title="System Status"
            subtitle="Connectivity and functionality check"
            className="home-page"
        >
            <div className="home-content">
                {/* Connection Status */}
                <section className="status-card">
                    <div className="status-header">
                        <h3>Backend Connection</h3>
                            {loading ? (
                                <div className="status-loading">⏳ Checking...</div>
                        ) : (
                            <div className={`status-badge ${isConnected ? 'connected' : 'offline'}`}>
                                    {isConnected ? (
                                        <><IoCheckmarkCircle /> Connected</>
                                    ) : (
                                        <><IoCloseCircle /> Offline Mode</>
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
                    <h2>Welcome to Physoft</h2>
                    <p className="hero-description">
                        Advanced musculoskeletal analysis system for high-performance patients
                    </p>
                    <button className="btn-primary btn-primary-large" onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </button>
                </section>

                {/* Features Grid */}
                <section className="features-section">
                    <h3 className="section-title">Main Features</h3>
                    <div className="feature-grid">
                        <div className="feature-card">
                            <h4>📊 BTS Analysis</h4>
                            <p>Upload and import musculoskeletal data</p>
                        </div>
                        <div className="feature-card">
                            <h4>🔍 Comparison</h4>
                            <p>Smart comparison with similar cohorts</p>
                        </div>
                        <div className="feature-card">
                            <h4>📈 Reports</h4>
                            <p>Detailed reports with improvement margins</p>
                        </div>
                        <div className="feature-card">
                            <h4>📉 Timeline</h4>
                            <p>Progress charts by sessions</p>
                        </div>
                    </div>
                </section>

                {/* Additional Info */}
                <section className="info-section">
                    <div className="info-card">
                        <h4>💾 Local Storage</h4>
                        <p>Data is stored in local SQLite for offline access</p>
                    </div>
                    <div className="info-card">
                        <h4>☁️ Cloud Sync</h4>
                        <p>Coming soon: automatic synchronization with Supabase</p>
                    </div>
                </section>
            </div>
        </PageTemplate>
    )
}

export default Home
