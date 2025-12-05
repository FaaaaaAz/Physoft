# Custom Hooks Documentation

This directory contains reusable custom React hooks for the Physoft application.

## Hooks Overview

### 🏃 **useAthletes**
Manages athlete data fetching and state.

#### `useAthletes()`
Fetches all athletes from the API.

**Returns:**
```typescript
{
  athletes: Athlete[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}
```

**Usage:**
```tsx
const { athletes, loading, error, refetch } = useAthletes()
```

#### `useAthlete(id, enabled?)`
Fetches a single athlete by ID.

**Parameters:**
- `id: string | undefined` - Athlete ID
- `enabled?: boolean` - Whether to fetch automatically (default: true)

**Returns:**
```typescript
{
  athlete: Athlete | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}
```

**Usage:**
```tsx
const { athlete, loading } = useAthlete(athleteId)
```

---

### 📊 **useAnalyses**
Manages analysis data fetching and state.

#### `useAnalyses({ athleteId?, enabled? })`
Fetches analyses, optionally filtered by athlete.

**Parameters:**
```typescript
{
  athleteId?: string
  enabled?: boolean  // default: true
}
```

**Returns:**
```typescript
{
  analyses: Analysis[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}
```

**Usage:**
```tsx
// All analyses
const { analyses } = useAnalyses()

// Filtered by athlete
const { analyses } = useAnalyses({ athleteId: 'xxx' })
```

#### `useAnalysis(id, enabled?)`
Fetches a single analysis by ID.

**Parameters:**
- `id: number | undefined` - Analysis ID
- `enabled?: boolean` - Whether to fetch automatically (default: true)

**Returns:**
```typescript
{
  analysis: Analysis | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}
```

#### `useAthleteAnalyses(athleteId)`
Convenience hook that fetches analyses for a specific athlete and provides additional computed values.

**Parameters:**
- `athleteId: string | undefined` - Athlete ID

**Returns:**
```typescript
{
  analyses: Analysis[]
  loading: boolean
  error: string | null
  latestAnalysis: Analysis | null
  totalAnalyses: number
}
```

**Usage:**
```tsx
const { latestAnalysis, totalAnalyses } = useAthleteAnalyses(athleteId)
```

---

### ⬟ **usePentagonChart**
Calculates pentagon chart coordinates for visualizing physical capacities.

#### `usePentagonChart(capacidades, config?)`
Computes SVG pentagon chart data for 5 physical capacities.

**Parameters:**
```typescript
capacidades: {
  potencia: number      // 0-100
  fuerza: number        // 0-100
  velocidad: number     // 0-100
  flexibilidad: number  // 0-100
  resistencia: number   // 0-100
}

config?: {
  centerX?: number      // default: 150
  centerY?: number      // default: 150
  maxRadius?: number    // default: 120
  labelOffset?: number  // default: 30
}
```

**Returns:**
```typescript
{
  points: PentagonPoint[]     // Array of 5 points with x, y, labelX, labelY, nombre, valor
  pointsPath: string          // SVG polygon points string
  backgroundPath: string      // SVG polygon points for 100% outline
}
```

**Usage:**
```tsx
const capacidades = {
  potencia: 85,
  fuerza: 70,
  velocidad: 90,
  flexibilidad: 65,
  resistencia: 80
}

const { points, pointsPath, backgroundPath } = usePentagonChart(capacidades)

return (
  <svg width="300" height="300">
    <polygon points={backgroundPath} fill="none" stroke="#ccc" />
    <polygon points={pointsPath} fill="rgba(20,184,166,0.3)" stroke="#14b8a6" />
    {points.map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r="5" fill="#14b8a6" />
    ))}
  </svg>
)
```

#### `usePentagonGuideLines(config?)`
Generates guide lines for 20%, 40%, 60%, 80%, 100% levels.

**Returns:** `string[]` - Array of 5 SVG polygon point strings

**Usage:**
```tsx
const guideLines = usePentagonGuideLines()

return (
  <svg>
    {guideLines.map((path, i) => (
      <polygon key={i} points={path} fill="none" stroke="rgba(255,255,255,0.1)" />
    ))}
  </svg>
)
```

#### `usePentagonRadialLines(config?)`
Generates radial lines from center to each vertex.

**Returns:** 
```typescript
Array<{
  x1: number
  y1: number
  x2: number
  y2: number
}>
```

**Usage:**
```tsx
const radialLines = usePentagonRadialLines()

return (
  <svg>
    {radialLines.map((line, i) => (
      <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
    ))}
  </svg>
)
```

---

## Migration Guide

### Before (without hooks):
```tsx
function AtletaModal({ atleta }) {
  const [loading, setLoading] = useState(true)
  const [athlete, setAthlete] = useState(null)

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        setLoading(true)
        const res = await athleteAPI.getById(atleta.id)
        setAthlete(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAthlete()
  }, [atleta.id])

  // Manual pentagon calculation...
  const calculatePentagon = () => {
    const centerX = 150
    const centerY = 150
    // ... 50 lines of math ...
  }
}
```

### After (with hooks):
```tsx
function AtletaModal({ atleta }) {
  const { athlete, loading } = useAthlete(atleta.id)
  const { points, pointsPath } = usePentagonChart(atleta.capacidades)

  // Clean, declarative rendering
}
```

---

## Benefits

✅ **DRY Principle** - No code duplication across components  
✅ **Separation of Concerns** - Logic separated from UI  
✅ **Reusability** - Same hooks used in multiple components  
✅ **Performance** - Memoized calculations with `useMemo`  
✅ **Type Safety** - Full TypeScript support  
✅ **Maintainability** - Single source of truth for data fetching  
✅ **Testability** - Hooks can be tested independently  

---

## Components Using These Hooks

- ✅ **AtletaModal** - `usePentagonChart`
- ✅ **AtletaAnalisisModal** - `usePentagonChart`, `usePentagonGuideLines`, `usePentagonRadialLines`
- ✅ **AtletaSelectionModal** - `useAthletes`, `useAnalyses`
- ✅ **DetalleAtleta** - `usePentagonChart`, `usePentagonGuideLines`, `usePentagonRadialLines`
- ⏳ **TodosAnalisis** - Can use `useAthletes`, `useAnalyses`
- ⏳ **NuevoAnalisis** - Can use `useAthletes`
- ⏳ **AnalysisView** - Can use `useAnalysis`
- ⏳ **Dashboard** - Can use `useAthletes`, `useAnalyses`

---

## Future Enhancements

- Add caching with React Query or SWR
- Implement optimistic updates
- Add request cancellation
- Add pagination support
- Add sorting and filtering helpers
- Create `useDebounce` hook for search
- Create `useFilters` and `useSort` hooks
