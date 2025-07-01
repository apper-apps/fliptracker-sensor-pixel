import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const PhotoUpload = ({ onPhotosChange, photos = [] }) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files)
    
    const newPhotos = fileArray.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      caption: ''
    }))
    
    onPhotosChange([...photos, ...newPhotos])
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }
  
  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId)
    onPhotosChange(updatedPhotos)
  }
  
  const updateCaption = (photoId, caption) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, caption } : photo
    )
    onPhotosChange(updatedPhotos)
  }
  
  const openCamera = () => {
    fileInputRef.current.accept = 'image/*'
    fileInputRef.current.capture = 'environment'
    fileInputRef.current.click()
  }
  
  const openGallery = () => {
    fileInputRef.current.accept = 'image/*'
    fileInputRef.current.removeAttribute('capture')
    fileInputRef.current.click()
  }
  
  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
>
        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            <Button
              variant="primary"
              icon="Camera"
              onClick={openCamera}
              className="flex-1 sm:flex-none text-base py-3 px-6"
            >
              📷 Take Photo
            </Button>
<Button
              variant="secondary"
              icon="Upload"
              onClick={openGallery}
              className="flex-1 sm:flex-none py-3 px-6"
            >
              📁 Gallery
            </Button>
          </div>
<p className="text-sm text-gray-500">
            Or drag and drop photos here • Capture progress instantly
          </p>
          <p className="text-xs text-gray-400">
            {photos.length} photos added
          </p>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      
      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="card overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <img
                  src={photo.url}
                  alt="Upload preview"
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Add caption..."
                  value={photo.caption}
                  onChange={(e) => updateCaption(photo.id, e.target.value)}
                  className="w-full text-sm border-none focus:outline-none bg-transparent placeholder-gray-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PhotoUpload