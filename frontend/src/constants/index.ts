// ============================================
// CONSTANTS: Application-wide constants
// ============================================

export const APP_CONFIG = {
    NAME: 'Physoft',
    VERSION: '1.0.0',
    API_TIMEOUT: 10000,
} as const

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    ALL_PATIENTS: '/patients',
    ADD_ATHLETE: '/add-athlete',
    ATHLETE_DETAIL: '/athlete/:id',
    ASSESSMENTS: '/analysis',
    NEW_ANALYSIS: '/new-analysis',
    ALL_ANALYSES: '/all-analyses',
    ANALYSIS_VIEW: '/analysis/:id',
    ANALYTICS: '/analytics',
    REPORTS: '/reports',
    PROTOCOLS: '/protocols',
    ASSISTANT: '/assistant',
    SETTINGS: '/settings',
    PROFILE: '/profile',
} as const

export const GENDERS = {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other',
} as const

export const BODY_TYPES = {
    ECTOMORPH: 'Ectomorph',
    MESOMORPH: 'Mesomorph',
    ENDOMORPH: 'Endomorph',
} as const

export const BODY_TYPE_LABELS = {
    [BODY_TYPES.ECTOMORPH]: 'Ectomorph (Lean)',
    [BODY_TYPES.MESOMORPH]: 'Mesomorph (Athletic)',
    [BODY_TYPES.ENDOMORPH]: 'Endomorph (Robust)',
} as const

export const GENDER_LABELS = {
    [GENDERS.MALE]: 'Male',
    [GENDERS.FEMALE]: 'Female',
    [GENDERS.OTHER]: 'Other',
} as const

export const VALIDATION = {
    MIN_NAME_LENGTH: 3,
    MAX_NAME_LENGTH: 100,
    MIN_HEIGHT: 1.64, // feet (~50cm)
    MAX_HEIGHT: 8.2,  // feet (~250cm)
    MIN_WEIGHT: 44,   // pounds (~20kg)
    MAX_WEIGHT: 661,  // pounds (~300kg)
    MIN_AGE: 5,
    MAX_AGE: 100,
    MAX_IMAGE_SIZE_MB: 5,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MIN_PASSWORD_LENGTH: 8,
} as const

export const MESSAGES = {
    SUCCESS: {
        ATHLETE_CREATED: 'Patient created successfully',
        ATHLETE_UPDATED: 'Patient updated successfully',
        ATHLETE_DELETED: 'Patient deleted successfully',
        ANALYSIS_CREATED: 'Assessment created successfully',
        ANALYSIS_UPDATED: 'Assessment updated successfully',
        ANALYSIS_DELETED: 'Assessment deleted successfully',
        PASSWORD_CHANGED: 'Password changed successfully',
    },
    ERROR: {
        UNKNOWN: 'An unknown error occurred',
        NETWORK: 'Network error. Please check your connection',
        LOADING_ATHLETES: 'Could not load patients from server',
        LOADING_ATHLETE: 'Could not load patient details',
        LOADING_ANALYSES: 'Could not load assessments',
        CREATING_ATHLETE: 'Error creating patient',
        UPDATING_ATHLETE: 'Error updating patient',
        DELETING_ATHLETE: 'Error deleting patient',
        DELETING_ANALYSIS: 'Error deleting assessment',
        LOGIN_FAILED: 'Invalid email or password',
        PASSWORDS_DO_NOT_MATCH: 'New password and confirmation do not match',
    },
    CONFIRM: {
        DELETE_ATHLETE: 'Are you sure you want to delete this patient? This will also delete all of their assessments.',
        DELETE_ANALYSIS: 'Are you sure you want to delete this assessment?',
        LOGOUT: 'Are you sure you want to log out?',
    },
} as const

export const DEBOUNCE_DELAY = {
    SEARCH: 300,
    FILTER: 200,
    RESIZE: 150,
} as const

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const
