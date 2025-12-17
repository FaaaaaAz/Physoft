// ============================================
// UPLOAD MIDDLEWARE - Multer Configuration
// ============================================
// Handles file uploads for athlete images
// ============================================

import multer from 'multer'
import path from 'path'

// Use memory storage for Vercel (filesystem is read-only in serverless)
const storage = multer.memoryStorage()

// File filter - only accept images
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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

// Also export as uploadMemory for backward compatibility
export const uploadMemory = upload
