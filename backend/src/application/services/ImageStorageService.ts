// ============================================
// IMAGE STORAGE SERVICE - Application Layer
// ============================================
// Handles hybrid image storage (local + Cloudinary)
// ============================================

import cloudinary from '../../config/cloudinary'
import fs from 'fs'
import path from 'path'

export class ImageStorageService {
    /**
     * Upload an image to Cloudinary (if internet is available)
     * Returns Cloudinary URL and publicId
     */
    static async uploadToCloudinary(
        filePath: string,
        athleteId: number
    ): Promise<{ url: string; publicId: string } | null> {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'physoft/athletes',
                public_id: `athlete_${athleteId}_${Date.now()}`,
                transformation: [
                    { width: 400, height: 400, crop: 'fill' },
                    { quality: 'auto' }
                ]
            })

            return {
                url: result.secure_url,
                publicId: result.public_id
            }
        } catch (error) {
            console.warn('⚠️ Failed to upload to Cloudinary (offline mode?):', error)
            return null
        }
    }

    /**
     * Delete an image from Cloudinary
     */
    static async deleteFromCloudinary(publicId: string): Promise<boolean> {
        try {
            await cloudinary.uploader.destroy(publicId)
            return true
        } catch (error) {
            console.warn('⚠️ Failed to delete from Cloudinary:', error)
            return false
        }
    }

    /**
     * Delete a local image file
     */
    static deleteLocalImage(photoPath: string): boolean {
        try {
            const fullPath = path.join(__dirname, '../../../public', photoPath)
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath)
                return true
            }
            return false
        } catch (error) {
            console.error('❌ Error deleting local image:', error)
            return false
        }
    }
}
