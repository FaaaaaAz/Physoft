import { useState, useCallback } from 'react'

export interface ValidationRule<T> {
    validate: (value: T) => boolean
    message: string
}

export type ValidationSchema<T> = {
    [K in keyof T]?: ValidationRule<T[K]>[]
}

export interface UseFormOptions<T> {
    initialValues: T
    validationSchema?: ValidationSchema<T>
    onSubmit?: (values: T) => void | Promise<void>
}

export interface UseFormReturn<T> {
    values: T
    errors: Partial<Record<keyof T, string>>
    touched: Partial<Record<keyof T, boolean>>
    isSubmitting: boolean
    isValid: boolean
    handleChange: (field: keyof T, value: any) => void
    handleBlur: (field: keyof T) => void
    handleSubmit: (e?: React.FormEvent) => Promise<void>
    setFieldValue: (field: keyof T, value: any) => void
    setFieldError: (field: keyof T, error: string) => void
    reset: () => void
    validateField: (field: keyof T) => boolean
    validateForm: () => boolean
}

export function useForm<T extends Record<string, any>>({
    initialValues,
    validationSchema,
    onSubmit
}: UseFormOptions<T>): UseFormReturn<T> {
    const [values, setValues] = useState<T>(initialValues)
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Validate a single field
    const validateField = useCallback((field: keyof T): boolean => {
        if (!validationSchema?.[field]) return true

        const rules = validationSchema[field]!
        const value = values[field]

        for (const rule of rules) {
            if (!rule.validate(value)) {
                setErrors(prev => ({ ...prev, [field]: rule.message }))
                return false
            }
        }

        setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
        })
        return true
    }, [values, validationSchema])

    // Validate entire form
    const validateForm = useCallback((): boolean => {
        if (!validationSchema) return true

        let isValid = true
        const newErrors: Partial<Record<keyof T, string>> = {}

        for (const field in validationSchema) {
            const rules = validationSchema[field]!
            const value = values[field]

            for (const rule of rules) {
                if (!rule.validate(value)) {
                    newErrors[field] = rule.message
                    isValid = false
                    break
                }
            }
        }

        setErrors(newErrors)
        return isValid
    }, [values, validationSchema])

    // Handle field change
    const handleChange = useCallback((field: keyof T, value: any) => {
        setValues(prev => ({ ...prev, [field]: value }))

        // Validate on change if field was touched
        if (touched[field] && validationSchema?.[field]) {
            setTimeout(() => validateField(field), 0)
        }
    }, [touched, validationSchema, validateField])

    // Handle field blur
    const handleBlur = useCallback((field: keyof T) => {
        setTouched(prev => ({ ...prev, [field]: true }))
        validateField(field)
    }, [validateField])

    // Handle form submission
    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault()
        }

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key as keyof T] = true
            return acc
        }, {} as Partial<Record<keyof T, boolean>>)
        setTouched(allTouched)

        // Validate form
        const isValid = validateForm()
        if (!isValid) {
            return
        }

        // Submit
        if (onSubmit) {
            setIsSubmitting(true)
            try {
                await onSubmit(values)
            } finally {
                setIsSubmitting(false)
            }
        }
    }, [values, validateForm, onSubmit])

    // Set field value programmatically
    const setFieldValue = useCallback((field: keyof T, value: any) => {
        setValues(prev => ({ ...prev, [field]: value }))
    }, [])

    // Set field error programmatically
    const setFieldError = useCallback((field: keyof T, error: string) => {
        setErrors(prev => ({ ...prev, [field]: error }))
    }, [])

    // Reset form
    const reset = useCallback(() => {
        setValues(initialValues)
        setErrors({})
        setTouched({})
        setIsSubmitting(false)
    }, [initialValues])

    // Check if form is valid
    const isValid = Object.keys(errors).length === 0

    return {
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldError,
        reset,
        validateField,
        validateForm
    }
}
