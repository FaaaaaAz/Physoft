import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

// Ensure env vars are loaded
dotenv.config()

// Configure Cloudinary if credentials are present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    console.log('✅ Cloudinary configured with cloud_name:', process.env.CLOUDINARY_CLOUD_NAME)
} else {
    console.warn('⚠️ Cloudinary credentials missing in .env')
}

export default cloudinary
