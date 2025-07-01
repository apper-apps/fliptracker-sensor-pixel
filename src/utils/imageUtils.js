import React from "react";
import Error from "@/components/ui/Error";
/**
 * Image utility functions for compression and processing
 * Enhanced with error handling and validation
 */

export const compressImage = async (file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) => {
  // Input validation
  if (!file) {
    throw new Error('No file provided for compression');
  }

  if (!(file instanceof File || file instanceof Blob)) {
    throw new Error('Invalid file type provided');
  }

  // Check if it's an image
  if (file.type && !file.type.startsWith('image/')) {
    throw new Error('File is not an image');
  }

  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not supported'));
        return;
      }

      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          
          // Validate original dimensions
          if (width <= 0 || height <= 0) {
            reject(new Error('Invalid image dimensions'));
            return;
          }
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              // Clean up
              URL.revokeObjectURL(img.src);
              
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image - blob creation failed'));
              }
            },
            'image/jpeg',
            quality
          );
        } catch (error) {
          // Clean up
          URL.revokeObjectURL(img.src);
          reject(new Error(`Image processing failed: ${error.message}`));
        }
      };

      img.onerror = (error) => {
        // Clean up
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image for compression'));
      };

      // Create object URL and handle potential errors
      try {
        img.src = URL.createObjectURL(file);
      } catch (error) {
        reject(new Error('Failed to create object URL for image'));
      }
    } catch (error) {
      reject(new Error(`Compression setup failed: ${error.message}`));
    }
  });
};

/**
 * Validate image file before processing
 */
export const validateImageFile = (file, maxSize = 10 * 1024 * 1024) => {
  const errors = [];

  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }

  if (!(file instanceof File || file instanceof Blob)) {
    errors.push('Invalid file type');
  }

  if (file.type && !file.type.startsWith('image/')) {
    errors.push('File must be an image');
  }

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  if (file.size === 0) {
    errors.push('File is empty');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get image dimensions without loading full image
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      reject(new Error('Invalid image file'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for dimension check'));
    };

    try {
      img.src = URL.createObjectURL(file);
    } catch (error) {
      reject(new Error('Failed to create object URL'));
    }
  });
};

export default {
  compressImage,
  validateImageFile,
  getImageDimensions
};