/**
 * Translates body type from English to Spanish
 */
export function translateBodyType(bodyType: string | null | undefined): string {
    if (!bodyType) return 'No especificado'

    const translations: Record<string, string> = {
        'ectomorph': 'Ectomorfo',
        'mesomorph': 'Mesomorfo',
        'endomorph': 'Endomorfo'
    }

    return translations[bodyType.toLowerCase()] || bodyType
}

/**
 * Translates classification from English to Spanish
 */
export function translateClassification(classification: string | null | undefined): string {
    if (!classification) return 'N/A'

    const translations: Record<string, string> = {
        'high': 'Encima del Promedio',
        'medium': 'Promedio',
        'low': 'Debajo del Promedio'
    }

    return translations[classification] || classification
}

/**
 * Gets the badge CSS class for a classification
 */
export function getClassificationBadgeClass(classification: string | null | undefined): string {
    if (!classification) return 'badge-promedio'

    const classes: Record<string, string> = {
        'high': 'badge-encima',
        'medium': 'badge-promedio',
        'low': 'badge-debajo'
    }

    return classes[classification.toLowerCase()] || 'badge-promedio'
}

