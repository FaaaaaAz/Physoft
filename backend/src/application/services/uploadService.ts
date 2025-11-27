import path from 'path'
import fs from 'fs'
import cloudinary from '../../infrastructure/cloudinaryConfig'
import streamifier from 'streamifier'

interface UploadResult {
    url: string
    publicId?: string | null
}

export class UploadService {
    /**
     * Upload photo - Dual Strategy (Local + Cloudinary)
     * Always saves locally first for offline support.
     * Attempts to upload to Cloudinary if credentials exist.
     */
    static async uploadPhoto(file: Express.Multer.File, athleteId: string): Promise<UploadResult> {
        // 1. Always save locally first (Multer already did this to disk)
        const filename = file.filename
        const localUrl = `/uploads/athletes/${filename}`
        let cloudinaryUrl: string | null = null
        let publicId: string | null = null

        // 2. Try to upload to Cloudinary if configured
        const useCloudinary = process.env.UPLOAD_STRATEGY === 'cloudinary' ||
            (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)

        if (useCloudinary) {
            try {
                const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'physoft/athletes',
                            public_id: `athlete_${athleteId}_${Date.now()}`,
                            resource_type: 'image',
                            overwrite: true,
                            invalidate: true,
                        },
                        (error, result) => {
                            if (error) reject(error)
                            else if (result) resolve(result)
                            else reject(new Error('Unknown Cloudinary error'))
                        }
                    )

                    // Read from the local file that Multer saved
                    const filePath = path.join(__dirname, '../../../public/uploads/athletes', filename)
                    fs.createReadStream(filePath).pipe(uploadStream)
                })

                cloudinaryUrl = result.secure_url
                publicId = result.public_id
                console.log('✅ Uploaded to Cloudinary:', cloudinaryUrl)
            } catch (error) {
                console.warn('⚠️ Cloudinary upload failed (using local file only):', error)
                // Continue without Cloudinary - offline mode fallback
            }
        }

        // 3. Return Cloudinary URL if available, otherwise local URL
        // We could store both, but for now we return the best available one
        return {
            url: cloudinaryUrl || localUrl,
            publicId: publicId
        }
    }

    /**
     * Delete photo - Try to delete from both sources
     */
    static async deletePhoto(photoUrl: string, cloudinaryPublicId?: string | null): Promise<void> {
        // 1. Try to delete from Cloudinary if ID exists
        if (cloudinaryPublicId) {
            try {
                await cloudinary.uploader.destroy(cloudinaryPublicId)
            } catch (error) {
                console.warn('Failed to delete from Cloudinary:', error)
            }
        }

        // 2. Always try to delete local file if it looks like a local path
        // Or if it was a Cloudinary URL, we might still have the local file (if we kept the filename consistent)
        // For now, we only delete local if the URL stored points to local
        if (photoUrl && photoUrl.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '../../../public', photoUrl)
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath)
                } catch (error) {
                    console.warn('Failed to delete local file:', error)
                }
            }
        }
    }

    /**
     * Get full photo URL for response
     */
    static getPhotoUrl(photoPath: string | null): string | null {
        if (!photoPath) return null

        // If it's a Cloudinary URL, return as is
        if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
            return photoPath
        }

        // For local files, return the path (frontend will prepend API URL)
        return photoPath
    }
}
