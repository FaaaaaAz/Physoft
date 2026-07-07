import {
    IoSparkles,
    IoAnalyticsOutline,
    IoBulbOutline,
    IoLayersOutline,
    IoTrendingUpOutline,
    IoSend
} from 'react-icons/io5'
import PageTemplate from '../../components/templates/PageTemplate'
import './Assistant.css'

interface Capability {
    icon: JSX.Element
    title: string
    description: string
}

const CAPABILITIES: Capability[] = [
    {
        icon: <IoAnalyticsOutline />,
        title: 'Interpret results',
        description: 'Understand assessment data and physical capacity scores.'
    },
    {
        icon: <IoBulbOutline />,
        title: 'Explain concepts',
        description: 'Clarify biomechanical and kinesiology concepts on demand.'
    },
    {
        icon: <IoLayersOutline />,
        title: 'Protocol guidance',
        description: 'Get help designing rehabilitation and training protocols.'
    },
    {
        icon: <IoTrendingUpOutline />,
        title: 'Performance advice',
        description: 'Receive general recommendations for sports performance.'
    }
]

function Assistant() {
    return (
        <PageTemplate
            title="Clinical Assistant"
            subtitle="Your AI-powered assistant for physiotherapy, biomechanics and performance"
            className="assistant-page"
        >
            <div className="assistant">
                {/* Hero */}
                <div className="assistant-hero">
                    <div className="assistant-hero-icon">
                        <IoSparkles />
                    </div>
                    <h2 className="assistant-hero-title">How can I help you today?</h2>
                    <p className="assistant-hero-text">
                        Ask about assessment interpretation, biomechanical concepts, rehabilitation
                        protocols, or performance recommendations. Clinical Assistant supports your
                        professional judgment &mdash; it does not replace it.
                    </p>
                </div>

                {/* Capability suggestions */}
                <div className="assistant-suggestions">
                    {CAPABILITIES.map((cap) => (
                        <div key={cap.title} className="assistant-suggestion">
                            <span className="assistant-suggestion-icon">{cap.icon}</span>
                            <div className="assistant-suggestion-body">
                                <span className="assistant-suggestion-title">{cap.title}</span>
                                <span className="assistant-suggestion-desc">{cap.description}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input bar (prepared for future AI integration) */}
                <div className="assistant-inputbar">
                    <input
                        type="text"
                        className="assistant-input"
                        placeholder="Ask anything about physiotherapy, biomechanics or performance..."
                        disabled
                    />
                    <button className="assistant-send" disabled title="Coming soon">
                        <IoSend />
                    </button>
                    <span className="assistant-soon-badge">Coming soon</span>
                </div>
                <p className="assistant-disclaimer">
                    AI integration is coming soon. This assistant will provide general educational
                    guidance and is not a substitute for professional clinical judgment.
                </p>
            </div>
        </PageTemplate>
    )
}

export default Assistant
