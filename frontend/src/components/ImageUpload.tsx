import { useState, useRef, ChangeEvent } from 'react'
import { IoCloudUpload, IoImage, IoClose, IoCamera } from 'react-icons/io5'
import '../styles/ImageUpload.css'

interface ImageUploadProps {
    currentImage?: string | null
    onImageSelect: (file: File | null) => void
    disabled?: boolean
    maxSizeMB?: number
}

export default function ImageUpload({
    currentImage,
    onImageSelect,
    disabled = false,
    maxSizeMB = 5
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null)
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const validateFile = (file: File): string | null => {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return 'Solo se permiten imágenes (JPEG, PNG, WebP)'
        }

        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024
        if (file.size > maxSizeBytes) {
            return `La imagen no debe superar ${maxSizeMB}MB`
        }

        return null
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validationError = validateFile(file)
        if (validationError) {
            setError(validationError)
            setPreview(null)
            onImageSelect(null)
            return
        }

        setError(null)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        onImageSelect(file)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (!disabled) {
            setIsDragging(true)
        }
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        if (disabled) return

        const file = e.dataTransfer.files?.[0]
        if (!file) return

        const validationError = validateFile(file)
        if (validationError) {
            setError(validationError)
            setPreview(null)
            onImageSelect(null)
            return
        }

        setError(null)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        onImageSelect(file)
    }

    const handleRemoveImage = () => {
        setPreview(null)
        setError(null)
        onImageSelect(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleClick = () => {
        if (!disabled) {
            fileInputRef.current?.click()
        }
    }

    return (
        <div className="image-upload-container">
            <label className="image-upload-label">
                <IoCamera /> Foto del Atleta
            </label>

            <div
                className={`image-upload-area ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={disabled}
                    style={{ display: 'none' }}
                />

                {preview ? (
                    <div className="image-preview">
                        <img src={preview} alt="Preview" />
                        <button
                            type="button"
                            className="remove-image-btn"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveImage()
                            }}
                            disabled={disabled}
                        >
                            <IoClose />
                        </button>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        {isDragging ? (
                            <>
                                <IoCloudUpload className="upload-icon pulsing" />
                                <p>Suelta la imagen aquí</p>
                            </>
                        ) : (
                            <>
                                <IoImage className="upload-icon" />
                                <p className="upload-text">
                                    <strong>Click para seleccionar</strong> o arrastra una imagen
                                </p>
                                <p className="upload-hint">
                                    JPEG, PNG o WebP • Máx. {maxSizeMB}MB
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="image-upload-error">
                    ⚠️ {error}
                </div>
            )}
        </div>
    )
}
