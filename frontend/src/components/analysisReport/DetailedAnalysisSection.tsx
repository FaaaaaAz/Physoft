import { IoListOutline, IoContractOutline, IoBulbOutline } from 'react-icons/io5'
import { weakPointsMock, muscularShorteningMock, mainRecommendationsMock } from './mockDetailedAnalysis'
import './DetailedAnalysisSection.css'

function BulletColumn({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
    return (
        <div className="detailed-analysis-column">
            <h3>{icon} {title}</h3>
            <ul>
                {items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        </div>
    )
}

/** Detailed Analysis — 3-column mock bullet lists. Data from mockDetailedAnalysis.ts. */
function DetailedAnalysisSection() {
    return (
        <section className="analysis-section">
            <h2>Detailed Analysis</h2>

            <div className="detailed-analysis-columns">
                <BulletColumn icon={<IoListOutline />} title="Weak Points / Limitations" items={weakPointsMock} />
                <BulletColumn icon={<IoContractOutline />} title="Muscular Shortening" items={muscularShorteningMock} />
                <BulletColumn icon={<IoBulbOutline />} title="Main Recommendations" items={mainRecommendationsMock} />
            </div>
        </section>
    )
}

export default DetailedAnalysisSection
