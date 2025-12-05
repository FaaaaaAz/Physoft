# 🏗️ Plan de Refactorización Completo - Physoft

**Fecha**: 3 Diciembre 2025  
**Objetivo**: Reorganizar el código siguiendo principios SOLID, DRY y arquitectura limpia

---

## 📊 Análisis de Problemas Actuales

### 🔴 Problemas Críticos Identificados

#### 1. **Componentes Gigantes con Demasiada Responsabilidad**
- `FormularioAnalisis.tsx`: **868 líneas** - Formulario monolítico con 7 bloques
- `NuevoAnalisis.tsx`: **831 líneas** - Lógica de IA, formularios, validación todo mezclado
- `DetalleAtleta.tsx`: **568 líneas** - Vista, lógica de datos, gráficos
- `TodosAnalisis.tsx`: **344 líneas** - Tabla, filtros, ordenamiento, paginación
- `Dashboard.tsx`: **175 líneas** - Búsqueda, filtros, transformaciones

**Problema**: Viola el Principio de Responsabilidad Única (SRP)

#### 2. **Duplicación de Lógica**
```tsx
// Patrón repetido en 5+ archivos:
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [data, setData] = useState([])

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true)
      const response = await api.getData()
      setData(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  loadData()
}, [])
```

**Archivos afectados**:
- `NuevoAnalisis.tsx` (loadAthletes - 19 líneas)
- `Dashboard.tsx` (cargarAtletas - 18 líneas)
- `TodosAnalisis.tsx` (loadData - 31 líneas)
- `DetalleAtleta.tsx` (cargarDatos - ya migrado a hooks ✅)

#### 3. **Componentes UI que Deberían Ser Reutilizables**

**Filtros y Búsqueda** (código duplicado):
```tsx
// En Dashboard.tsx, TodosAnalisis.tsx, Analisis.tsx, AtletaSelectionModal.tsx
<div className="search-container">
  <IoSearch className="search-icon" />
  <input
    type="text"
    placeholder="Buscar..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
  />
</div>
```

**Tablas** (3 variaciones similares):
- `TodosAnalisis.tsx` - Tabla de atletas con análisis
- `Analisis.tsx` - Tabla de análisis recientes
- `DetalleAtleta.tsx` - Tabla de historial

**Paginación** (duplicado):
- `TodosAnalisis.tsx` - Implementación completa
- Podría reutilizarse en otros listados

#### 4. **Lógica de Negocio en Componentes**

**Ejemplo**: FormularioAnalisis.tsx tiene 9 handlers de formulario:
```tsx
const handleChange = (field: string, value: any) => { ... }
const handleNestedChange = (parent: string, field: string, value: any) => { ... }
const handleArrayChange = (field: string, index: number, value: string) => { ... }
const handleHerramientaToggle = (herramienta: string) => { ... }
const handleGuardarBorrador = async () => { ... }
const handleSubmit = (e: React.FormEvent) => { ... }
// + 3 más
```

**Problema**: Lógica de formularios debería estar en un custom hook

#### 5. **Transformaciones de Datos Repetidas**

**Clasificación**:
```tsx
// Duplicado en 3 archivos
const getBadgeClass = (clasificacion: string) => {
  if (clasificacion === 'high') return 'badge-encima'
  if (clasificacion === 'medium') return 'badge-promedio'
  return 'badge-debajo'
}

const getClassificationLabel = (clasificacion: string) => {
  if (clasificacion === 'high') return 'Encima del Promedio'
  // ...
}
```

**Cálculo de Edad**:
```tsx
// Duplicado en Dashboard.tsx y potencialmente otros
let edad = 0
if (atleta.birthDate) {
  const birthDate = new Date(atleta.birthDate)
  const today = new Date()
  edad = today.getFullYear() - birthDate.getFullYear()
  // ... lógica de meses
}
```

#### 6. **Sin Validación de Formularios Centralizada**

Cada formulario tiene su propia validación inline:
- `AgregarAtleta.tsx`: Validación en `handleSubmit`
- `NuevoAnalisis.tsx`: Validación dispersa
- `FormularioAnalisis.tsx`: Sin validación (solo required HTML)

#### 7. **Falta de Tipado Consistente**

```tsx
// ❌ Tipos duplicados y desorganizados
interface AtletaMostrado { ... } // En Dashboard
interface AtletaConAnalisis { ... } // En TodosAnalisis
interface PuntoDebil { ... } // En NuevoAnalisis
```

---

## 🎯 Arquitectura Propuesta

```
frontend/src/
├── hooks/                          # Custom Hooks (EXISTENTE ✅)
│   ├── useAthletes.ts             ✅ DONE
│   ├── useAnalyses.ts             ✅ DONE
│   ├── usePentagonChart.ts        ✅ DONE
│   ├── useForm.ts                 🆕 CREAR - Gestión de formularios genérica
│   ├── useDebounce.ts             🆕 CREAR - Debounce para búsquedas
│   ├── useFilters.ts              🆕 CREAR - Lógica de filtrado genérica
│   ├── usePagination.ts           🆕 CREAR - Paginación genérica
│   ├── useSort.ts                 🆕 CREAR - Ordenamiento genérico
│   ├── useImageUpload.ts          🆕 CREAR - Upload de imágenes con preview
│   ├── useAnalysisForm.ts         🆕 CREAR - Formulario de análisis específico
│   └── index.ts                   ✅ Barrel export
│
├── components/
│   ├── common/                    🆕 Componentes UI reutilizables
│   │   ├── SearchBar.tsx          🆕 Barra de búsqueda genérica
│   │   ├── FilterSelect.tsx       🆕 Select de filtros genérico
│   │   ├── DataTable.tsx          🆕 Tabla de datos genérica
│   │   ├── Pagination.tsx         🆕 Componente de paginación
│   │   ├── Badge.tsx              🆕 Badge de clasificación
│   │   ├── LoadingSpinner.tsx     🆕 Indicador de carga
│   │   ├── ErrorMessage.tsx       🆕 Mensaje de error
│   │   ├── EmptyState.tsx         🆕 Estado vacío genérico
│   │   └── ProgressBar.tsx        🆕 Barra de progreso (para IA)
│   │
│   ├── forms/                     🆕 Componentes de formulario
│   │   ├── FormInput.tsx          🆕 Input controlado genérico
│   │   ├── FormTextarea.tsx       🆕 Textarea controlado
│   │   ├── FormSelect.tsx         🆕 Select controlado
│   │   ├── FormCheckbox.tsx       🆕 Checkbox controlado
│   │   ├── FormSlider.tsx         🆕 Slider con input numérico
│   │   ├── CollapsibleSection.tsx 🆕 Sección expandible (para bloques)
│   │   └── CapacitySlider.tsx     🆕 Slider de capacidades físicas
│   │
│   ├── analysis/                  🆕 Componentes específicos de análisis
│   │   ├── AnalysisFormBlockA.tsx 🆕 Bloque A de FormularioAnalisis
│   │   ├── AnalysisFormBlockB.tsx 🆕 Bloque B de FormularioAnalisis
│   │   ├── AnalysisFormBlockC.tsx 🆕 Bloque C de FormularioAnalisis
│   │   ├── AnalysisFormBlockD.tsx 🆕 Bloque D de FormularioAnalisis
│   │   ├── AnalysisFormBlockE.tsx 🆕 Bloque E de FormularioAnalisis
│   │   ├── AnalysisFormBlockF.tsx 🆕 Bloque F de FormularioAnalisis
│   │   ├── AnalysisFormBlockG.tsx 🆕 Bloque G de FormularioAnalisis
│   │   ├── AIAnalysisSelector.tsx 🆕 Checkboxes de análisis IA
│   │   ├── WeakPointsList.tsx     🆕 Lista de puntos débiles
│   │   └── CapacitiesGrid.tsx     🆕 Grid de capacidades físicas
│   │
│   ├── athlete/                   🆕 Componentes específicos de atletas
│   │   ├── AthleteSearchDropdown.tsx 🆕 Dropdown de búsqueda
│   │   ├── AthleteInfoCard.tsx    🆕 Card de información
│   │   └── AthleteStatsGrid.tsx   🆕 Grid de estadísticas
│   │
│   ├── AtletaCard.tsx             ✅ EXISTENTE - Revisar para simplificar
│   ├── AtletaModal.tsx            ✅ MIGRADO
│   ├── AtletaAnalisisModal.tsx    ✅ MIGRADO
│   ├── AtletaSelectionModal.tsx   ✅ MIGRADO
│   ├── FormularioAnalisis.tsx     🔄 REFACTORIZAR
│   ├── ImageUpload.tsx            ✅ OK (componente simple)
│   └── Navbar.tsx                 ✅ OK (componente simple)
│
├── utils/                         🆕 Utilidades y helpers
│   ├── date.utils.ts              🆕 Formateo de fechas, cálculo de edad
│   ├── classification.utils.ts    🆕 Helpers de clasificación
│   ├── validation.utils.ts        🆕 Validaciones de formularios
│   ├── format.utils.ts            🆕 Formateo de números, textos
│   └── constants.ts               🆕 Constantes (disciplinas, somatotipos, etc.)
│
├── types/                         🆕 Tipos TypeScript centralizados
│   ├── athlete.types.ts           🆕 Tipos de atleta
│   ├── analysis.types.ts          🆕 Tipos de análisis
│   ├── form.types.ts              🆕 Tipos de formularios
│   └── index.ts                   🆕 Barrel export
│
├── services/
│   └── api.ts                     ✅ EXISTENTE - OK
│
└── pages/
    ├── Dashboard.tsx              🔄 REFACTORIZAR
    ├── Analisis.tsx               ✅ MIGRADO
    ├── NuevoAnalisis.tsx          🔄 REFACTORIZAR
    ├── TodosAnalisis.tsx          🔄 REFACTORIZAR
    ├── DetalleAtleta.tsx          ✅ MIGRADO
    ├── AgregarAtleta.tsx          🔄 REFACTORIZAR
    └── ...
```

---

## 🔧 Plan de Implementación

### **FASE 1: Infraestructura Base** (1-2 horas)

#### 1.1. Crear Utilidades Centralizadas
```typescript
// utils/constants.ts
export const DISCIPLINAS = ['Fútbol', 'Básquet', 'Rugby', ...] as const
export const SOMATOTIPOS = ['Ectomorfo', 'Mesomorfo', 'Endomorfo'] as const
export const CLASIFICACIONES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const

// utils/classification.utils.ts
export const getBadgeClass = (clasificacion: string) => { ... }
export const getClassificationLabel = (clasificacion: string) => { ... }

// utils/date.utils.ts
export const calculateAge = (birthDate: string | Date): number => { ... }
export const formatDate = (date: string | Date, format: string): string => { ... }

// utils/validation.utils.ts
export const validateAthleteForm = (data: any) => { ... }
export const validateAnalysisForm = (data: any) => { ... }
```

#### 1.2. Centralizar Tipos
```typescript
// types/athlete.types.ts
export interface Athlete { ... }
export interface AthleteFormData { ... }
export interface AthleteDisplayData { ... }

// types/analysis.types.ts
export interface Analysis { ... }
export interface AnalysisFormData { ... }
export interface PhysicalCapacities { ... }
export interface WeakPoint { ... }

// types/form.types.ts
export interface FormState<T> {
  data: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
}
```

### **FASE 2: Custom Hooks Genéricos** (2-3 horas)

#### 2.1. useForm Hook
```typescript
// hooks/useForm.ts
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  const handleChange = (field: keyof T, value: any) => { ... }
  const handleBlur = (field: keyof T) => { ... }
  const handleSubmit = (onSubmit: (values: T) => void | Promise<void>) => { ... }
  const reset = () => { ... }
  
  return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset }
}
```

**Uso**:
```tsx
// Antes (AgregarAtleta.tsx - 30+ líneas)
const [formData, setFormData] = useState({ ... })
const handleChange = (e) => { ... }
const handleSubmit = async (e) => { validación + submit }

// Después (5 líneas)
const { values, errors, handleChange, handleSubmit } = useForm(
  initialAthleteData,
  validateAthleteForm
)
```

#### 2.2. useDebounce Hook
```typescript
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}
```

**Elimina**:
- 8 líneas en `TodosAnalisis.tsx`
- 6 líneas en cualquier componente con búsqueda

#### 2.3. useFilters Hook
```typescript
// hooks/useFilters.ts
export function useFilters<T>(
  items: T[],
  filterConfig: FilterConfig<T>
) {
  const [filters, setFilters] = useState<Filters>({})
  
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        return filterConfig[key](item, value)
      })
    })
  }, [items, filters, filterConfig])
  
  return { filters, setFilters, filteredItems, clearFilters }
}
```

#### 2.4. usePagination Hook
```typescript
// hooks/usePagination.ts
export function usePagination<T>(
  items: T[],
  itemsPerPage: number = 10
) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage)
  
  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage: setCurrentPage,
    nextPage: () => setCurrentPage(p => Math.min(totalPages, p + 1)),
    prevPage: () => setCurrentPage(p => Math.max(1, p - 1))
  }
}
```

#### 2.5. useSort Hook
```typescript
// hooks/useSort.ts
export function useSort<T>(items: T[]) {
  const [sortField, setSortField] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  const sortedItems = useMemo(() => {
    if (!sortField) return items
    return [...items].sort((a, b) => {
      // Lógica de ordenamiento genérica
    })
  }, [items, sortField, sortDirection])
  
  const handleSort = (field: keyof T) => { ... }
  
  return { sortedItems, sortField, sortDirection, handleSort }
}
```

#### 2.6. useImageUpload Hook
```typescript
// hooks/useImageUpload.ts
export function useImageUpload(maxFiles: number = 10) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  
  const handleFilesChange = (newFiles: FileList | File[]) => { ... }
  const removeFile = (index: number) => { ... }
  const clearAll = () => { ... }
  
  return { files, previews, handleFilesChange, removeFile, clearAll }
}
```

### **FASE 3: Componentes UI Reutilizables** (3-4 horas)

#### 3.1. SearchBar Component
```tsx
// components/common/SearchBar.tsx
interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: React.ReactNode
  className?: string
}

export function SearchBar({ value, onChange, placeholder, icon, className }: SearchBarProps) {
  return (
    <div className={`search-container ${className || ''}`}>
      {icon || <IoSearch className="search-icon" />}
      <input
        type="text"
        placeholder={placeholder || 'Buscar...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  )
}
```

**Reemplaza** código duplicado en:
- `Dashboard.tsx` (15 líneas → 2 líneas)
- `TodosAnalisis.tsx` (12 líneas → 2 líneas)
- `Analisis.tsx` (10 líneas → 2 líneas)
- `AtletaSelectionModal.tsx` (8 líneas → 2 líneas)

#### 3.2. DataTable Component
```tsx
// components/common/DataTable.tsx
interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (row: T) => void
  onSort?: (field: keyof T) => void
  sortField?: keyof T
  sortDirection?: 'asc' | 'desc'
  emptyMessage?: string
}

export function DataTable<T>({ data, columns, onRowClick, ... }: DataTableProps<T>) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col.header)} className={col.sortable ? 'sortable' : ''}>
                {/* Header con ordenamiento */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx} onClick={() => onRowClick?.(row)}>
                {/* Renderizar celdas */}
              </tr>
            ))
          ) : (
            <tr><td colSpan={columns.length}>{emptyMessage}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
```

**Reemplaza**:
- Tabla en `TodosAnalisis.tsx` (~80 líneas)
- Tabla en `Analisis.tsx` (~60 líneas)
- Tabla en `DetalleAtleta.tsx` (~70 líneas)

#### 3.3. Pagination Component
```tsx
// components/common/Pagination.tsx
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onNext: () => void
  onPrev: () => void
  showInfo?: boolean
  totalItems?: number
}

export function Pagination({ ... }: PaginationProps) {
  return (
    <div className="pagination">
      <button onClick={onPrev} disabled={currentPage === 1}>
        <IoChevronBack />
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          className={currentPage === page ? 'active' : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button onClick={onNext} disabled={currentPage === totalPages}>
        <IoChevronForward />
      </button>
    </div>
  )
}
```

#### 3.4. Badge Component
```tsx
// components/common/Badge.tsx
interface BadgeProps {
  classification: 'high' | 'medium' | 'low' | null
  showLabel?: boolean
}

export function Badge({ classification, showLabel = true }: BadgeProps) {
  const badgeClass = getBadgeClass(classification)
  const label = showLabel ? getClassificationLabel(classification) : null
  
  return <span className={`badge ${badgeClass}`}>{label}</span>
}
```

#### 3.5. CollapsibleSection Component
```tsx
// components/forms/CollapsibleSection.tsx
interface CollapsibleSectionProps {
  id: string
  title: string
  subtitle?: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function CollapsibleSection({ id, title, subtitle, isExpanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="form-bloque">
      <div className="bloque-header" onClick={onToggle}>
        <h2 className="bloque-title">
          <span className="bloque-letra">{id}</span>
          {title}
        </h2>
        {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
      </div>
      {isExpanded && (
        <div className="bloque-content">
          {children}
        </div>
      )}
    </div>
  )
}
```

**Reemplaza** 7 bloques repetidos en `FormularioAnalisis.tsx`

### **FASE 4: Refactorización de Componentes Grandes** (4-6 horas)

#### 4.1. FormularioAnalisis.tsx
**Antes**: 868 líneas monolíticas  
**Después**: ~150 líneas orquestando componentes

```tsx
// components/FormularioAnalisis.tsx (REFACTORIZADO)
import { useForm } from '../hooks/useForm'
import { CollapsibleSection } from './forms/CollapsibleSection'
import { AnalysisFormBlockA, AnalysisFormBlockB, ... } from './analysis'

function FormularioAnalisis({ atleta, onClose }: FormularioAnalisisProps) {
  const {
    values: formData,
    errors,
    handleChange,
    handleSubmit
  } = useForm(getInitialAnalysisFormData(atleta), validateAnalysisForm)
  
  const [bloqueExpandido, setBloqueExpandido] = useState('A')
  const [guardando, setGuardando] = useState(false)
  
  const onSubmit = async (data: AnalysisFormData) => {
    setGuardando(true)
    try {
      await analysisService.saveDraft(data)
      onClose()
    } catch (error) {
      // handle error
    } finally {
      setGuardando(false)
    }
  }
  
  return (
    <div className="formulario-fullscreen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CollapsibleSection
          id="A"
          title="Información de Sesión"
          isExpanded={bloqueExpandido === 'A'}
          onToggle={() => setBloqueExpandido('A')}
        >
          <AnalysisFormBlockA
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        </CollapsibleSection>
        
        {/* Repetir para bloques B-G */}
        
        <div className="formulario-footer">
          <button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

Crear componentes hijos:
- `AnalysisFormBlockA.tsx` (~80 líneas) - Información de sesión
- `AnalysisFormBlockB.tsx` (~90 líneas) - Datos antropométricos
- `AnalysisFormBlockC.tsx` (~60 líneas) - Motivo de consulta
- `AnalysisFormBlockD.tsx` (~200 líneas) - KPIs (subdividir en D1-D4)
- `AnalysisFormBlockE.tsx` (~50 líneas) - Análisis textual
- `AnalysisFormBlockF.tsx` (~100 líneas) - Conclusiones
- `AnalysisFormBlockG.tsx` (~30 líneas) - Archivos

#### 4.2. NuevoAnalisis.tsx
**Antes**: 831 líneas  
**Después**: ~200 líneas

```tsx
// pages/NuevoAnalisis.tsx (REFACTORIZADO)
import { useAthletes } from '../hooks/useAthletes'
import { useForm } from '../hooks/useForm'
import { useImageUpload } from '../hooks/useImageUpload'
import { AthleteSearchDropdown } from '../components/athlete/AthleteSearchDropdown'
import { AIAnalysisSelector } from '../components/analysis/AIAnalysisSelector'
import { CapacitiesGrid } from '../components/analysis/CapacitiesGrid'
import { WeakPointsList } from '../components/analysis/WeakPointsList'

function NuevoAnalisis() {
  const navigate = useNavigate()
  const { athletes } = useAthletes()
  const { files, previews, handleFilesChange, removeFile } = useImageUpload()
  
  const {
    values: formData,
    handleChange,
    handleSubmit
  } = useForm(initialAnalysisData, validateNewAnalysis)
  
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [aiProcessing, setAiProcessing] = useState(false)
  
  const onSubmit = async (data: AnalysisFormData) => {
    // Submit logic
  }
  
  return (
    <PageTemplate title="Nuevo Análisis">
      <form onSubmit={handleSubmit(onSubmit)}>
        <AthleteSearchDropdown
          athletes={athletes}
          selected={selectedAthlete}
          onSelect={setSelectedAthlete}
        />
        
        <ImageUpload
          files={files}
          previews={previews}
          onFilesChange={handleFilesChange}
          onRemove={removeFile}
        />
        
        <AIAnalysisSelector
          onGenerate={handleGenerateAI}
          isProcessing={aiProcessing}
        />
        
        <CapacitiesGrid
          values={formData.capacidadesFisicas}
          onChange={(field, value) => handleChange(`capacidadesFisicas.${field}`, value)}
        />
        
        <WeakPointsList
          points={formData.puntosDebiles}
          onChange={(newPoints) => handleChange('puntosDebiles', newPoints)}
        />
        
        <button type="submit">Guardar</button>
      </form>
    </PageTemplate>
  )
}
```

#### 4.3. TodosAnalisis.tsx
**Antes**: 344 líneas  
**Después**: ~80 líneas

```tsx
// pages/TodosAnalisis.tsx (REFACTORIZADO)
import { useAthletes } from '../hooks/useAthletes'
import { useAnalyses } from '../hooks/useAnalyses'
import { useDebounce } from '../hooks/useDebounce'
import { useFilters } from '../hooks/useFilters'
import { usePagination } from '../hooks/usePagination'
import { useSort } from '../hooks/useSort'
import { SearchBar } from '../components/common/SearchBar'
import { FilterSelect } from '../components/common/FilterSelect'
import { DataTable } from '../components/common/DataTable'
import { Pagination } from '../components/common/Pagination'
import { Badge } from '../components/common/Badge'

function TodosAnalisis() {
  const navigate = useNavigate()
  const { athletes } = useAthletes()
  const { analyses } = useAnalyses()
  
  const [busqueda, setBusqueda] = useState('')
  const debouncedBusqueda = useDebounce(busqueda, 300)
  
  // Combinar datos
  const atletasConAnalisis = useMemo(() => {
    // Combinar atletas con último análisis
  }, [athletes, analyses])
  
  // Filtros
  const { filters, setFilters, filteredItems } = useFilters(
    atletasConAnalisis,
    {
      search: (item, value) => item.athlete.name.toLowerCase().includes(value),
      classification: (item, value) => item.latestAnalysis.classification === value
    }
  )
  
  // Ordenamiento
  const { sortedItems, handleSort } = useSort(filteredItems)
  
  // Paginación
  const { paginatedItems, currentPage, totalPages, goToPage, nextPage, prevPage } = 
    usePagination(sortedItems, 10)
  
  const columns = [
    { header: 'Atleta', accessor: (row) => row.athlete.name, sortable: true },
    { header: 'Clasificación', accessor: (row) => <Badge classification={row.latestAnalysis.classification} /> }
  ]
  
  return (
    <PageTemplate title="Todos los Análisis">
      <SearchBar value={busqueda} onChange={setBusqueda} />
      
      <FilterSelect
        value={filters.classification}
        onChange={(value) => setFilters({ ...filters, classification: value })}
        options={['Todos', 'Alto', 'Medio', 'Bajo']}
      />
      
      <DataTable
        data={paginatedItems}
        columns={columns}
        onRowClick={(item) => navigate(`/athlete-detail/${item.athlete.id}`)}
        onSort={handleSort}
      />
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </PageTemplate>
  )
}
```

#### 4.4. Dashboard.tsx
**Antes**: 175 líneas  
**Después**: ~60 líneas

```tsx
// pages/Dashboard.tsx (REFACTORIZADO)
import { useAthletes } from '../hooks/useAthletes'
import { useDebounce } from '../hooks/useDebounce'
import { SearchBar } from '../components/common/SearchBar'
import { FilterSelect } from '../components/common/FilterSelect'
import { AtletaCard } from '../components/AtletaCard'
import { EmptyState } from '../components/common/EmptyState'

function Dashboard() {
  const navigate = useNavigate()
  const { athletes, loading } = useAthletes()
  
  const [busqueda, setBusqueda] = useState('')
  const [deporteFiltro, setDeporteFiltro] = useState('Todos')
  
  const debouncedBusqueda = useDebounce(busqueda, 300)
  
  const atletasFiltrados = useMemo(() => {
    return athletes.filter(a => 
      (a.name.toLowerCase().includes(debouncedBusqueda.toLowerCase())) &&
      (deporteFiltro === 'Todos' || a.sport === deporteFiltro)
    )
  }, [athletes, debouncedBusqueda, deporteFiltro])
  
  const deportes = useMemo(() => 
    ['Todos', ...Array.from(new Set(athletes.map(a => a.sport)))],
    [athletes]
  )
  
  if (loading) return <LoadingSpinner />
  
  return (
    <PageTemplate title="Dashboard">
      <div className="dashboard-filters">
        <SearchBar value={busqueda} onChange={setBusqueda} />
        <FilterSelect value={deporteFiltro} onChange={setDeporteFiltro} options={deportes} />
      </div>
      
      {atletasFiltrados.length > 0 ? (
        <div className="atletas-grid">
          {atletasFiltrados.map(atleta => (
            <AtletaCard key={atleta.id} atleta={atleta} onClick={() => navigate(`/athlete-detail/${atleta.id}`)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IoFootball />}
          title="No se encontraron atletas"
          action={{ label: 'Agregar atleta', onClick: () => navigate('/add-athlete') }}
        />
      )}
    </PageTemplate>
  )
}
```

#### 4.5. AgregarAtleta.tsx
**Antes**: 370 líneas  
**Después**: ~120 líneas

```tsx
// pages/AgregarAtleta.tsx (REFACTORIZADO)
import { useForm } from '../hooks/useForm'
import { useImageUpload } from '../hooks/useImageUpload'
import { FormInput } from '../components/forms/FormInput'
import { FormSelect } from '../components/forms/FormSelect'
import { ImageUpload } from '../components/ImageUpload'

function AgregarAtleta() {
  const navigate = useNavigate()
  const { files, previews, handleFilesChange } = useImageUpload(1)
  
  const {
    values: formData,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useForm(initialAthleteData, validateAthleteForm)
  
  const onSubmit = async (data: AthleteFormData) => {
    const response = await athleteAPI.create({
      ...data,
      photo: files[0]
    })
    navigate('/dashboard')
  }
  
  return (
    <PageTemplate title="Agregar Atleta">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ImageUpload
          files={files}
          previews={previews}
          onFilesChange={handleFilesChange}
          maxFiles={1}
        />
        
        <FormInput
          label="Nombre Completo"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        
        <FormSelect
          label="Género"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={['Masculino', 'Femenino', 'Otro']}
          required
        />
        
        {/* Más campos usando FormInput, FormSelect */}
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Crear Atleta'}
        </button>
      </form>
    </PageTemplate>
  )
}
```

---

## 📈 Métricas de Mejora Esperadas

### Reducción de Código

| Archivo | Antes | Después | Reducción |
|---------|-------|---------|-----------|
| `FormularioAnalisis.tsx` | 868 líneas | ~150 líneas | **-83%** |
| `NuevoAnalisis.tsx` | 831 líneas | ~200 líneas | **-76%** |
| `TodosAnalisis.tsx` | 344 líneas | ~80 líneas | **-77%** |
| `Dashboard.tsx` | 175 líneas | ~60 líneas | **-66%** |
| `AgregarAtleta.tsx` | 370 líneas | ~120 líneas | **-68%** |
| **TOTAL** | **2,588 líneas** | **~610 líneas** | **-76%** |

### Código Reutilizable Creado

- **12 Custom Hooks** genéricos
- **15 Componentes UI** reutilizables
- **7 Componentes de formulario** genéricos
- **9 Componentes específicos** de análisis
- **4 Archivos de utilidades**
- **3 Archivos de tipos**

### Beneficios

✅ **Mantenibilidad**: Cambios en un solo lugar  
✅ **Testabilidad**: Componentes pequeños fáciles de testear  
✅ **Reutilización**: DRY aplicado rigurosamente  
✅ **Performance**: Memoization en hooks y componentes  
✅ **Type Safety**: Tipos centralizados y consistentes  
✅ **Escalabilidad**: Arquitectura clara para crecer  

---

## 🚀 Orden de Implementación Sugerido

### Semana 1: Fundamentos
1. ✅ Crear `utils/` (constantes, helpers, validaciones)
2. ✅ Crear `types/` (interfaces centralizadas)
3. ✅ Crear hooks genéricos (`useForm`, `useDebounce`, `useFilters`, `usePagination`, `useSort`)

### Semana 2: Componentes UI
4. ✅ Crear componentes comunes (`SearchBar`, `FilterSelect`, `DataTable`, `Pagination`, `Badge`)
5. ✅ Crear componentes de formulario (`FormInput`, `FormTextarea`, `FormSelect`, etc.)

### Semana 3: Refactorización de Páginas
6. ✅ Refactorizar `TodosAnalisis.tsx` (más simple)
7. ✅ Refactorizar `Dashboard.tsx` (segunda más simple)
8. ✅ Refactorizar `AgregarAtleta.tsx` (formulario simple)

### Semana 4: Componentes Complejos
9. ✅ Dividir `FormularioAnalisis.tsx` en bloques
10. ✅ Refactorizar `NuevoAnalisis.tsx` con componentes

---

## 🎯 Próximo Paso Inmediato

**¿Comenzamos con FASE 1 (Infraestructura Base)?**

Crear:
1. `utils/constants.ts`
2. `utils/classification.utils.ts`
3. `utils/date.utils.ts`
4. `utils/validation.utils.ts`

Esto sentará las bases para todo lo demás.
