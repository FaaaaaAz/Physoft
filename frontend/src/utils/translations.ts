// Translation helpers for displaying data (English)

export const genderTranslations: Record<string, string> = {
    'Male': 'Male',
    'Female': 'Female',
    'Other': 'Other'
}

export const bodyTypeTranslations: Record<string, string> = {
    'Mesomorph': 'Mesomorph (Athletic)',
    'Ectomorph': 'Ectomorph (Lean)',
    'Endomorph': 'Endomorph (Robust)'
}

export function translateGender(gender: string): string {
    return genderTranslations[gender] || gender
}

export function translateBodyType(bodyType: string): string {
    return bodyTypeTranslations[bodyType] || bodyType
}
