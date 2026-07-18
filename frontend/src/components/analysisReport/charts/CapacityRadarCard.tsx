import CapacityRadarChart from '../CapacityRadarChart'
import { radarAxesMock } from '../mockCapacityProfile'
import './ChartCard.css'

function CapacityRadarCard() {
    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <h3>Capacity Radar Profile</h3>
                <p>Strength, Power, Speed, Endurance, Flexibility, Mobility, Postural Control</p>
            </div>
            <CapacityRadarChart axes={radarAxesMock} size={340} />
        </div>
    )
}

export default CapacityRadarCard
