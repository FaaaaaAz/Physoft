import './CircularProgress.css'

interface CircularProgressProps {
    value: number
    max?: number
    size?: number
    strokeWidth?: number
    color?: string
    label?: string
    className?: string
}

/**
 * Reusable SVG circular gauge. Shows `{value}/{max}` in the center with an
 * optional label underneath (e.g. a classification status).
 */
function CircularProgress({
    value,
    max = 100,
    size = 160,
    strokeWidth = 14,
    color = 'var(--color-primary, #14b8a6)',
    label,
    className = ''
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const percentage = Math.min(Math.max(value / max, 0), 1)
    const dashOffset = circumference * (1 - percentage)
    const center = size / 2

    return (
        <div className={`circular-progress ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    transform={`rotate(-90 ${center} ${center})`}
                    className="circular-progress-arc"
                />
            </svg>
            <div className="circular-progress-center">
                <span className="circular-progress-value">
                    {value}<span className="circular-progress-max">/{max}</span>
                </span>
                {label && (
                    <span className="circular-progress-label" style={{ color }}>
                        {label}
                    </span>
                )}
            </div>
        </div>
    )
}

export default CircularProgress
