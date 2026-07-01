import { useState, useRef, DragEvent } from 'react'
import { IoCloudUpload, IoImage, IoClose } from 'react-icons/io5'
import './ImageUpload.css'

interface ImageUploadProps {
    currentImage: string | null
    onImageSelect: (file: File | null) => void
    disabled?: boolean
}

function ImageUpload({ currentImage, onImageSelect, disabled = false }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file')
            return
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must not exceed 5MB')
            return
        }

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Pass file to parent
        onImageSelect(file)
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (!disabled) {
            setIsDragging(true)
        }
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        if (disabled) return

        const file = e.dataTransfer.files[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleRemove = () => {
        setPreview(null)
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
            <label className="image-upload-label">Patient Photo</label>

            <div
                className={`image-upload-dropzone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                {preview ? (
                    <div className="image-preview-container">
                        <img src={preview} alt="Preview" className="image-preview" />
                        {!disabled && (
                            <button
                                type="button"
                                className="image-remove-btn"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemove()
                                }}
                            >
                                <IoClose />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="image-upload-placeholder">
                        <IoCloudUpload className="upload-icon" />
                        <p className="upload-text">
                            Drag an image here or <span className="upload-link">click to select</span>
                        </p>
                        <p className="upload-hint">
                            <IoImage /> PNG, JPG, WEBP (max. 5MB)
                        </p>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                disabled={disabled}
            />
        </div>
    )
}

export { ImageUpload }
