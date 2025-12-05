# 📋 GUÍA DE IMPLEMENTACIÓN - COMPONENTES REUTILIZABLES

## 🎯 Componentes Creados

### 1. **WeakPointsList** (Lista de Puntos Débiles)

**Ubicación:** `frontend/src/components/common/WeakPointsList.tsx`

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (líneas 730-770)
- ✅ `FormularioAnalisis.tsx` (líneas 730-750)

**Reemplaza:**
```tsx
// ANTES (50+ líneas):
<div className="subsection">
  <div className="subsection-header">
    <h4>Puntos débiles</h4>
    <button onClick={handleAgregarPuntoDebil}>
      <IoAdd /> Agregar punto débil
    </button>
  </div>
  {formData.puntosDebiles.map((punto, index) => (
    <div key={punto.id}>
      <input value={punto.texto} onChange={...} />
      <button onClick={() => handleEliminarPuntoDebil(punto.id)}>
        <IoTrash />
      </button>
    </div>
  ))}
</div>

// DESPUÉS (5 líneas):
<WeakPointsList
  weakPoints={formData.puntosDebiles}
  onAdd={handleAgregarPuntoDebil}
  onChange={handlePuntoDebilChange}
  onDelete={handleEliminarPuntoDebil}
/>
```

---

### 2. **CapacitiesGrid** (Grid de Capacidades Físicas)

**Ubicación:** `frontend/src/components/common/CapacitiesGrid.tsx`

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (líneas 775-860)
- ✅ `FormularioAnalisis.tsx` (bloques de capacidades si existen)

**Reemplaza:**
```tsx
// ANTES (100+ líneas):
<div className="capacidades-grid">
  <div className="capacidad-item">
    <label htmlFor="potencia">Potencia</label>
    <input type="range" value={capacidadesFisicas.potencia} onChange={...} />
    <input type="number" value={capacidadesFisicas.potencia} onChange={...} />
  </div>
  {/* Repetir 5 veces para cada capacidad */}
</div>

// DESPUÉS (7 líneas):
<CapacitiesGrid
  capacities={formData.capacidadesFisicas}
  onChange={handleCapacidadChange}
  isOnline={isOnline}
  showDescription={true}
/>
```

---

### 3. **AIAnalysisSelector** (Selector de Análisis con IA)

**Ubicación:** `frontend/src/components/common/AIAnalysisSelector.tsx`

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (líneas 500-610)

**Reemplaza:**
```tsx
// ANTES (120+ líneas):
<div className="ai-selector-container">
  <h4>Selecciona los tipos de análisis...</h4>
  <div className="checkbox-grid">
    <label className="ai-checkbox-item">
      <input type="checkbox" checked={analysisCheckboxes.flexibilidad} />
      {/* Repetir 6 veces */}
    </label>
  </div>
  <button onClick={handleGenerateAIAnalysis}>Generar con IA</button>
  <button onClick={handleManualAnalysis}>Manual</button>
  {/* Progress bar */}
</div>

// DESPUÉS (12 líneas):
<AIAnalysisSelector
  checkboxes={analysisCheckboxes}
  onChange={handleCheckboxChange}
  onGenerateAI={handleGenerateAIAnalysis}
  onManualAnalysis={handleManualAnalysis}
  aiProcessing={aiProcessing}
  aiProgress={aiProgress}
  isOnline={isOnline}
/>
```

---

### 4. **ImageUploader** (Subida de Imágenes)

**Ubicación:** `frontend/src/components/common/ImageUploader.tsx`

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (líneas 430-480)
- ✅ `FormularioAnalisis.tsx` (bloques D1, D2, D3, D4 - adjuntar archivos)

**Reemplaza:**
```tsx
// ANTES (60+ líneas):
<div className="upload-container">
  <label className="upload-label">
    <input type="file" multiple onChange={handleImagenesChange} />
    <IoCloudUpload />
    <p>Arrastra imágenes aquí...</p>
  </label>
</div>
{imagenesPreview.map((preview, index) => (
  <div key={index}>
    <img src={preview} />
    <button onClick={() => handleEliminarImagen(index)}>
      <IoTrash />
    </button>
  </div>
))}

// DESPUÉS (8 líneas):
<ImageUploader
  images={formData.imagenes}
  imagePreviews={imagenesPreview}
  onUpload={handleImagenesChange}
  onDelete={handleEliminarImagen}
  maxImages={10}
/>
```

---

### 5. **AthleteDropdown** (Selector de Atleta con Búsqueda)

**Ubicación:** `frontend/src/components/common/AthleteDropdown.tsx`

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (líneas 350-400)

**Reemplaza:**
```tsx
// ANTES (50+ líneas):
<div className="athlete-selector">
  <div className="search-wrapper">
    <IoSearch />
    <input 
      value={searchQuery} 
      onChange={(e) => setSearchQuery(e.target.value)}
      onFocus={() => setShowAthleteDropdown(true)}
    />
  </div>
  {showAthleteDropdown && (
    <div className="dropdown">
      {filteredAthletes.map(athlete => (
        <div onClick={() => handleAthleteSelect(athlete)}>
          {athlete.name}
        </div>
      ))}
    </div>
  )}
</div>

// DESPUÉS (6 líneas):
<AthleteDropdown
  athletes={athletes}
  selectedAthlete={selectedAthlete}
  onSelect={handleAthleteSelect}
  loading={loadingAthletes}
  required
/>
```

---

### 6. **AnalysisTextFields** (Campos de Texto de Análisis)

**Ubicación:** `frontend/src/components/common/AnalysisTextFields.tsx`

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (líneas 620-730)

**Reemplaza:**
```tsx
// ANTES (120+ líneas):
<div className="analisis-textual-grid">
  {analysisCheckboxes.flexibilidad && (
    <div className="form-group">
      <label htmlFor="analisisFlexibilidad">
        1. Análisis de flexibilidad
        {usedAI && <span className="ai-badge">Generado por IA</span>}
      </label>
      <textarea
        id="analisisFlexibilidad"
        name="analisisFlexibilidad"
        value={formData.analisisFlexibilidad}
        onChange={handleChange}
      />
    </div>
  )}
  {/* Repetir 6 veces */}
</div>
<button onClick={...}>Volver a generar con IA</button>

// DESPUÉS (10 líneas):
<AnalysisTextFields
  checkboxes={analysisCheckboxes}
  formData={formData}
  onChange={handleChange}
  usedAI={usedAI}
  onRegenerate={() => {
    setShowAnalysisFields(false)
    setUsedAI(false)
  }}
/>
```

---

## 🔧 Custom Hooks Creados

### 1. **useOnlineStatus**

**Ubicación:** `frontend/src/hooks/useOnlineStatus.ts`

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (líneas 85-95)
- ✅ `FormularioAnalisis.tsx`

**Reemplaza:**
```tsx
// ANTES (15 líneas):
const [isOnline, setIsOnline] = useState(navigator.onLine)
useEffect(() => {
  const handleOnline = () => setIsOnline(true)
  const handleOffline = () => setIsOnline(false)
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [])

// DESPUÉS (1 línea):
const isOnline = useOnlineStatus()
```

---

### 2. **useImageUpload**

**Ubicación:** `frontend/src/hooks/useImageUpload.ts`

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (líneas 82, 135-155)

**Reemplaza:**
```tsx
// ANTES (25+ líneas):
const [imagenesPreview, setImagenesPreview] = useState<string[]>([])
const handleImagenesChange = (e) => {
  if (e.target.files) {
    const files = Array.from(e.target.files)
    setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, ...files] }))
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagenesPreview(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }
}
const handleEliminarImagen = (index) => {
  setFormData(prev => ({
    ...prev,
    imagenes: prev.imagenes.filter((_, i) => i !== index)
  }))
  setImagenesPreview(prev => prev.filter((_, i) => i !== index))
}

// DESPUÉS (6 líneas):
const {
  images,
  imagePreviews,
  handleFileInput,
  removeImage
} = useImageUpload()
```

---

### 3. **useFormMessage**

**Ubicación:** `frontend/src/hooks/useFormMessage.ts`

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (línea 35)
- ✅ `AgregarAtleta.tsx`
- ✅ `FormularioAnalisis.tsx`

**Reemplaza:**
```tsx
// ANTES (2+ líneas + múltiples setMensaje):
const [mensaje, setMensaje] = useState<{tipo: 'success' | 'error', texto: string} | null>(null)
// Múltiples líneas de:
setMensaje({ tipo: 'error', texto: '...' })
setMensaje({ tipo: 'success', texto: '...' })

// DESPUÉS (5 líneas):
const { mensaje, showError, showSuccess, clearMessage } = useFormMessage()
// Uso:
showError('Debes seleccionar un atleta')
showSuccess('Análisis guardado exitosamente')
clearMessage()
```

---

### 4. **useAIAnalysis**

**Ubicación:** `frontend/src/hooks/useAIAnalysis.ts`

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (líneas 40-42, 170-240)

**Reemplaza:**
```tsx
// ANTES (80+ líneas de lógica IA):
const [aiProcessing, setAiProcessing] = useState(false)
const [aiProgress, setAiProgress] = useState(0)
const [usedAI, setUsedAI] = useState(false)
const handleGenerateAIAnalysis = async () => {
  // 60+ líneas de validación, simulación, setInterval, setTimeout...
}

// DESPUÉS (15 líneas):
const {
  aiProcessing,
  aiProgress,
  usedAI,
  generateAIAnalysis,
  resetAI
} = useAIAnalysis()

const handleGenerateAIAnalysis = () => {
  generateAIAnalysis(
    analysisCheckboxes,
    formData.imagenes.length > 0,
    isOnline,
    (analysis) => setFormData(prev => ({ ...prev, ...analysis })),
    showError
  )
}
```

---

### 5. **useWeakPoints**

**Ubicación:** `frontend/src/hooks/useWeakPoints.ts`

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (líneas 82, 252-274)

**Reemplaza:**
```tsx
// ANTES (30+ líneas):
const [proximoIdPuntoDebil, setProximoIdPuntoDebil] = useState(1)
const handleAgregarPuntoDebil = () => {
  const nuevoPunto = { id: proximoIdPuntoDebil, texto: '' }
  setFormData(prev => ({
    ...prev,
    puntosDebiles: [...prev.puntosDebiles, nuevoPunto]
  }))
  setProximoIdPuntoDebil(prev => prev + 1)
}
const handleEliminarPuntoDebil = (id) => {
  setFormData(prev => ({
    ...prev,
    puntosDebiles: prev.puntosDebiles.filter(p => p.id !== id)
  }))
}
const handlePuntoDebilChange = (id, valor) => {
  setFormData(prev => ({
    ...prev,
    puntosDebiles: prev.puntosDebiles.map(p => 
      p.id === id ? { ...p, texto: valor } : p
    )
  }))
}

// DESPUÉS (10 líneas):
const {
  weakPoints,
  addWeakPoint,
  removeWeakPoint,
  updateWeakPoint
} = useWeakPoints()

// Sincronizar con formData:
useEffect(() => {
  setFormData(prev => ({ ...prev, puntosDebiles: weakPoints }))
}, [weakPoints])
```

---

## 📦 Utilidades Creadas

### 1. **analysis.utils.ts**

**Ubicación:** `frontend/src/utils/analysis.utils.ts`

**Funciones disponibles:**
- `parseWeakPoints(weakPoints)` - Parsea JSON a array
- `formatCapacitiesForSubmit(capacities)` - Formatea para backend
- `formatWeakPointsForSubmit(weakPoints)` - Filtra vacíos y stringify
- `calculateCapacitiesAverage(capacities)` - Calcula promedio
- `determineClassification(average)` - 'high' | 'average' | 'low'
- `hasSelectedAnalysis(checkboxes)` - Valida al menos uno seleccionado
- `generateSimulatedAIAnalysis(checkboxes)` - Genera textos simulados

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (líneas 300-320 - handleSubmit)
- ✅ `AnalysisView.tsx` (línea 32 - parseWeakPoints)
- ✅ `FormularioAnalisis.tsx`

**Ejemplo de uso:**
```tsx
import { 
  formatCapacitiesForSubmit, 
  formatWeakPointsForSubmit,
  determineClassification,
  calculateCapacitiesAverage
} from '../utils/analysis.utils'

// En handleSubmit:
const submitData = {
  athleteId: formData.athleteId,
  evaluationDate: new Date(formData.fechaEvaluacion).toISOString(),
  capacities: formatCapacitiesForSubmit(formData.capacidadesFisicas),
  weakPoints: formatWeakPointsForSubmit(formData.puntosDebiles),
  globalClassification: determineClassification(
    calculateCapacitiesAverage(formData.capacidadesFisicas)
  )
}
```

---

### 2. **validation.utils.ts**

**Ubicación:** `frontend/src/utils/validation.utils.ts`

**Funciones disponibles:**
- `isValidEmail(email)` - Valida formato email
- `isValidPhone(phone)` - Valida teléfono flexible
- `isNotFutureDate(date)` - Fecha no futura
- `isEndDateAfterStart(start, end)` - Valida rango fechas
- `isInRange(value, min, max)` - Valida número en rango
- `isValidImageFile(file)` - Valida tipo imagen
- `isValidFileSize(file, maxMB)` - Valida tamaño
- `validateImageFiles(files, maxFiles, maxMB)` - Valida múltiples imágenes
- `validateRequiredFields(data, fields)` - Valida campos requeridos

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (validación antes de submit)
- ✅ `AgregarAtleta.tsx` (validación de formulario)
- ✅ `FormularioAnalisis.tsx` (validación de campos)

**Ejemplo de uso:**
```tsx
import { 
  validateImageFiles, 
  validateRequiredFields,
  isValidEmail
} from '../utils/validation.utils'

// Validar imágenes al subir:
const handleImagenesChange = (e) => {
  const files = Array.from(e.target.files)
  const validation = validateImageFiles(files, 10, 5)
  
  if (!validation.valid) {
    showError(validation.errors.join(', '))
    return
  }
  // Continuar...
}

// Validar antes de submit:
const handleSubmit = (e) => {
  e.preventDefault()
  
  const required = ['athleteId', 'fechaEvaluacion']
  const validation = validateRequiredFields(formData, required)
  
  if (!validation.valid) {
    showError(`Campos faltantes: ${validation.missingFields.join(', ')}`)
    return
  }
  // Continuar...
}
```

---

### 3. **form.utils.ts**

**Ubicación:** `frontend/src/utils/form.utils.ts`

**Funciones disponibles:**
- `createFormDataWithImages(data, files, fieldName)` - Crea FormData multipart
- `resetForm(initialValues, setFormData)` - Resetea formulario
- `updateNestedField(formData, parent, child, value)` - Actualiza nested
- `updateArrayField(formData, arrayKey, index, value)` - Actualiza array
- `countCompletedFields(data)` - Cuenta campos completos
- `calculateFormProgress(data, totalFields)` - Calcula % progreso
- `sanitizeTextInput(text)` - Limpia input de texto

**Usar en:**
- ✅ `NuevoAnalisis.tsx` (crear FormData para submit)
- ✅ `FormularioAnalisis.tsx` (nested fields, arrays)

**Ejemplo de uso:**
```tsx
import { 
  createFormDataWithImages,
  calculateFormProgress,
  sanitizeTextInput
} from '../utils/form.utils'

// Crear FormData para envío:
const handleSubmit = async (e) => {
  e.preventDefault()
  
  const formDataToSend = createFormDataWithImages(
    {
      athleteId: formData.athleteId,
      evaluationDate: formData.fechaEvaluacion,
      recommendations: sanitizeTextInput(formData.recomendaciones)
    },
    formData.imagenes,
    'graphs'
  )
  
  await analysisAPI.create(formDataToSend)
}

// Mostrar progreso del formulario:
const progress = calculateFormProgress(formData, 25)
// <div>Progreso: {progress}%</div>
```

---

## 📁 Estructura de Archivos Creados

```
frontend/src/
├── components/common/
│   ├── WeakPointsList.tsx          ✨ NUEVO
│   ├── CapacitiesGrid.tsx          ✨ NUEVO
│   ├── AIAnalysisSelector.tsx      ✨ NUEVO
│   ├── ImageUploader.tsx           ✨ NUEVO
│   ├── AthleteDropdown.tsx         ✨ NUEVO
│   ├── AnalysisTextFields.tsx      ✨ NUEVO
│   ├── SearchBar.tsx               ✅ Existente
│   ├── Badge.tsx                   ✅ Existente
│   └── CollapsibleSection.tsx      ✅ Existente
│
├── hooks/
│   ├── useOnlineStatus.ts          ✨ NUEVO
│   ├── useImageUpload.ts           ✨ NUEVO
│   ├── useFormMessage.ts           ✨ NUEVO
│   ├── useAIAnalysis.ts            ✨ NUEVO
│   ├── useWeakPoints.ts            ✨ NUEVO
│   ├── useAthletes.ts              ✅ Existente
│   ├── useAnalyses.ts              ✅ Existente
│   ├── usePentagonChart.ts         ✅ Existente
│   ├── useDebounce.ts              ✅ Existente
│   └── index.ts                    📝 Actualizado
│
├── utils/
│   ├── analysis.utils.ts           ✨ NUEVO
│   ├── validation.utils.ts         ✨ NUEVO
│   ├── form.utils.ts               ✨ NUEVO
│   ├── constants.ts                ✅ Existente
│   ├── classification.utils.ts     ✅ Existente
│   └── date.utils.ts               ✅ Existente
│
└── styles/
    ├── WeakPointsList.css          ✨ NUEVO
    ├── CapacitiesGrid.css          ✨ NUEVO
    ├── AIAnalysisSelector.css      ✨ NUEVO
    ├── ImageUploader.css           ✨ NUEVO
    ├── AthleteDropdown.css         ✨ NUEVO
    ├── AnalysisTextFields.css      ✨ NUEVO
    ├── SearchBar.css               ✅ Existente
    └── ...
```

---

## 🎯 Plan de Migración por Archivo

### **NuevoAnalisis.tsx** (966 líneas → ~300 líneas estimadas)

**Paso 1:** Imports y hooks
```tsx
// Agregar imports:
import { useOnlineStatus, useImageUpload, useFormMessage, useAIAnalysis, useWeakPoints } from '../hooks'
import { AthleteDropdown, ImageUploader, AIAnalysisSelector, AnalysisTextFields, WeakPointsList, CapacitiesGrid } from '../components/common'
import { formatCapacitiesForSubmit, formatWeakPointsForSubmit, determineClassification, calculateCapacitiesAverage } from '../utils/analysis.utils'
import { validateImageFiles, validateRequiredFields } from '../utils/validation.utils'

// Reemplazar hooks:
const isOnline = useOnlineStatus()
const { images, imagePreviews, handleFileInput, removeImage } = useImageUpload()
const { mensaje, showError, showSuccess } = useFormMessage()
const { aiProcessing, aiProgress, usedAI, generateAIAnalysis, resetAI } = useAIAnalysis()
const { weakPoints, addWeakPoint, removeWeakPoint, updateWeakPoint } = useWeakPoints()
```

**Paso 2:** Reemplazar componentes en JSX (líneas 350-860)
- Línea 350-400: AthleteDropdown
- Línea 430-480: ImageUploader
- Línea 500-610: AIAnalysisSelector
- Línea 620-730: AnalysisTextFields
- Línea 730-770: WeakPointsList
- Línea 775-860: CapacitiesGrid

**Paso 3:** Simplificar handleSubmit
```tsx
const handleSubmit = async (e) => {
  e.preventDefault()
  
  const validation = validateRequiredFields(formData, ['athleteId', 'fechaEvaluacion'])
  if (!validation.valid) {
    showError('Faltan campos requeridos')
    return
  }
  
  const submitData = {
    athleteId: formData.athleteId,
    evaluationDate: new Date(formData.fechaEvaluacion).toISOString(),
    graphs: images,
    capacities: formatCapacitiesForSubmit(formData.capacidadesFisicas),
    weakPoints: formatWeakPointsForSubmit(weakPoints),
    globalClassification: determineClassification(
      calculateCapacitiesAverage(formData.capacidadesFisicas)
    ),
    recommendations: formData.recomendaciones
    // ... otros campos
  }
  
  try {
    await analysisAPI.create(submitData)
    showSuccess('Análisis guardado exitosamente')
    navigate('/analysis')
  } catch (error) {
    showError('Error al guardar análisis')
  }
}
```

---

### **FormularioAnalisis.tsx** (850 líneas → ~400 líneas estimadas)

**Componentes a usar:**
- WeakPointsList (bloque F)
- CapacitiesGrid (si hay capacidades físicas)
- CollapsibleSection (bloques A-G ya usa parcialmente)

**No usar:**
- AIAnalysisSelector (no aplica)
- AnalysisTextFields (no aplica)
- AthleteDropdown (usa datos del prop atleta)

---

## 💡 Beneficios de la Migración

### Reducción de Código
- **NuevoAnalisis.tsx**: 966 → ~300 líneas (-69%)
- **FormularioAnalisis.tsx**: 850 → ~400 líneas (-53%)
- **Total eliminado**: ~1100 líneas duplicadas

### Componentes Reutilizables
- 6 componentes nuevos
- 5 custom hooks nuevos
- 3 archivos de utilidades con 25+ funciones

### Mantenibilidad
- ✅ Un solo lugar para actualizar lógica de puntos débiles
- ✅ Un solo lugar para actualizar UI de capacidades
- ✅ Un solo lugar para lógica de IA
- ✅ Validaciones centralizadas
- ✅ Tests más fáciles (componentes aislados)

---

## 🚀 Orden de Implementación Recomendado

1. **Primero:** Migrar hooks simples (useOnlineStatus, useFormMessage)
2. **Segundo:** Migrar componentes standalone (ImageUploader, AthleteDropdown)
3. **Tercero:** Migrar componentes con hooks (AIAnalysisSelector con useAIAnalysis)
4. **Cuarto:** Migrar componentes con lógica compleja (WeakPointsList con useWeakPoints)
5. **Quinto:** Actualizar handleSubmit con utils
6. **Sexto:** Testing y validación

---

## ⚠️ Notas Importantes

1. **No olvides actualizar imports** en cada archivo
2. **Sincroniza weakPoints con formData** usando useEffect
3. **Valida tipos TypeScript** - algunos interfaces pueden necesitar ajustes
4. **Prueba cada componente** individualmente antes de migrar todo
5. **Git commit** después de cada componente migrado exitosamente

---

## 📞 Componentes Listos para Usar

Todos los archivos están creados y listos. Solo necesitas:

1. Copiar los imports correspondientes
2. Reemplazar las secciones de JSX con los componentes
3. Actualizar los handlers si es necesario
4. Probar que todo funcione

**Total de archivos creados:** 18 archivos nuevos (6 componentes + 6 estilos + 5 hooks + 3 utils + 1 documentación)
