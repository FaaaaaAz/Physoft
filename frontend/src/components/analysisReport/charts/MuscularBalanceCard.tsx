import { muscularBalanceMock } from '../mockCharts'
import './ChartCard.css'
import './MuscularBalanceCard.css'

function MuscularBalanceCard() {
    const { muscles, averageSymmetry } = muscularBalanceMock

    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <h3>Muscular Balance (EMG)</h3>
                <p>Left-right symmetry per muscle group</p>
            </div>

            <div className="muscular-balance-list">
                {muscles.map((item) => (
                    <div key={item.muscle} className="muscular-balance-row">
                        <span className="muscular-balance-label">{item.muscle}</span>
                        <div className="muscular-balance-bar">
                            <div className="muscular-balance-bar-fill" style={{ width: `${item.symmetryPercent}%` }} />
                        </div>
                        <span className="muscular-balance-value">{item.symmetryPercent}%</span>
                    </div>
                ))}
            </div>

            <div className="chart-card-footer">
                <span className="chart-card-footer-label">Average Symmetry</span>
                <span className="chart-card-footer-value">{averageSymmetry}%</span>
            </div>
        </div>
    )
}

export default MuscularBalanceCard
