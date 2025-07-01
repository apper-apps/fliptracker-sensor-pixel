import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Camera } from "react-camera-pro";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const PhotoUpload = ({ onPhotosChange, photos = [] }) => {
  const fileInputRef = useRef(null)
  const cameraRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [cameraMode, setCameraMode] = useState(false)
  const [captureCount, setCaptureCount] = useState(0)
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
    const photoToRemove = photos.find(photo => photo.id === photoId)
    if (photoToRemove?.url && photoToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.url)
    }
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
    setCameraMode(true)
    setCaptureCount(0)
  }
  
const capturePhoto = () => {
    if (cameraRef.current) {
      const imageSrc = cameraRef.current.takePhoto()
      
      // Convert base64 to blob for consistency
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          // Create file-like object without File constructor
          const fileObject = Object.assign(blob, {
            name: `camera-photo-${Date.now()}.jpg`,
            lastModified: Date.now()
          })
          
          const newPhoto = {
            id: Date.now() + Math.random(),
            file: fileObject,
            url: imageSrc,
            caption: ''
          }
          
          onPhotosChange([...photos, newPhoto])
          setCaptureCount(prev => prev + 1)
          toast.success(`Photo ${captureCount + 1} captured!`)
        })
        .catch(error => {
          console.error('Error capturing photo:', error)
          toast.error('Failed to capture photo')
        })
    }
  }
  
  const exitCamera = () => {
    setCameraMode(false)
    setCaptureCount(0)
    if (captureCount > 0) {
      toast.success(`${captureCount} photos added successfully!`)
    }
  }
  
  const openGallery = () => {
    fileInputRef.current.accept = 'image/*'
    fileInputRef.current.removeAttribute('capture')
    fileInputRef.current.click()
  }
  
return (
    <div className="space-y-4">
      {cameraMode ? (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <Camera
            ref={cameraRef}
            aspectRatio={4/3}
            numberOfCamerasCallback={numberOfCameras => console.log('Cameras available:', numberOfCameras)}
            errorMessages={{
              noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
              permissionDenied: 'Permission denied. Please refresh and give camera permission.',
              switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
              canvas: 'Canvas is not supported.'
            }}
          />
          
          {/* Camera Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="text-white text-sm">
                {captureCount > 0 && `${captureCount} photos taken`}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={capturePhoto}
                  variant="primary"
                  className="bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-full"
                >
                  📷 Capture
                </Button>
                
                {captureCount > 0 && (
                  <Button
                    onClick={capturePhoto}
                    variant="secondary"
                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-3 rounded-full"
                  >
                    Take Another
                  </Button>
                )}
                
                <Button
                  onClick={exitCamera}
                  variant="secondary"
                  className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-3 rounded-full"
                >
                  {captureCount > 0 ? `Done (${captureCount})` : 'Cancel'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
                📷 Take Photos
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
              Or drag and drop photos here • Take unlimited photos per update
            </p>
            <p className="text-xs text-gray-400">
              {photos.length} photos added
            </p>
          </div>
        </div>
      )}
      
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