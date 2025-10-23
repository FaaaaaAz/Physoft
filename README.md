# Physoft - Plataforma de Análisis Deportivo

Plataforma de análisis deportivo que permite subir análisis musculoesqueléticos (BTS) y compararlos con una base de datos de atletas para generar reportes de rendimiento.

---

## 🚀 Cómo Usar

### Primera Vez (Instalación)

```powershell
# 1. Instalar dependencias del frontend
cd frontend
npm install
cd ..

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Configurar variables de entorno
Copy-Item .env.example .env

# 4. Generar Prisma y crear base de datos
npx prisma generate
npx prisma migrate dev --name init

cd ..
```

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

---

---

## � Base de Datos

### Modelos Principales

**Atleta**
- `id`, `nombre`, `genero`, `disciplina`, `posicion`, `somatotipo`
- `altura` (cm), `peso` (lbs), `edad`
- Relación con análisis

**Analisis**
- `id`, `atletaId`, `fechaAnalisis`, `tipoAnalisis`
- `datosJson` (datos flexibles en JSON)
- `estadoGeneral`, `puntoDebil1/2/3`, `margenMejora`

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

## 🛠️ Tecnologías

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- React Router DOM (navegación)
- Axios (HTTP client)
- CSS plano (modo oscuro + turquesa)

### Backend
- Node.js + Express + TypeScript
- Prisma ORM
- SQLite (desarrollo) / PostgreSQL (producción)
- CORS + Helmet (seguridad)

---

## 📁 Estructura del Proyecto

```
Physoft/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── pages/          # Páginas
│   │   ├── components/     # Componentes reutilizables
│   │   ├── services/       # API calls (axios)
│   │   └── styles/         # CSS
│   └── package.json
│
└── backend/                # Express + Prisma
    ├── src/
    │   ├── domain/         # Entidades y reglas de negocio
    │   ├── application/    # Servicios y lógica
    │   ├── infrastructure/ # Prisma client
    │   └── presentation/   # Routes y controllers
    ├── prisma/
    │   ├── schema.prisma   # Modelos de DB
    │   └── dev.db          # SQLite (no se sube a Git)
    └── package.json
```

---

## 🔧 Endpoints API

```
GET    /api/ping              # Health check
GET    /api/atletas           # Obtener todos los atletas
GET    /api/atletas/:id       # Obtener un atleta
POST   /api/atletas           # Crear atleta
PUT    /api/atletas/:id       # Actualizar atleta
DELETE /api/atletas/:id       # Eliminar atleta
GET    /api/atletas/:id/comparar  # Comparar con cohorte
```

---

## 🎨 Reglas de Comparación (MVP)

### Atletas ≥ 17 años
- Altura: ±7 cm
- Peso: ±20 lbs
- Edad: ±3 años

### Atletas < 17 años
- Altura: ±5 cm
- Peso: ±15 lbs
- Edad: ±1 año

**Criterios adicionales:**
- Mismo género
- Misma disciplina
- Mismo somatotipo
- Posición comparable (si aplica)

---

## 🐛 Troubleshooting

### Puerto ocupado
```powershell
# Ver qué está usando el puerto 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ver qué está usando el puerto 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Reinstalar dependencias
```powershell
# Frontend o Backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Error de Prisma
```powershell
cd backend
npx prisma generate
npx prisma migrate dev
```

---

## 🌿 Flujo de Trabajo Git

```bash
# Crear feature branch
git checkout -b feature/nombre-feature

# Hacer commits
git add .
git commit -m "feat: descripción del cambio"

# Push
git push origin feature/nombre-feature
```

**Convenciones de commits:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `refactor:` Refactorización
- `style:` Estilos/formato
- `test:` Tests

---

## 📝 Notas Importantes

- Los archivos `.env`, `node_modules/` y `dev.db` NO se suben a Git
- Prisma corre automáticamente con el backend, no necesitas levantarlo aparte
- El frontend se recarga automáticamente al hacer cambios (hot-reload)
- El backend se recarga automáticamente con ts-node-dev

---

**Versión**: 1.0.0 MVP  
**Última actualización**: Octubre 2025
