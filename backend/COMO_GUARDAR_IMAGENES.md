# Cómo Guardar Imágenes de Atletas Localmente

## 📁 Opción 1: Almacenamiento Local (Desarrollo)

### 1. Instalar dependencias

```bash
npm install multer
npm install --save-dev @types/multer
```

### 2. Agregar campo `photo` al schema de Prisma

```prisma
model Athlete {
  id          Int       @id @default(autoincrement())
  name        String
  gender      String
  sport       String
  position    String?
  bodyType    String
  height      Float
  weight      Float
  age         Int
  photo       String?   // <- NUEVO: URL de la foto
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  analyses    Analysis[]
  
  @@index([gender, sport, bodyType])
  @@index([age, height, weight])
  @@map("athletes")
}
```

### 3. Crear carpeta para uploads

```bash
mkdir -p backend/public/uploads/athletes
```

### 4. Configurar multer (crear `src/middleware/upload.ts`)

```typescript
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Crear carpeta si no existe
const uploadDir = path.join(__dirname, '../../public/uploads/athletes')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Nombre único: athleteId-timestamp.extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

// Filtro para aceptar solo imágenes
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'))
  }
}

// Límite de tamaño: 5MB
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})
```

### 5. Actualizar el controlador para manejar uploads

```typescript
// athleteController.ts

import { upload } from '../../middleware/upload'

static async create(req: Request, res: Response) {
  try {
    const { name, gender, sport, position, bodyType, height, weight, age } = req.body
    
    // Si hay archivo subido, obtener la URL
    const photo = req.file ? `/uploads/athletes/${req.file.filename}` : null

    const newAthlete = await prisma.athlete.create({
      data: {
        name,
        gender,
        sport,
        position,
        bodyType,
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseInt(age),
        photo, // <- NUEVO
      },
    })

    res.status(201).json({
      success: true,
      data: newAthlete,
      message: 'Athlete created successfully',
    })
  } catch (error) {
    console.error('Error creating athlete:', error)
    res.status(500).json({
      success: false,
      error: 'Error creating athlete',
    })
  }
}

// Método para actualizar foto
static async uploadPhoto(req: Request, res: Response) {
  try {
    const { id } = req.params
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No se subió ninguna imagen'
      })
    }

    const photo = `/uploads/athletes/${req.file.filename}`

    // Obtener atleta actual para eliminar foto anterior
    const athlete = await prisma.athlete.findUnique({
      where: { id: parseInt(id) }
    })

    if (!athlete) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      })
    }

    // Eliminar foto anterior si existe
    if (athlete.photo) {
      const oldPhotoPath = path.join(__dirname, '../../../public', athlete.photo)
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath)
      }
    }

    // Actualizar con nueva foto
    const updatedAthlete = await prisma.athlete.update({
      where: { id: parseInt(id) },
      data: { photo }
    })

    res.json({
      success: true,
      data: updatedAthlete,
      message: 'Photo uploaded successfully'
    })
  } catch (error) {
    console.error('Error uploading photo:', error)
    res.status(500).json({
      success: false,
      error: 'Error uploading photo'
    })
  }
}
```

### 6. Actualizar rutas

```typescript
// athleteRoutes.ts

import { upload } from '../../middleware/upload'

// Crear atleta con foto
router.post('/', upload.single('photo'), AthleteController.create)

// Subir/actualizar foto de atleta existente
router.post('/:id/photo', upload.single('photo'), AthleteController.uploadPhoto)

// Actualizar atleta (sin cambiar foto)
router.put('/:id', AthleteController.update)
```

### 7. Servir archivos estáticos en Express

```typescript
// src/index.ts

import express from 'express'
import path from 'path'

const app = express()

// Servir archivos estáticos desde /public
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

// ... resto de configuración
```

### 8. Usar desde el frontend

```typescript
// Crear atleta con foto
const formData = new FormData()
formData.append('name', 'John Doe')
formData.append('gender', 'Male')
formData.append('sport', 'Soccer')
formData.append('bodyType', 'Mesomorph')
formData.append('height', '180')
formData.append('weight', '75')
formData.append('age', '25')
formData.append('photo', fileInput.files[0]) // <-- archivo de input file

await axios.post('http://localhost:3000/api/atletas', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// Mostrar imagen
<img src={`http://localhost:3000${athlete.photo}`} alt={athlete.name} />
```

---

## ☁️ Opción 2: Cloudinary (Producción Recomendada)

### Ventajas:
- ✅ CDN global (carga rápida en todo el mundo)
- ✅ Optimización automática de imágenes
- ✅ Transformaciones (resize, crop, watermark)
- ✅ No consume espacio en tu servidor
- ✅ Plan gratuito generoso (25 créditos/mes)

### 1. Crear cuenta en Cloudinary

1. Ir a https://cloudinary.com
2. Crear cuenta gratis
3. Obtener: Cloud Name, API Key, API Secret

### 2. Instalar SDK

```bash
npm install cloudinary
```

### 3. Configurar Cloudinary

```typescript
// src/config/cloudinary.ts

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default cloudinary
```

### 4. Agregar a `.env`

```
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 5. Middleware para Cloudinary

```typescript
// src/middleware/uploadCloudinary.ts

import multer from 'multer'

// Guardar en memoria (no en disco)
const storage = multer.memoryStorage()

export const uploadMemory = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes'))
    }
  }
})
```

### 6. Controlador con Cloudinary

```typescript
import cloudinary from '../../config/cloudinary'
import streamifier from 'streamifier'

static async uploadPhoto(req: Request, res: Response) {
  try {
    const { id } = req.params
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No se subió ninguna imagen'
      })
    }

    const athlete = await prisma.athlete.findUnique({
      where: { id: parseInt(id) }
    })

    if (!athlete) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      })
    }

    // Eliminar foto anterior de Cloudinary si existe
    if (athlete.photo) {
      const publicId = athlete.photo.split('/').pop()?.split('.')[0]
      if (publicId) {
        await cloudinary.uploader.destroy(`athletes/${publicId}`)
      }
    }

    // Subir nueva foto a Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'athletes',
        public_id: `athlete_${id}_${Date.now()}`,
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
          { quality: 'auto' }
        ]
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            error: 'Error uploading to Cloudinary'
          })
        }

        // Actualizar URL en la base de datos
        const updatedAthlete = await prisma.athlete.update({
          where: { id: parseInt(id) },
          data: { photo: result.secure_url }
        })

        res.json({
          success: true,
          data: updatedAthlete,
          message: 'Photo uploaded successfully'
        })
      }
    )

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream)
  } catch (error) {
    console.error('Error uploading photo:', error)
    res.status(500).json({
      success: false,
      error: 'Error uploading photo'
    })
  }
}
```

---

## 🔄 Resumen: ¿Cuál usar?

| Criterio | Local | Cloudinary |
|----------|-------|-----------|
| **Desarrollo** | ✅ Perfecto | ⚠️ Innecesario |
| **Producción** | ❌ No escalable | ✅ Recomendado |
| **Costo** | Gratis | Gratis hasta 25GB |
| **Velocidad** | Depende del servidor | CDN global rápido |
| **Backup** | Manual | Automático |
| **Optimización** | Manual | Automática |

### Recomendación:
1. **Desarrollo**: Usa almacenamiento local
2. **Producción**: Migra a Cloudinary

Puedes guardar la URL de Cloudinary en el mismo campo `photo` de la base de datos, así el código del frontend es idéntico en ambos casos.
