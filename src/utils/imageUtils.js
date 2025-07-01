export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export const createThumbnail = (file, size = 200) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = size
      canvas.height = size
      
      // Calculate crop area for square thumbnail
      const minDim = Math.min(img.width, img.height)
      const x = (img.width - minDim) / 2
      const y = (img.height - minDim) / 2
      
      ctx.drawImage(img, x, y, minDim, minDim, 0, 0, size, size)
      canvas.toBlob(resolve, 'image/jpeg', 0.8)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please use JPEG, PNG, or WebP.' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 10MB.' }
  }
  
  return { valid: true }
}