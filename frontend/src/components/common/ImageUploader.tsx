import { IoCloudUpload, IoTrash } from 'react-icons/io5'
import '../../styles/ImageUploader.css'

interface ImageUploaderProps {
  images: File[]
  imagePreviews: string[]
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: (index: number) => void
  maxImages?: number
  disabled?: boolean
  required?: boolean
}

/**
 * Componente reutilizable para subir y gestionar imágenes
 * Usado en: NuevoAnalisis.tsx, FormularioAnalisis.tsx
 */
function ImageUploader({
  images,
  imagePreviews,
  onUpload,
  onDelete,
  maxImages = 10,
  disabled = false,
  required = false
}: ImageUploaderProps) {
  const canUploadMore = images.length < maxImages

  return (
    <div className="image-uploader-container">
      <div className="upload-area">
        <label className={`upload-label ${!canUploadMore || disabled ? 'disabled' : ''}`}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onUpload}
            className="upload-input"
            disabled={!canUploadMore || disabled}
            required={required && images.length === 0}
          />
          <div className="upload-content">
            <IoCloudUpload className="upload-icon" />
            <p className="upload-text">
              {canUploadMore 
                ? 'Arrastra imágenes aquí o haz clic para seleccionar' 
                : `Máximo ${maxImages} imágenes alcanzado`}
            </p>
            <p className="upload-subtext">
              PNG, JPG, JPEG (Máx {maxImages} archivos)
            </p>
          </div>
        </label>
      </div>

      {images.length > 0 && (
        <div className="images-preview-grid">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="image-preview-item">
              <img src={preview} alt={`Preview ${index + 1}`} className="preview-image" />
              <button
                type="button"
                className="btn-delete-image"
                onClick={() => onDelete(index)}
                disabled={disabled}
                aria-label="Eliminar imagen"
              >
                <IoTrash />
              </button>
              <div className="image-overlay">
                <span className="image-name">{images[index]?.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="images-count">
          {images.length} de {maxImages} imágenes subidas
        </p>
      )}
    </div>
  )
}

export default ImageUploader
