// ============================================
// UPLOAD MIDDLEWARE - Multer Configuration
// ============================================
// Handles file uploads for athlete images
// ============================================

import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../public/uploads/athletes')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        // Unique filename: timestamp-random.extension
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

// File filter - only accept images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
        cb(null, true)
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'))
    }
}

// Export configured multer instance
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
})

// Memory storage for AI analysis (needs buffer access)
const memoryStorage = multer.memoryStorage()

export const uploadMemory = multer({
    storage: memoryStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
})
