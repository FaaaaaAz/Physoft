// ============================================
// TYPES: Form related types
// ============================================

export interface ValidationRule<T> {
    validate: (value: T) => boolean
    message: string
}

export type ValidationSchema<T> = {
    [K in keyof T]?: ValidationRule<T[K]>[]
}

export interface FormState<T> {
    values: T
    errors: Partial<Record<keyof T, string>>
    touched: Partial<Record<keyof T, boolean>>
    isSubmitting: boolean
}

export type MessageType = 'success' | 'error' | 'warning' | 'info'

export interface Message {
    type: MessageType
    text: string
}
