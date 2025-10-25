# Physoft - Plataforma de Análisis Kinesiológico Deportivo

Sistema profesional de análisis kinesiológico para deportistas que permite crear evaluaciones completas, comparar métricas y generar reportes de rendimiento y mejora.

---

## � Cómo Usar

### Primera Vez (Instalación)

```powershell
# Clonar e instalar
git clone <repo-url>
cd Physoft

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev  # Puerto 3000

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev  # Puerto 5173
```

**Listo!** Abre http://localhost:5173

---

### Comandos Útiles de Prisma

```powershell
# Ver la base de datos en interfaz gráfica
cd backend
npx prisma studio
# Abre en http://localhost:5555

# Crear nueva migración (después de cambiar schema.prisma)
npx prisma migrate dev --name nombre_migracion

# Regenerar cliente Prisma
npx prisma generate
```

---

### Uso Diario (Levantar el Proyecto)

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