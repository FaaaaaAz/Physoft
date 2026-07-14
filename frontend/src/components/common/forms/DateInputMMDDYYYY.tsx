import { useEffect, useRef, useState } from 'react'
import './DateInputMMDDYYYY.css'

interface DateInputMMDDYYYYProps {
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
 * Locale-independent MM/DD/YYYY (USA format) date input. Native
 * `<input type="date">` renders in the browser/OS locale's format, which
 * this app cannot control consistently across its Electron build and its
 * separately-deployed web build — so a fixed-order 3-segment control is
 * used instead. Exposes/accepts a plain ISO 'YYYY-MM-DD' string, same as a
 * native date input's `.value`.
 */
function DateInputMMDDYYYY({
    id,
    value,
    onChange,
    onBlur,
    required = false,
    disabled = false,
    min,
    max,
    className = ''
}: DateInputMMDDYYYYProps) {
    const parsed = parseIso(value)
    const [day, setDay] = useState(parsed.day)
    const [month, setMonth] = useState(parsed.month)
    const [year, setYear] = useState(parsed.year)

    const monthRef = useRef<HTMLInputElement>(null)
    const dayRef = useRef<HTMLInputElement>(null)
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

    const emitChange = (m: string, d: string, y: string) => {
        if (m.length === 2 && d.length === 2 && y.length === 4) {
            let iso = `${y}-${m}-${d}`
            if (min && iso < min) iso = min
            if (max && iso > max) iso = max
            onChange(iso)
        } else {
            onChange('')
        }
    }

    const handleMonthChange = (raw: string) => {
        const digits = raw.replace(/\D/g, '').slice(0, 2)
        setMonth(digits)
        emitChange(digits, day, year)
        if (digits.length === 2) dayRef.current?.focus()
    }

    const handleDayChange = (raw: string) => {
        const digits = raw.replace(/\D/g, '').slice(0, 2)
        setDay(digits)
        emitChange(month, digits, year)
        if (digits.length === 2) yearRef.current?.focus()
    }

    const handleYearChange = (raw: string) => {
        const digits = raw.replace(/\D/g, '').slice(0, 4)
        setYear(digits)
        emitChange(month, day, digits)
    }

    // Blur handlers read the live DOM value (e.target.value) rather than the
    // `month`/`day` state closures: a same-tick auto-advance focus() call
    // fires this blur before React commits the sibling segment's just-typed
    // state update, so the closure can be one keystroke stale.
    const handleMonthBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const clamped = clamp(e.target.value, 1, 12, 2)
        setMonth(clamped)
        emitChange(clamped, day, year)
    }

    const handleDayBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const clamped = clamp(e.target.value, 1, 31, 2)
        setDay(clamped)
        emitChange(month, clamped, year)
    }

    const handleYearBlur = () => {
        onBlur?.()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'month' | 'day' | 'year') => {
        if (e.key !== 'Backspace') return
        const target = e.target as HTMLInputElement
        if (target.value !== '') return
        if (field === 'day') monthRef.current?.focus()
        if (field === 'year') dayRef.current?.focus()
    }

    return (
        <div className={`date-mmddyyyy ${disabled ? 'date-mmddyyyy-disabled' : ''} ${className}`}>
            <div className="date-mmddyyyy-field">
                <input
                    ref={monthRef}
                    id={id}
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
                    className="date-mmddyyyy-segment date-mmddyyyy-month"
                    aria-label="Month"
                />
                <span className="date-mmddyyyy-field-label">MM</span>
            </div>
            <span className="date-mmddyyyy-sep">/</span>
            <div className="date-mmddyyyy-field">
                <input
                    ref={dayRef}
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
                    className="date-mmddyyyy-segment date-mmddyyyy-day"
                    aria-label="Day"
                />
                <span className="date-mmddyyyy-field-label">DD</span>
            </div>
            <span className="date-mmddyyyy-sep">/</span>
            <div className="date-mmddyyyy-field date-mmddyyyy-field-year">
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
                    className="date-mmddyyyy-segment date-mmddyyyy-year"
                    aria-label="Year"
                />
                <span className="date-mmddyyyy-field-label">YYYY</span>
            </div>
        </div>
    )
}

export default DateInputMMDDYYYY
