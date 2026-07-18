import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { bodyCompositionMock } from '../mockCharts'
import './ChartCard.css'
import './BodyCompositionCard.css'

const SEGMENT_COLORS = ['#f59e0b', '#14b8a6', '#3b82f6']

function BodyCompositionCard() {
    const { bodyFatPercent, muscleMassPercent, waterPercent, basalMetabolism, classification } = bodyCompositionMock

    const chartData = [
        { name: 'Body Fat', value: bodyFatPercent },
        { name: 'Muscle Mass', value: muscleMassPercent },
        { name: 'Water', value: waterPercent }
    ]

    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <h3>Body Composition (FREE)</h3>
            </div>

            <div className="body-composition-body">
                <div className="body-composition-chart">
                    <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={44}
                                outerRadius={68}
                                paddingAngle={3}
                                cornerRadius={4}
                                stroke="var(--surface-color)"
                                strokeWidth={2}
                            >
                                {chartData.map((entry, idx) => (
                                    <Cell key={entry.name} fill={SEGMENT_COLORS[idx]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="body-composition-center">
                        <span className="body-composition-center-value">{classification}</span>
                    </div>
                </div>

                <ul className="body-composition-legend">
                    <li><span className="body-composition-dot" style={{ background: SEGMENT_COLORS[0] }} /> Body Fat <strong>{bodyFatPercent}%</strong></li>
                    <li><span className="body-composition-dot" style={{ background: SEGMENT_COLORS[1] }} /> Muscle Mass <strong>{muscleMassPercent}%</strong></li>
                    <li><span className="body-composition-dot" style={{ background: SEGMENT_COLORS[2] }} /> Water <strong>{waterPercent}%</strong></li>
                </ul>
            </div>

            <div className="chart-card-footer">
                <span className="chart-card-footer-label">Basal Metabolism</span>
                <span className="chart-card-footer-value">{basalMetabolism}</span>
            </div>
        </div>
    )
}

export default BodyCompositionCard
