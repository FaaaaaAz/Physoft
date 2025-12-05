/**
 * Calcula la edad a partir de una fecha de nacimiento
 */
export const calculateAgeFromDate = (birthDate: string | Date): number => {
  if (!birthDate) return 0

  const birth = new Date(birthDate)
  const today = new Date()
  
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return Math.max(age, 0)
}

/**
 * Transforma datos de atleta del backend al formato de visualización
 */
export const transformAthleteForDisplay = (atleta: any) => {
  return {
    id: atleta.id,
    nombre: atleta.name,
    foto: atleta.photo || '/default-avatar.png',
    deporte: atleta.sport,
    edad: calculateAgeFromDate(atleta.birthDate),
    nacionalidad: atleta.nationality || 'No especificado',
    altura: atleta.height,
    peso: atleta.weight,
    club: atleta.club || atleta.position || 'Sin equipo',
    somatotipo: atleta.bodyType,
    codigoAcceso: atleta.accessCode,
    capacidades: {
      potencia: 75, // Default - será reemplazado con datos reales
      fuerza: 75,
      velocidad: 75,
      flexibilidad: 75,
      resistencia: 75
    }
  }
}

/**
 * Filtra atletas por búsqueda de texto
 */
export const filterAthletesBySearch = <T extends { nombre?: string; name?: string; codigoAcceso?: string; accessCode?: string }>(
  athletes: T[],
  searchQuery: string
): T[] => {
  if (!searchQuery.trim()) return athletes

  const query = searchQuery.toLowerCase()
  
  return athletes.filter(athlete => {
    const name = (athlete.nombre || athlete.name || '').toLowerCase()
    const code = (athlete.codigoAcceso || athlete.accessCode || '').toLowerCase()
    
    return name.includes(query) || code.includes(query)
  })
}

/**
 * Filtra atletas por deporte
 */
export const filterAthletesBySport = <T extends { deporte?: string; sport?: string }>(
  athletes: T[],
  sport: string
): T[] => {
  if (!sport || sport === 'Todos') return athletes
  
  return athletes.filter(athlete => {
    const athleteSport = athlete.deporte || athlete.sport
    return athleteSport === sport
  })
}

/**
 * Obtiene lista única de deportes de un array de atletas
 */
export const getUniqueSports = <T extends { deporte?: string; sport?: string }>(
  athletes: T[]
): string[] => {
  const sportsSet = new Set(
    athletes.map(a => a.deporte || a.sport).filter(Boolean) as string[]
  )
  return ['Todos', ...Array.from(sportsSet).sort()]
}

/**
 * Calcula el promedio de capacidades físicas
 */
export const calculateCapacitiesAverage = (capacidades: {
  potencia: number
  fuerza: number
  velocidad: number
  flexibilidad: number
  resistencia: number
}): number => {
  const values = Object.values(capacidades)
  const sum = values.reduce((acc, val) => acc + val, 0)
  return Math.round(sum / values.length)
}

/**
 * Genera código de acceso único para atleta
 */
export const generateAccessCode = (name: string, index: number): string => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 3)
  
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `ATH-${initials}${randomNum + index}`
}
