import { rangeOfMotionMock } from '../mockCharts'
import './ChartCard.css'
import './RangeOfMotionCard.css'

function RangeOfMotionCard() {
    const { rows, overallAverage } = rangeOfMotionMock

    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <h3>Range of Motion Analysis</h3>
            </div>

            <div className="rom-table-wrap">
                <table className="rom-table">
                    <thead>
                        <tr>
                            <th>Movement</th>
                            <th>Current ROM</th>
                            <th>Ideal ROM</th>
                            <th>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.movement}>
                                <td>{row.movement}</td>
                                <td>{row.currentRom}&deg;</td>
                                <td>{row.idealRom}&deg;</td>
                                <td className="rom-pct">{row.percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="chart-card-footer">
                <span className="chart-card-footer-label">Overall ROM Average</span>
                <span className="chart-card-footer-value">{overallAverage}%</span>
            </div>
        </div>
    )
}

export default RangeOfMotionCard
