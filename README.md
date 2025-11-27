# 🚀 Guía de Instalación y Ejecución - Physoft

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (viene incluido con Node.js)
- **Git** - [Descargar](https://git-scm.com/)

### Verificar instalación
```bash
node --version  # Debería mostrar v18.x.x o superior
npm --version   # Debería mostrar 9.x.x o superior
```

---

## 🗄️ Backend Setup

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar base de datos
```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones y seed (crea la BD con datos de ejemplo)
npx prisma migrate dev --name init
```

### 3. Ejecutar backend
```bash
# Modo desarrollo (con hot reload)
npm run dev

# El backend estará disponible en: http://localhost:3000
```

### 4. Verificar funcionamiento
```bash
# Probar endpoint de atletas
curl http://localhost:3000/api/atletas

# Deberías ver una respuesta JSON con atletas de ejemplo
```

---

## 🎨 Frontend Setup

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Ejecutar frontend
```bash
# Modo desarrollo (con hot reload)
npm run dev

# El frontend estará disponible en: http://localhost:5173
```

### 3. Verificar funcionamiento
Abre tu navegador y ve a: `http://localhost:5173`

Deberías ver la aplicación Physoft funcionando.

---

## 🔄 Ejecutar Ambos Simultáneamente

### Opción 1: Script automático (Recomendado)
```bash
# Linux/Mac
./run-dev.sh

# Windows
.\run-dev.bat
```

### Opción 2: Terminales separadas
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Opción 3: Usar concurrently
1. Instalar `concurrently` globalmente:
```bash
npm install -g concurrently
```

2. Ejecutar ambos desde la raíz:
```bash
# Desde la raíz del proyecto
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

---

## 📁 Estructura del Proyecto

```
physoft/
├── backend/                 # API REST con Node.js + Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma    # Esquema de base de datos
│   │   └── seed.ts          # Datos de ejemplo
│   ├── src/
│   │   ├── domain/          # Lógica de dominio
│   │   ├── application/     # Servicios de aplicación
│   │   ├── infrastructure/  # Capa de infraestructura
│   │   └── presentation/    # Controladores y rutas
│   └── package.json
├── frontend/                # SPA con React + Vite + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios API
│   │   └── styles/         # Estilos CSS
│   └── package.json
└── README.md
```

---

## 🐛 Solución de Problemas

### Backend no inicia
- Verifica que el puerto 3000 esté libre
- Asegúrate de que la base de datos SQLite se creó correctamente
- Revisa los logs de error en la terminal

### Frontend no inicia
- Verifica que el puerto 5173 esté libre
- Asegúrate de que el backend esté corriendo en el puerto 3000
- Limpia el cache: `rm -rf node_modules/.vite && npm run dev`

### Errores de Prisma
```bash
# Regenerar cliente de Prisma
cd backend
npx prisma generate

# Resetear base de datos (borra todos los datos)
npx prisma migrate reset --force
```

### Errores de dependencias
```bash
# Limpiar y reinstalar dependencias
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

---

## 📡 Endpoints de la API

### Atletas
- `GET /api/atletas` - Listar atletas (con filtros opcionales)
- `GET /api/atletas/:id` - Obtener atleta por ID
- `POST /api/atletas` - Crear nuevo atleta
- `PUT /api/atletas/:id` - Actualizar atleta
- `DELETE /api/atletas/:id` - Eliminar atleta
- `GET /api/atletas/:id/comparar` - Comparar atleta con cohorte
- `GET /api/atletas/estadisticas/resumen` - Estadísticas generales

### Análisis
- `GET /api/analisis` - Listar análisis (con filtros opcionales)
- `GET /api/analisis/:id` - Obtener análisis por ID
- `GET /api/analisis/atleta/:athleteId` - Análisis de un atleta
- `POST /api/analisis` - Crear nuevo análisis
- `PUT /api/analisis/:id` - Actualizar análisis
- `DELETE /api/analisis/:id` - Eliminar análisis
- `GET /api/analisis/estadisticas/resumen` - Estadísticas de análisis

---

## 🔐 Variables de Entorno

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
PORT=3000
```

### Frontend (.env)
```env
VITE_API_BASE_URL="http://localhost:3000"
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa esta guía paso a paso
2. Verifica los logs de error en las terminales
3. Asegúrate de que todos los prerrequisitos estén instalados
4. Limpia cachés y reinstala dependencias si es necesario

¡La aplicación debería estar funcionando correctamente siguiendo estos pasos!

**Necesitas 2 terminales:**

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/ping
- **Prisma Studio**: http://localhost:5555 (después de `npx prisma studio`)

---

## 🧪 Probar la Aplicación

### Flujo Completo Actual (con mock data):

1. **Welcome** → Click "Comenzar"
2. **Dashboard** → Ver 10 atletas mock
   - Buscar por nombre
   - Filtrar por género/disciplina/somatotipo
   - Click en atleta para ver modal de detalles
3. **Análisis** → Click en navbar "Análisis"
   - Ver stats y tabla de análisis recientes
   - Click "Crear Nuevo Análisis"
4. **Modal Selección** → "¿El atleta ya existe?"
   - Sí → Buscar atleta en lista
   - No → Ir a formulario directamente
5. **Formulario** → Completar evaluación kinesiológica
   - Expandir/colapsar bloques A-G
   - Subir archivos (simulado)
   - Guardar borrador (simulado)
   - Enviar análisis (simulado)

**Nota:** Todo funciona visualmente, pero NO se guarda en base de datos todavía.

---

## 🗂️ Estructura del Proyecto

```
Physoft/
├── backend/
│   ├── src/
│   │   ├── domain/          # Entidades y lógica de negocio
│   │   ├── application/     # Casos de uso
│   │   ├── infrastructure/  # Prisma, DB, servicios externos
│   │   └── presentation/    # Controllers, routes, middleware
│   ├── prisma/
│   │   ├── schema.prisma    # Modelos de base de datos
│   │   └── seed.ts          # Datos de prueba
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Welcome, Dashboard, Analisis
│   │   ├── components/      # Atleta cards, modals, forms
│   │   ├── styles/          # CSS modules
│   │   ├── assets/          # Imágenes (player1-5.png)
│   │   └── App.tsx          # Router principal
│   └── package.json
│
└── README.md
```

---

## 📊 Base de Datos

### Modelos Principales

**Atleta**
- `id`, `nombre`, `genero`, `disciplina`, `posicion`, `somatotipo`
- `altura` (cm), `peso` (lbs), `edad`
- Relación con análisis

**Analisis**
- `id`, `atletaId`, `fechaAnalisis`, `tipoAnalisis`
- `datosJson` (datos flexibles en JSON)
- `estadoGeneral`, `puntoDebil1/2/3`, `margenMejora`

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3.1** - Biblioteca UI
- **TypeScript 5.6.2** - Tipado estático
- **Vite 5.4.21** - Build tool ultrarrápido
- **React Icons** - Iconografía (io5)
- **CSS Modules** - Estilos con tema oscuro profesional
- **Axios** (por implementar) - Cliente HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express 4.21.1** - Framework web
- **TypeScript 5.6.3** - Tipado estático
- **Prisma ORM 5.20.0** - ORM moderno
- **SQLite** - Base de datos desarrollo
- **PostgreSQL** - Base de datos producción (futuro)
- **CORS + Helmet** - Seguridad
- **Morgan** - Logging HTTP
- **ts-node-dev** - Hot reload en desarrollo

### Arquitectura Backend
- **Clean Architecture** - Separación de capas
  - `domain/` - Entidades y lógica de negocio
  - `application/` - Casos de uso
  - `infrastructure/` - Prisma, DB, servicios externos
  - `presentation/` - Controllers, routes, middleware

---