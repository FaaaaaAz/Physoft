import LoadDistributionImage from '@/assets/Result_Assessment/LoadDistribution.png'
import './ChartCard.css'
import './LoadDistributionCard.css'

/** Card 5 — displays the existing load-distribution image asset. No logic, no heatmap generation. */
function LoadDistributionCard() {
    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <h3>Load Distribution</h3>
            </div>
            <div className="load-distribution-image-wrap">
                <img src={LoadDistributionImage} alt="Load Distribution" className="load-distribution-image" />
            </div>
        </div>
    )
}

export default LoadDistributionCard
