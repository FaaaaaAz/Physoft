import { useState } from 'react'

interface UseImageUploadReturn {
  images: File[]
  imagePreviews: string[]
  addImages: (files: File[]) => void
  removeImage: (index: number) => void
  clearImages: () => void
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Hook para gestionar subida de imágenes con previews
 * Usado en: NuevoAnalisis.tsx, FormularioAnalisis.tsx
 */
export function useImageUpload(initialImages: File[] = []): UseImageUploadReturn {
  const [images, setImages] = useState<File[]>(initialImages)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const addImages = (files: File[]) => {
    setImages(prev => [...prev, ...files])

    // Generate previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const clearImages = () => {
    setImages([])
    setImagePreviews([])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      addImages(files)
    }
  }

  return {
    images,
    imagePreviews,
    addImages,
    removeImage,
    clearImages,
    handleFileInput
  }
}
