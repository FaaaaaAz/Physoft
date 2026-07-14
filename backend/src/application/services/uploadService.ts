import cloudinary from '../../infrastructure/cloudinaryConfig'

interface UploadResult {
    url: string
    publicId?: string | null
}

export class UploadService {
    /**
     * Upload photo to Cloudinary
     * Uses in-memory buffer for serverless environments (Vercel)
     * @param file - The file to upload (from multer memory storage)
     * @param resourceId - The ID of the resource (athlete ID or analysis ID)
     * @param folder - The Cloudinary folder path (e.g., 'physoft/athletes/ATHLETE_ID' or 'physoft/analysis/ANALYSIS_ID')
     */
    static async uploadPhoto(file: Express.Multer.File, resourceId: string, folder?: string): Promise<UploadResult> {
        // Determine Cloudinary folder
        const cloudinaryFolder = folder || `physoft/athletes/${resourceId}`

        // Check if Cloudinary is configured
        const useCloudinary = process.env.UPLOAD_STRATEGY === 'cloudinary' ||
            (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)

        if (!useCloudinary) {
            throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.')
        }

        try {
            // Upload to Cloudinary using the in-memory buffer
            const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: cloudinaryFolder,
                        public_id: `${resourceId}_${Date.now()}`,
                        resource_type: 'image',
                        // Force JPEG output regardless of source format, so
                        // formats browsers can't render directly (e.g. HEIC,
                        // the default on iPhones) still display correctly.
                        format: 'jpg',
                        overwrite: true,
                        invalidate: true,
                    },
                    (error, result) => {
                        if (error) reject(error)
                        else if (result) resolve(result)
                        else reject(new Error('Unknown Cloudinary error'))
                    }
                )

                // Use the buffer from memory storage (no file system access needed)
                const bufferStream = require('stream').Readable.from(file.buffer)
                bufferStream.pipe(uploadStream)
            })

            console.log('✅ Uploaded to Cloudinary:', result.secure_url)

            return {
                url: result.secure_url,
                publicId: result.public_id
            }
        } catch (error) {
            console.error('❌ Cloudinary upload failed:', error)
            throw new Error(`Failed to upload image to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    /**
     * Upload a document (e.g. PDF) to Cloudinary.
     * Same shape as uploadPhoto, but uses resource_type 'auto' since Cloudinary's
     * 'image' resource type cannot correctly ingest non-image files like PDFs.
     */
    static async uploadDocument(file: Express.Multer.File, resourceId: string, folder?: string): Promise<UploadResult> {
        const cloudinaryFolder = folder || `physoft/analysis/${resourceId}`

        const useCloudinary = process.env.UPLOAD_STRATEGY === 'cloudinary' ||
            (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)

        if (!useCloudinary) {
            throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.')
        }

        try {
            const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: cloudinaryFolder,
                        public_id: `${resourceId}_${Date.now()}`,
                        resource_type: 'auto',
                        overwrite: true,
                        invalidate: true,
                    },
                    (error, result) => {
                        if (error) reject(error)
                        else if (result) resolve(result)
                        else reject(new Error('Unknown Cloudinary error'))
                    }
                )

                const bufferStream = require('stream').Readable.from(file.buffer)
                bufferStream.pipe(uploadStream)
            })

            console.log('✅ Uploaded document to Cloudinary:', result.secure_url)

            return {
                url: result.secure_url,
                publicId: result.public_id
            }
        } catch (error) {
            console.error('❌ Cloudinary document upload failed:', error)
            throw new Error(`Failed to upload document to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    /**
     * Delete photo from Cloudinary
     */
    static async deletePhoto(cloudinaryPublicId?: string | null): Promise<void> {
        // Delete from Cloudinary if ID exists
        if (cloudinaryPublicId) {
            try {
                await cloudinary.uploader.destroy(cloudinaryPublicId)
                console.log('✅ Deleted from Cloudinary:', cloudinaryPublicId)
            } catch (error) {
                console.warn('⚠️ Failed to delete from Cloudinary:', error)
            }
        } else {
            console.warn('⚠️ No Cloudinary public ID provided for deletion')
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
