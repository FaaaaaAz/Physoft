/**
 * Crea un objeto FormData para envío multipart con imágenes
 */
export const createFormDataWithImages = (
  data: Record<string, any>,
  imageFiles: File[],
  imageFieldName: string = 'images'
): FormData => {
  const formData = new FormData()

  // Agregar archivos de imágenes
  imageFiles.forEach(file => {
    formData.append(imageFieldName, file)
  })

  // Agregar otros campos (excluir el campo de imágenes)
  Object.entries(data).forEach(([key, value]) => {
    if (key === imageFieldName) return

    if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, String(value))
    }
  })

  return formData
}

/**
 * Resetea un formulario a sus valores iniciales
 */
export const resetForm = <T extends Record<string, any>>(
  initialValues: T,
  setFormData: (data: T) => void
): void => {
  setFormData(initialValues)
}

/**
 * Actualiza un campo nested en el estado del formulario
 */
export const updateNestedField = <T extends Record<string, any>>(
  formData: T,
  parentKey: string,
  childKey: string,
  value: any
): T => {
  return {
    ...formData,
    [parentKey]: {
      ...(formData[parentKey] as Record<string, any>),
      [childKey]: value
    }
  }
}

/**
 * Actualiza un elemento en un array del formulario
 */
export const updateArrayField = <T extends Record<string, any>>(
  formData: T,
  arrayKey: string,
  index: number,
  value: any
): T => {
  const array = [...(formData[arrayKey] as any[])]
  array[index] = value
  return {
    ...formData,
    [arrayKey]: array
  }
}

/**
 * Cuenta campos completados en un formulario
 */
export const countCompletedFields = (data: Record<string, any>): number => {
  return Object.values(data).filter(value => {
    if (typeof value === 'string') return value.trim() !== ''
    if (typeof value === 'number') return value !== 0
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== '' && v !== 0)
    }
    return !!value
  }).length
}

/**
 * Calcula porcentaje de progreso del formulario
 */
export const calculateFormProgress = (
  data: Record<string, any>,
  totalFields: number
): number => {
  const completed = countCompletedFields(data)
  return Math.round((completed / totalFields) * 100)
}

/**
 * Sanitiza input de texto
 */
export const sanitizeTextInput = (text: string): string => {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/[<>]/g, '') // Remove potential HTML tags
}

/**
 * Genera ID único para items dinámicos (puntos débiles, etc.)
 */
export const generateUniqueId = (() => {
  let counter = 1
  return () => counter++
})()
