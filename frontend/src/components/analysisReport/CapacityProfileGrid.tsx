import { IoFitnessOutline } from 'react-icons/io5'
import { STATUS_COLORS } from './mockExecutiveSummary'
import { capacityProfileMock, type CapacityItem } from './mockCapacityProfile'
import './CapacityProfileGrid.css'

function CapacityCard({ item }: { item: CapacityItem }) {
    const Icon = item.icon
    const color = STATUS_COLORS[item.status]
    const percentage = Math.min(Math.max((item.value / item.maxValue) * 100, 0), 100)

    return (
        <div className="capacity-profile-card">
            <div className="capacity-profile-icon" style={{ color, background: `${color}1a` }}>
                <Icon />
            </div>
            <span className="capacity-profile-label">{item.label}</span>
            <span className="capacity-profile-value">
                {item.value}<span className="capacity-profile-max">/{item.maxValue}</span>
            </span>
            <div className="capacity-profile-bar">
                <div className="capacity-profile-bar-fill" style={{ width: `${percentage}%`, background: color }} />
            </div>
            <span className="capacity-profile-status" style={{ color }}>{item.status}</span>
        </div>
    )
}

/**
 * Grid of capacity cards (Strength, Power, Speed, Endurance, Flexibility,
 * Mobility, Postural Control, FREE Composition). Data from mockCapacityProfile.ts.
 */
function CapacityProfileGrid() {
    return (
        <section className="analysis-section">
            <h2>
                <IoFitnessOutline /> Capacity Profile
            </h2>

            <div className="capacity-profile-grid">
                {capacityProfileMock.map((item) => (
                    <CapacityCard key={item.key} item={item} />
                ))}
            </div>
        </section>
    )
}

export default CapacityProfileGrid
