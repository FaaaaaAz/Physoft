import { useEffect, useRef, useState } from 'react'
import './DateInputDDMMYYYY.css'

interface DateInputDDMMYYYYProps {
    id?: string
    value: string | null | undefined  // 'YYYY-MM-DD' or ''
    onChange: (isoDate: string) => void
    onBlur?: () => void
    required?: boolean
    disabled?: boolean
    min?: string  // ISO 'YYYY-MM-DD'
    max?: string  // ISO 'YYYY-MM-DD'
    className?: string
}

function parseIso(value: string | null | undefined): { day: string; month: string; year: string } {
    if (!value) return { day: '', month: '', year: '' }
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
    if (!match) return { day: '', month: '', year: '' }
    return { year: match[1], month: match[2], day: match[3] }
}

function clamp(value: string, min: number, max: number, digits: number): string {
    if (value === '') return value
    const num = parseInt(value, 10)
    if (isNaN(num)) return ''
    const clamped = Math.min(Math.max(num, min), max)
    return String(clamped).padStart(digits, '0')
}

/**
 * Locale-independent DD/MM/YYYY date input. Native `<input type="date">`
 * renders in the browser/OS locale's format, which this app cannot control
 * consistently across its Electron build and its separately-deployed web
 * build — so a fixed-order 3-segment control is used instead. Exposes/accepts
 * a plain ISO 'YYYY-MM-DD' string, same as a native date input's `.value`.
 */
function DateInputDDMMYYYY({
    id,
    value,
    onChange,
    onBlur,
    required = false,
    disabled = false,
    min,
    max,
    className = ''
}: DateInputDDMMYYYYProps) {
    const parsed = parseIso(value)
    const [day, setDay] = useState(parsed.day)
    const [month, setMonth] = useState(parsed.month)
    const [year, setYear] = useState(parsed.year)

    const dayRef = useRef<HTMLInputElement>(null)
    const monthRef = useRef<HTMLInputElement>(null)
    const yearRef = useRef<HTMLInputElement>(null)

    // Keep local segments in sync when the value changes externally
    // (e.g. loading an existing record).
    useEffect(() => {
        const next = parseIso(value)
        setDay(next.day)
        setMonth(next.month)
        setYear(next.year)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const emitChange = (d: string, m: string, y: string) => {
        if (d.length === 2 && m.length === 2 && y.length === 4) {
            let iso = `${y}-${m}-${d}`
            if (min && iso < min) iso = min
            if (max && iso > max) iso = max
            onChange(iso)
        } else {
            onChange('')
        }
    }

    const handleDayChange = (raw: string) => {
        const digits = raw.replace(/\D/g, '').slice(0, 2)
        setDay(digits)
        emitChange(digits, month, year)
        if (digits.length === 2) monthRef.current?.focus()
    }

    const handleMonthChange = (raw: string) => {
        const digits = raw.replace(/\D/g, '').slice(0, 2)
        setMonth(digits)
        emitChange(day, digits, year)
        if (digits.length === 2) yearRef.current?.focus()
    }

    const handleYearChange = (raw: string) => {
        const digits = raw.replace(/\D/g, '').slice(0, 4)
        setYear(digits)
        emitChange(day, month, digits)
    }

    const handleDayBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const clamped = clamp(e.target.value, 1, 31, 2)
        setDay(clamped)
        emitChange(clamped, month, year)
    }

    const handleMonthBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const clamped = clamp(e.target.value, 1, 12, 2)
        setMonth(clamped)
        emitChange(day, clamped, year)
    }

    const handleYearBlur = () => {
        onBlur?.()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'day' | 'month' | 'year') => {
        if (e.key !== 'Backspace') return
        const target = e.target as HTMLInputElement
        if (target.value !== '') return
        if (field === 'month') dayRef.current?.focus()
        if (field === 'year') monthRef.current?.focus()
    }

    return (
        <div className={`date-ddmmyyyy ${disabled ? 'date-ddmmyyyy-disabled' : ''} ${className}`}>
            <input
                ref={dayRef}
                id={id}
                type="text"
                inputMode="numeric"
                placeholder="DD"
                maxLength={2}
                value={day}
                disabled={disabled}
                required={required}
                onChange={(e) => handleDayChange(e.target.value)}
                onBlur={handleDayBlur}
                onKeyDown={(e) => handleKeyDown(e, 'day')}
                className="date-ddmmyyyy-segment date-ddmmyyyy-day"
                aria-label="Day"
            />
            <span className="date-ddmmyyyy-sep">/</span>
            <input
                ref={monthRef}
                type="text"
                inputMode="numeric"
                placeholder="MM"
                maxLength={2}
                value={month}
                disabled={disabled}
                required={required}
                onChange={(e) => handleMonthChange(e.target.value)}
                onBlur={handleMonthBlur}
                onKeyDown={(e) => handleKeyDown(e, 'month')}
                className="date-ddmmyyyy-segment date-ddmmyyyy-month"
                aria-label="Month"
            />
            <span className="date-ddmmyyyy-sep">/</span>
            <input
                ref={yearRef}
                type="text"
                inputMode="numeric"
                placeholder="YYYY"
                maxLength={4}
                value={year}
                disabled={disabled}
                required={required}
                onChange={(e) => handleYearChange(e.target.value)}
                onBlur={handleYearBlur}
                onKeyDown={(e) => handleKeyDown(e, 'year')}
                className="date-ddmmyyyy-segment date-ddmmyyyy-year"
                aria-label="Year"
            />
        </div>
    )
}

export default DateInputDDMMYYYY
