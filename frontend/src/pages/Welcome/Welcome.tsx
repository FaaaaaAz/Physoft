import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowForward } from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import physoftLogo from '@/assets/physoft.png'
import './Welcome.css'

function Welcome() {
    const [isAnimating, setIsAnimating] = useState(false)
    const navigate = useNavigate()

    const handleEnter = () => {
        setIsAnimating(true)
        setTimeout(() => {
            navigate('/dashboard')
        }, 600)
    }

    return (
        <PageTemplate showNavbar={false} className="welcome-wrapper">
            <div className={`welcome-container ${isAnimating ? 'fade-out' : ''}`}>
                <div className="welcome-content">
                    <div className="logo-container">
                        <img
                            src={physoftLogo}
                            alt="Physoft Logo"
                            className="welcome-logo"
                        />
                    </div>

                    <h1 className="welcome-title">Physoft</h1>
                    <p className="welcome-subtitle">Sports Analysis Platform</p>

                    <div className="welcome-description">
                        <p>Advanced musculoskeletal analysis system</p>
                        <p>for high-performance patients</p>
                    </div>

                    <button className="welcome-button" onClick={handleEnter}>
                        <span>Enter Platform</span>
                        <IoArrowForward className="button-icon" />
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
        </PageTemplate>
    )
}

export default Welcome
