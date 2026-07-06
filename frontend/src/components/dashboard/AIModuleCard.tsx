import { IoSparkles } from 'react-icons/io5'
import './AIModuleCard.css'

function AIModuleCard() {
    return (
        <div className="ai-module-card">
            <div className="ai-module-icon">
                <IoSparkles />
            </div>
            <div className="ai-module-info">
                <span className="ai-module-title">AI Module</span>
                <p className="ai-module-description">
                    Automated biomechanical insights and recommendations powered by AI.
                </p>
            </div>
            <span className="ai-module-badge">Coming Soon</span>
        </div>
    )
}

export default AIModuleCard
