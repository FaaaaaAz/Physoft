import { useState } from 'react'
import { IoCloudUpload, IoTrash } from 'react-icons/io5'
import './ImageUploader.css'

interface ImageUploaderProps {
    images: File[]
    onImagesChange: (images: File[]) => void
    disabled?: boolean
    required?: boolean
}

function ImageUploader({ images, onImagesChange, disabled = false, required = false }: ImageUploaderProps) {
    const [previews, setPreviews] = useState<string[]>([])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            onImagesChange([...images, ...files])

            // Generate previews
            files.forEach(file => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, reader.result as string])
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const handleRemoveImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index))
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="image-uploader">
            <label>Attach Graph Images {required && '*'}</label>
            <div className="upload-zone">
                <input
                    type="file"
                    id="images-input"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={disabled}
                    style={{ display: 'none' }}
                />
                <label htmlFor="images-input" className="upload-label">
                    <IoCloudUpload />
                    <span>Upload Images</span>
                    <p>Click to select graph images</p>
                </label>
            </div>

            {previews.length > 0 && (
                <div className="images-grid">
                    {previews.map((preview, index) => (
                        <div key={index} className="image-preview-item">
                            <img src={preview} alt={`Graph ${index + 1}`} />
                            <button
                                type="button"
                                className="btn-remove-image"
                                onClick={() => handleRemoveImage(index)}
                                disabled={disabled}
                            >
                                <IoTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ImageUploader
