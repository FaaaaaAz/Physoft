# 🌐 DEPLOYMENT A VERCEL - Physoft Web Version

Esta es la versión web de Physoft, optimizada para deployment en Vercel.

## 📋 CAMBIOS REALIZADOS EN ESTA RAMA

### Frontend:
- ✅ Cambiado `HashRouter` → `BrowserRouter`
- ✅ Configuración de Vite optimizada para web
- ✅ Base path cambiado de `'./'` a `'/'`

### Backend:
- ✅ Adaptado para funcionar en modo serverless (Vercel)
- ✅ Agregado `vercel.json` para configuración
- ✅ Export de la app Express para Vercel

### Base de Datos:
- ✅ Ya está en Supabase (PostgreSQL cloud)
- ✅ No requiere cambios

---

## 🚀 INSTRUCCIONES DE DEPLOYMENT

### PASO 1: PUSH LA RAMA A GITHUB

```bash
# Ya estás en la rama physoft_web
git add .
git commit -m "Web version ready for Vercel deployment"
git push origin physoft_web
```

---

### PASO 2: DEPLOY DEL BACKEND EN VERCEL

1. Ve a https://vercel.com y haz login con tu cuenta de GitHub
2. Haz clic en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio `Physoft`
4. **IMPORTANTE:** Antes de hacer click en "Deploy", configura lo siguiente:

   **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** Click en "Edit" y selecciona `backend`
   - **Build Command:** `npm run build` o déjalo vacío
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

   **Environment Variables (Add):**
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@<HOST>:5432/postgres
   CLOUDINARY_CLOUD_NAME=tu_cloudinary_cloud_name
   CLOUDINARY_API_KEY=tu_cloudinary_api_key
   CLOUDINARY_API_SECRET=tu_cloudinary_api_secret
   AI_PROVIDER=openai
   OPENAI_API_KEY=tu_openai_api_key
   OPENAI_MODEL=gpt-4.1-mini
   # Si usas Gemini en vez de OpenAI:
   # AI_PROVIDER=gemini
   # GEMINI_API_KEY=tu_gemini_api_key
   # GEMINI_MODEL=gemini-2.5-flash
   CORS_ORIGINS=*
   LOG_LEVEL=info
   VERCEL=1
   ```

   **Git Branch:** Selecciona `physoft_web` en lugar de `main`

5. Haz clic en **"Deploy"**
6. Espera 2-3 minutos
7. Una vez deployado, copia la URL (ej: `https://physoft-backend.vercel.app`)
8. **GUARDA ESTA URL** - la necesitarás para el frontend

---

### PASO 3: DEPLOY DEL FRONTEND EN VERCEL

1. En Vercel, haz clic en **"Add New..."** → **"Project"** nuevamente
2. Selecciona el mismo repositorio `Physoft`
3. Configura:

   **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** Click en "Edit" y selecciona `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

   **Environment Variables (Add):**
   ```
   VITE_API_URL=https://TU-BACKEND-URL.vercel.app/api
   ```
   ⚠️ **REEMPLAZA** `TU-BACKEND-URL` con la URL del backend del PASO 2

   **Git Branch:** Selecciona `physoft_web`

4. Haz clic en **"Deploy"**
5. Espera 2-3 minutos
6. ¡Listo! Tu app está en línea

---

### PASO 4: ACTUALIZAR CORS EN EL BACKEND

1. En Vercel, ve al proyecto del **Backend**
2. Ve a **Settings** → **Environment Variables**
3. Edita la variable `CORS_ORIGINS`
4. Cámbiala por la URL de tu frontend:
   ```
   CORS_ORIGINS=https://tu-frontend.vercel.app
   ```
5. Haz clic en **Save**
6. Ve a **Deployments** → Haz clic en los 3 puntos del deployment más reciente → **Redeploy**

---

## 🎯 CONFIGURAR VERCEL PARA USAR RAMA ESPECÍFICA

Por defecto Vercel usa `main`, pero puedes cambiarlo:

### Opción 1: Durante la creación del proyecto
- Cuando creas el proyecto, en "Configure Project"
- Hay una sección **"Git"** o **"Production Branch"**
- Selecciona `physoft_web` como rama de producción

### Opción 2: Después de crear el proyecto
1. Ve al proyecto en Vercel
2. Click en **Settings**
3. Click en **Git** en el menú lateral
4. En **Production Branch**, cambia de `main` a `physoft_web`
5. Save

### Opción 3: Deploy específico de rama
- Cada vez que hagas push a `physoft_web`
- Vercel automáticamente detecta y hace deploy
- No necesitas hacer nada más

---

## ✅ VERIFICACIÓN POST-DEPLOYMENT

### Backend:
Abre en tu navegador: `https://tu-backend.vercel.app/api/health`

Deberías ver:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### Frontend:
Abre: `https://tu-frontend.vercel.app`

Deberías ver la página de bienvenida de Physoft.

---

## 🔧 TROUBLESHOOTING

### Error: "Cannot find module @prisma/client"
**Solución:** Agrega en Environment Variables del backend:
```
PRISMA_GENERATE_SKIP_POSTINSTALL=false
```

### Error: "CORS policy error"
**Solución:** Verifica que:
1. La variable `CORS_ORIGINS` en el backend incluya la URL del frontend
2. El frontend use la URL correcta del backend en `VITE_API_URL`

### Error: "Database connection failed"
**Solución:** Verifica que la `DATABASE_URL` esté correcta en las variables de entorno de Vercel.

### Frontend carga pero no hay datos
**Solución:** Revisa la consola del navegador (F12) y verifica que las requests van al backend correcto.

---

## 📝 URLS FINALES

Una vez deployado, tendrás:

- **Frontend:** `https://physoft-XXXXX.vercel.app`
- **Backend:** `https://physoft-backend-XXXXX.vercel.app`
- **Base de Datos:** Supabase (ya configurada)

---

## 🔄 ACTUALIZAR LA APP

Para hacer cambios y redeployar:

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de cambios"
git push origin physoft_web
```

Vercel automáticamente detecta el push y redeploya ambos proyectos.

---

## 💰 COSTOS

- **Vercel:** Gratis hasta 100 GB de bandwidth/mes
- **Supabase:** Gratis hasta 500 MB de base de datos
- **Total:** $0/mes para empezar

---

¡Listo! Tu app web está deployada 🎉
