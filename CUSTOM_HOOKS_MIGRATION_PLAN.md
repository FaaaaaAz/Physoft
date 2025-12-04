# Custom Hooks Migration Plan - Physoft Frontend

## Overview
Migrate all API logic and shared state management from components to custom hooks for better code organization, reusability, and testability.

## Current Architecture Issues
- API calls scattered across multiple components
- Duplicate state management logic (loading, error, data)
- No centralized cache or state management
- Components tightly coupled to API implementation details

## Proposed Hook Structure

### 1. Core Data Hooks

#### `useAthletes`
**Location**: `frontend/src/hooks/useAthletes.ts`

**Purpose**: Manage athlete data fetching and state

```typescript
interface UseAthletesOptions {
  filters?: AthleteFilters
  autoLoad?: boolean
}

interface UseAthletesReturn {
  athletes: Athlete[]
  isLoading: boolean
  error: string | null
  total: number
  loadAthletes: (filters?: AthleteFilters) => Promise<void>
  getAthleteById: (id: string) => Promise<Athlete | null>
  createAthlete: (data: CreateAthleteDTO) => Promise<Athlete | null>
  updateAthlete: (id: string, data: Partial<CreateAthleteDTO>) => Promise<Athlete | null>
  deleteAthlete: (id: string) => Promise<boolean>
  uploadPhoto: (id: string, photo: File) => Promise<Athlete | null>
  refetch: () => Promise<void>
}

function useAthletes(options?: UseAthletesOptions): UseAthletesReturn
```

**Features**:
- Automatic data loading on mount (optional)
- Caching with manual refetch capability
- Filter support
- CRUD operations
- Loading and error states
- Optimistic updates

---

#### `useAnalyses`
**Location**: `frontend/src/hooks/useAnalyses.ts`

**Purpose**: Manage analysis data fetching and state

```typescript
interface UseAnalysesOptions {
  athleteId?: string
  filters?: {
    globalClassification?: string
    startDate?: string
    endDate?: string
  }
  autoLoad?: boolean
}

interface UseAnalysesReturn {
  analyses: Analysis[]
  isLoading: boolean
  error: string | null
  total: number
  loadAnalyses: (filters?) => Promise<void>
  getAnalysisById: (id: number) => Promise<Analysis | null>
  createAnalysis: (data: CreateAnalysisDTO) => Promise<Analysis | null>
  updateAnalysis: (id: number, data: Partial<CreateAnalysisDTO>) => Promise<Analysis | null>
  deleteAnalysis: (id: number) => Promise<boolean>
  uploadGraphs: (id: number, graphs: File[]) => Promise<Analysis | null>
  refetch: () => Promise<void>
}

function useAnalyses(options?: UseAnalysesOptions): UseAnalysesReturn
```

---

#### `useAthleteAnalyses`
**Location**: `frontend/src/hooks/useAthleteAnalyses.ts`

**Purpose**: Combined hook for athlete + their analyses

```typescript
interface UseAthleteAnalysesReturn {
  athlete: Athlete | null
  analyses: Analysis[]
  latestAnalysis: Analysis | null
  isLoading: boolean
  error: string | null
  loadData: () => Promise<void>
  refetch: () => Promise<void>
}

function useAthleteAnalyses(athleteId: string): UseAthleteAnalysesReturn
```

---

### 2. UI State Hooks

#### `usePagination`
**Location**: `frontend/src/hooks/usePagination.ts`

**Purpose**: Reusable pagination logic

```typescript
interface UsePaginationOptions {
  initialPage?: number
  itemsPerPage?: number
  totalItems: number
}

interface UsePaginationReturn {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  startIndex: number
  endIndex: number
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  canGoNext: boolean
  canGoPrev: boolean
  paginatedItems: <T>(items: T[]) => T[]
}

function usePagination(options: UsePaginationOptions): UsePaginationReturn
```

---

#### `useFilters`
**Location**: `frontend/src/hooks/useFilters.ts`

**Purpose**: Reusable filter and search logic

```typescript
interface UseFiltersOptions<T> {
  data: T[]
  filterFn: (item: T, filters: Record<string, any>) => boolean
  searchFn?: (item: T, searchTerm: string) => boolean
}

interface UseFiltersReturn<T> {
  filteredData: T[]
  filters: Record<string, any>
  searchTerm: string
  setFilter: (key: string, value: any) => void
  setSearchTerm: (term: string) => void
  clearFilters: () => void
  hasActiveFilters: boolean
}

function useFilters<T>(options: UseFiltersOptions<T>): UseFiltersReturn<T>
```

---

#### `useSort`
**Location**: `frontend/src/hooks/useSort.ts`

**Purpose**: Reusable sorting logic

```typescript
type SortDirection = 'asc' | 'desc'

interface UseSortOptions<T> {
  data: T[]
  initialField?: string
  initialDirection?: SortDirection
  sortFunctions: Record<string, (a: T, b: T) => number>
}

interface UseSortReturn<T> {
  sortedData: T[]
  sortField: string
  sortDirection: SortDirection
  setSortField: (field: string) => void
  toggleSort: (field: string) => void
}

function useSort<T>(options: UseSortOptions<T>): UseSortReturn<T>
```

---

#### `useDebounce`
**Location**: `frontend/src/hooks/useDebounce.ts`

**Purpose**: Debounce values (for search inputs)

```typescript
function useDebounce<T>(value: T, delay: number): T
```

---

### 3. Utility Hooks

#### `useOnlineStatus`
**Location**: `frontend/src/hooks/useOnlineStatus.ts`

**Purpose**: Track internet connectivity

```typescript
interface UseOnlineStatusReturn {
  isOnline: boolean
  wasOffline: boolean
}

function useOnlineStatus(): UseOnlineStatusReturn
```

---

#### `useFormValidation`
**Location**: `frontend/src/hooks/useFormValidation.ts`

**Purpose**: Form validation logic

```typescript
interface ValidationRule<T> {
  validate: (value: T) => boolean
  message: string
}

interface UseFormValidationOptions<T> {
  initialValues: T
  validationRules: Partial<Record<keyof T, ValidationRule<T[keyof T]>[]>>
}

interface UseFormValidationReturn<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isValid: boolean
  handleChange: (field: keyof T, value: any) => void
  handleBlur: (field: keyof T) => void
  validateForm: () => boolean
  resetForm: () => void
}

function useFormValidation<T>(options: UseFormValidationOptions<T>): UseFormValidationReturn<T>
```

---

## Migration Roadmap

### Phase 1: Create Core Hooks (Week 1)
1. ✅ Create hooks directory structure
2. Implement `useAthletes` hook
3. Implement `useAnalyses` hook
4. Implement `useAthleteAnalyses` hook
5. Write unit tests for data hooks

**Files to create**:
- `frontend/src/hooks/useAthletes.ts`
- `frontend/src/hooks/useAnalyses.ts`
- `frontend/src/hooks/useAthleteAnalyses.ts`

---

### Phase 2: Create UI Utility Hooks (Week 1)
1. Implement `usePagination` hook
2. Implement `useFilters` hook
3. Implement `useSort` hook
4. Implement `useDebounce` hook
5. Implement `useOnlineStatus` hook
6. Write unit tests for utility hooks

**Files to create**:
- `frontend/src/hooks/usePagination.ts`
- `frontend/src/hooks/useFilters.ts`
- `frontend/src/hooks/useSort.ts`
- `frontend/src/hooks/useDebounce.ts`
- `frontend/src/hooks/useOnlineStatus.ts`

---

### Phase 3: Migrate Components (Week 2)

#### Priority 1: Data-heavy components
1. **TodosAnalisis.tsx**
   - Replace direct API calls with `useAthletes` + `useAnalyses`
   - Use `usePagination` for pagination
   - Use `useFilters` for filtering
   - Use `useSort` for sorting
   - Use `useDebounce` for search

2. **NuevoAnalisis.tsx**
   - Replace direct API calls with `useAthletes` + `useAnalyses`
   - Use `useOnlineStatus` for internet detection
   - Simplify form state management

3. **Dashboard.tsx**
   - Use `useAthletes` for athlete list
   - Use `useAnalyses` for recent analyses

#### Priority 2: Detail components
4. **AthleteDetail.tsx** (if exists)
   - Use `useAthleteAnalyses` hook

5. **AnalysisView.tsx** (if exists)
   - Use `useAnalyses` hook

---

### Phase 4: Advanced Optimizations (Week 3)
1. Add React Query or SWR for caching (optional)
2. Implement `useFormValidation` hook
3. Add optimistic UI updates
4. Implement request cancellation
5. Add offline data persistence (IndexedDB)

---

## Benefits After Migration

### Code Quality
- **DRY Principle**: Eliminate duplicate loading/error/data state logic
- **Separation of Concerns**: Components focus on UI, hooks handle data
- **Type Safety**: Strong TypeScript typing for all hooks
- **Testability**: Hooks can be tested in isolation

### Performance
- **Caching**: Reduce redundant API calls
- **Debouncing**: Optimize search inputs
- **Memoization**: Prevent unnecessary re-renders

### Developer Experience
- **Reusability**: Use same hooks across different components
- **Consistency**: Standardized patterns for data fetching
- **Maintainability**: Centralized business logic

---

## Example: Before vs After

### Before (Current TodosAnalisis.tsx)
```typescript
function TodosAnalisis() {
  const [atletasConAnalisis, setAtletasConAnalisis] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError('')
      const [athletesResponse, analysesResponse] = await Promise.all([
        athleteAPI.getAll(),
        analysisAPI.getAll()
      ])
      // Complex grouping logic...
      setAtletasConAnalisis(combined)
    } catch (err) {
      setError('Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }
  
  // 50+ lines of pagination logic
  // 30+ lines of filter logic
  // 20+ lines of sort logic
}
```

### After (With Custom Hooks)
```typescript
function TodosAnalisis() {
  const { athletes, isLoading: athletesLoading } = useAthletes({ autoLoad: true })
  const { analyses, isLoading: analysesLoading } = useAnalyses({ autoLoad: true })
  const { isOnline } = useOnlineStatus()
  
  const athletesWithAnalyses = useMemo(() => {
    // Simple grouping logic
  }, [athletes, analyses])
  
  const { filteredData, setFilter, searchTerm, setSearchTerm } = useFilters({
    data: athletesWithAnalyses,
    filterFn: (item, filters) => { /* filter logic */ },
    searchFn: (item, term) => { /* search logic */ }
  })
  
  const { sortedData, toggleSort } = useSort({
    data: filteredData,
    sortFunctions: { /* sort functions */ }
  })
  
  const { paginatedItems, currentPage, totalPages, goToPage } = usePagination({
    totalItems: sortedData.length,
    itemsPerPage: 10
  })
  
  const displayItems = paginatedItems(sortedData)
  
  // Clean, focused UI logic
}
```

---

## Testing Strategy

### Unit Tests
- Test each hook in isolation
- Mock API responses
- Test loading, error, and success states
- Test edge cases (empty data, network errors)

### Integration Tests
- Test hooks working together in components
- Test real API integration (optional)
- Test user workflows

---

## Rollout Strategy

### Development
1. Create hooks in parallel (don't block development)
2. Test hooks thoroughly
3. Migrate one component at a time
4. Keep old code until new version is verified

### Code Review
- Review each hook individually
- Review each migrated component
- Ensure no functionality is lost

### QA Testing
- Test all migrated components
- Regression testing for non-migrated components
- Performance testing

---

## Future Enhancements

### Possible Additions
1. **useAthleteComparison**: Compare athlete metrics
2. **useStatistics**: Centralized statistics fetching
3. **useExport**: Export data to PDF/CSV
4. **useNotifications**: Toast notifications for success/error
5. **useUpload**: File upload with progress tracking
6. **useCache**: Advanced caching strategy
7. **useOfflineQueue**: Queue mutations when offline

### Performance Monitoring
- Track API call frequency
- Monitor cache hit rates
- Measure component render times

---

## Success Criteria

- [ ] All API calls moved to custom hooks
- [ ] No duplicate state management logic
- [ ] All components using shared UI hooks (pagination, filters, sort)
- [ ] 100% TypeScript coverage in hooks
- [ ] Unit tests for all hooks (>80% coverage)
- [ ] No regression in functionality
- [ ] Improved performance metrics

---

## Resources

### Documentation
- React Hooks API: https://react.dev/reference/react/hooks
- Custom Hooks Best Practices: https://react.dev/learn/reusing-logic-with-custom-hooks
- TypeScript with Hooks: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks

### Tools
- React Testing Library for hook testing
- MSW (Mock Service Worker) for API mocking
- React DevTools for debugging

---

**Last Updated**: December 3, 2025
**Status**: Planning Phase
**Next Steps**: 
1. Create hooks directory structure
2. Implement core data hooks (useAthletes, useAnalyses)
3. Begin component migration starting with TodosAnalisis
