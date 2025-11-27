// Translation helpers for displaying data in Spanish

export const genderTranslations: Record<string, string> = {
    'Male': 'Masculino',
    'Female': 'Femenino',
    'Other': 'Otro'
}

export const bodyTypeTranslations: Record<string, string> = {
    'Mesomorph': 'Mesomorfo',
    'Ectomorph': 'Ectomorfo',
    'Endomorph': 'Endomorfo'
}

export function translateGender(gender: string): string {
    return genderTranslations[gender] || gender
}

export function translateBodyType(bodyType: string): string {
    return bodyTypeTranslations[bodyType] || bodyType
}
