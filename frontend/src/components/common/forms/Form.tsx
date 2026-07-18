import React, { createContext, useContext } from 'react'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'
import DateInputMMDDYYYY from './DateInputMMDDYYYY'
import { ButtonLoadingContent } from '../feedback/ButtonSpinner'

// Context for Form
interface FormContextValue {
    values: Record<string, any>
    errors: Record<string, string>
    touched: Record<string, boolean>
    isSubmitting: boolean
    handleChange: (field: string, value: any) => void
    handleBlur: (field: string) => void
}

const FormContext = createContext<FormContextValue | null>(null)

const useFormContext = () => {
    const context = useContext(FormContext)
    if (!context) {
        throw new Error('Form compound components must be used within Form')
    }
    return context
}

// Main Form Component
interface FormProps {
    children: React.ReactNode
    onSubmit: (e: React.FormEvent) => void
    className?: string
    values: Record<string, any>
    errors: Record<string, string>
    touched: Record<string, boolean>
    isSubmitting: boolean
    handleChange: (field: string, value: any) => void
    handleBlur: (field: string) => void
}

function FormRoot({
    children,
    onSubmit,
    className = '',
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur
}: FormProps) {
    return (
        <FormContext.Provider
            value={{
                values,
                errors,
                touched,
                isSubmitting,
                handleChange,
                handleBlur
            }}
        >
            <form onSubmit={onSubmit} className={className}>
                {children}
            </form>
        </FormContext.Provider>
    )
}

// Form Section Component
interface SectionProps {
    children: React.ReactNode
    title: string
    icon?: React.ReactNode
    className?: string
    collapsible?: boolean
    defaultExpanded?: boolean
}

function Section({
    children,
    title,
    icon,
    className = '',
    collapsible = false,
    defaultExpanded = true
}: SectionProps) {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

    const toggleExpanded = () => {
        if (collapsible) {
            setIsExpanded(!isExpanded)
        }
    }

    return (
        <div className={`form-section ${className}`}>
            <h3
                className={collapsible ? 'collapsible' : ''}
                onClick={toggleExpanded}
                style={{ cursor: collapsible ? 'pointer' : 'default' }}
            >
                {icon} {title}
                {collapsible && (
                    <span className="collapse-icon">
                        {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
                    </span>
                )}
            </h3>
            {isExpanded && children}
        </div>
    )
}

// Form Row Component
interface RowProps {
    children: React.ReactNode
    className?: string
}

function Row({ children, className = '' }: RowProps) {
    return <div className={`form-row ${className}`}>{children}</div>
}

// Form Field Component
interface FieldProps {
    name: string
    label: string
    type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'date-mmddyyyy' | 'select'
    placeholder?: string
    required?: boolean
    disabled?: boolean
    icon?: React.ReactNode
    min?: number | string
    max?: number | string
    step?: number | string
    options?: Array<{ value: string; label: string }>
    className?: string
}

function Field({
    name,
    label,
    type = 'text',
    placeholder,
    required = false,
    disabled = false,
    icon,
    min,
    max,
    step,
    options,
    className = ''
}: FieldProps) {
    const { values, errors, touched, handleChange, handleBlur } = useFormContext()

    const value = values[name] ?? ''
    const error = touched[name] && errors[name]

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newValue = type === 'number' ? Number(e.target.value) : e.target.value
        handleChange(name, newValue)
    }

    const handleInputBlur = () => {
        handleBlur(name)
    }

    return (
        <div className={`form-group ${error ? 'has-error' : ''} ${className}`}>
            <label htmlFor={name}>
                {icon} {label} {required && '*'}
            </label>

            {type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    required={required}
                    disabled={disabled}
                >
                    {options?.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : type === 'date-mmddyyyy' ? (
                <DateInputMMDDYYYY
                    id={name}
                    value={value}
                    onChange={(isoDate) => handleChange(name, isoDate)}
                    onBlur={handleInputBlur}
                    required={required}
                    disabled={disabled}
                    min={min as string}
                    max={max as string}
                />
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    min={min}
                    max={max}
                    step={step}
                />
            )}

            {error && <span className="field-error">{error}</span>}
        </div>
    )
}

// Form Actions Component
interface ActionsProps {
    children: React.ReactNode
    className?: string
}

function Actions({ children, className = '' }: ActionsProps) {
    return <div className={`form-actions ${className}`}>{children}</div>
}

// Submit Button Component
interface SubmitButtonProps {
    children: React.ReactNode
    loadingText?: string
    className?: string
    icon?: React.ReactNode
}

function SubmitButton({
    children,
    loadingText = 'Saving...',
    className = '',
    icon
}: SubmitButtonProps) {
    const { isSubmitting } = useFormContext()

    return (
        <button
            type="submit"
            className={`btn-primary ${className}`}
            disabled={isSubmitting}
        >
            {isSubmitting ? (
                <ButtonLoadingContent text={loadingText} />
            ) : (
                <>{icon} {children}</>
            )}
        </button>
    )
}

// Compound Component Pattern
export const Form = Object.assign(FormRoot, {
    Section,
    Row,
    Field,
    Actions,
    SubmitButton
})
