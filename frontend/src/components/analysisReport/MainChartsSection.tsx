import { IoBarChartOutline } from 'react-icons/io5'
import CapacityRadarCard from './charts/CapacityRadarCard'
import CohortComparisonCard from './charts/CohortComparisonCard'
import ProgressOverTimeCard from './charts/ProgressOverTimeCard'
import MuscularBalanceCard from './charts/MuscularBalanceCard'
import LoadDistributionCard from './charts/LoadDistributionCard'
import RangeOfMotionCard from './charts/RangeOfMotionCard'
import BodyCompositionCard from './charts/BodyCompositionCard'
import './MainChartsSection.css'

/** "Main Charts" — the 7 visual cards (radar, bar, line, bars, image, table, donut). */
function MainChartsSection() {
    return (
        <section className="analysis-section">
            <h2>
                <IoBarChartOutline /> Main Charts
            </h2>

            <div className="main-charts-grid">
                <CapacityRadarCard />
                <CohortComparisonCard />
                <ProgressOverTimeCard />
                <MuscularBalanceCard />
                <LoadDistributionCard />
                <RangeOfMotionCard />
                <BodyCompositionCard />
            </div>
        </section>
    )
}

export default MainChartsSection
