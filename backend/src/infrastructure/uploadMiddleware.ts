import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../public/uploads/athletes')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Storage configuration for local uploads
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-random.extension
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

// Memory storage for Cloudinary uploads
const memoryStorage = multer.memoryStorage()

// File filter to accept only images
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

// Determine upload strategy from environment
const uploadStrategy = process.env.UPLOAD_STRATEGY || 'local'

// Export multer middleware based on strategy
export const upload = multer({
    storage: uploadStrategy === 'cloudinary' ? memoryStorage : localStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
})
