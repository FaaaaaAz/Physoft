// ============================================
// UPLOAD MIDDLEWARE - Multer Configuration
// ============================================
// Handles file uploads for the Textual Analysis / Claude AI endpoint.
// Separate from middleware/upload.ts (photos/graphs) since the allowed
// types (PDF + images) and limits (10MB, 5 files) differ.
// ============================================

import multer from 'multer'
import path from 'path'

const storage = multer.memoryStorage()

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /pdf|jpeg|jpg|png|webp|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
        cb(null, true)
    } else {
        cb(new Error('Only PDF and images are allowed (pdf, jpeg, jpg, png, webp, gif)'))
    }
}

export const uploadClaudeFiles = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max per file
        files: 5
    }
})
