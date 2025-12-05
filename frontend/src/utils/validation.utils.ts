/**
 * Valida formato de email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida formato de teléfono (flexible para diferentes formatos)
 */
export const isValidPhone = (phone: string): boolean => {
  // Acepta formatos: +54 9 11 1234-5678, 11-1234-5678, 1112345678, etc.
  const phoneRegex = /^[\d\s\-+()]{8,20}$/
  return phoneRegex.test(phone)
}

/**
 * Valida que una fecha no sea futura
 */
export const isNotFutureDate = (date: string): boolean => {
  if (!date) return true // Optional field
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(23, 59, 59, 999) // End of today
  return selectedDate <= today
}

/**
 * Valida que fecha de fin sea posterior a fecha de inicio
 */
export const isEndDateAfterStart = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true
  return new Date(endDate) > new Date(startDate)
}

/**
 * Valida rango numérico
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * Valida que un archivo sea de tipo imagen
 */
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  return validTypes.includes(file.type)
}

/**
 * Valida tamaño máximo de archivo (en MB)
 */
export const isValidFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Valida múltiples archivos de imágenes
 */
export const validateImageFiles = (
  files: File[],
  maxFiles: number = 10,
  maxSizeMB: number = 5
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (files.length > maxFiles) {
    errors.push(`Máximo ${maxFiles} archivos permitidos`)
  }

  files.forEach((file, index) => {
    if (!isValidImageFile(file)) {
      errors.push(`Archivo ${index + 1}: Tipo de archivo no válido (solo imágenes)`)
    }
    if (!isValidFileSize(file, maxSizeMB)) {
      errors.push(`Archivo ${index + 1}: Tamaño máximo ${maxSizeMB}MB excedido`)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Valida campos requeridos de un formulario
 */
export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; missingFields: string[] } => {
  const missingFields = requiredFields.filter(field => {
    const value = data[field]
    return !value || (typeof value === 'string' && value.trim() === '')
  })

  return {
    valid: missingFields.length === 0,
    missingFields
  }
}

/**
 * Valida formato de código de acceso de atleta
 */
export const isValidAccessCode = (code: string): boolean => {
  // Formato esperado: ATH-XXXXX (5 dígitos o letras)
  const codeRegex = /^ATH-[A-Z0-9]{5}$/
  return codeRegex.test(code)
}
