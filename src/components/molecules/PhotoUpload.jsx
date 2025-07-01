import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, FileImage, RotateCcw, Upload, X } from "lucide-react";
import { Camera as CameraPro } from "react-camera-pro";
import { toast } from "react-toastify";
import { compressImage } from "@/utils/imageUtils";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import usePermissions from "@/hooks/usePermissions";

const PhotoUpload = ({ onPhotoTaken, onPhotoRemoved, existingPhoto, className = '' }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(existingPhoto || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(existingPhoto || null);
  const [cameraError, setCameraError] = useState(null);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  
  const cameraRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  
  const { 
    permissions, 
    errors, 
    loading, 
    requestCameraPermission 
  } = usePermissions();

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleTakePhoto = useCallback(async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsProcessing(true);
      const imageSrc = cameraRef.current.takePhoto();
      
      if (!imageSrc) {
        throw new Error('Failed to capture photo');
      }
      
      // Convert to blob and compress
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const compressedBlob = await compressImage(blob);
      
      setCapturedPhoto(compressedBlob);
      
      // Clean up old preview URL
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const newPreviewUrl = URL.createObjectURL(compressedBlob);
      setPreviewUrl(newPreviewUrl);
      setShowCamera(false);
      
      if (onPhotoTaken) {
        onPhotoTaken(compressedBlob);
      }
      
      toast.success('Photo captured successfully!');
    } catch (error) {
      console.error('Error taking photo:', error);
      toast.error('Failed to capture photo. Please try again.');
      setCameraError('Failed to capture photo');
    } finally {
      setIsProcessing(false);
    }
  }, [onPhotoTaken, previewUrl]);

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size too large. Please select an image under 10MB.');
      return;
    }

    try {
      setIsProcessing(true);
      const compressedBlob = await compressImage(file);
      
      setCapturedPhoto(compressedBlob);
      
      // Clean up old preview URL
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const newPreviewUrl = URL.createObjectURL(compressedBlob);
      setPreviewUrl(newPreviewUrl);
      
      if (onPhotoTaken) {
        onPhotoTaken(compressedBlob);
      }
      
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onPhotoTaken, previewUrl]);

  const handleRemovePhoto = useCallback(() => {
    // Clean up blob URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setCapturedPhoto(null);
    setPreviewUrl(null);
    
    if (onPhotoRemoved) {
      onPhotoRemoved();
    }
    
    toast.info('Photo removed');
  }, [onPhotoRemoved, previewUrl]);

  const openCamera = useCallback(async () => {
    setCameraError(null);
    setShowPermissionHelp(false);
    
    // Check and request camera permission
    const permissionResult = await requestCameraPermission();
    
    if (!permissionResult.success) {
      setCameraError(permissionResult.error);
      setShowPermissionHelp(true);
      toast.error(permissionResult.error);
      return;
    }
    
    try {
      setShowCamera(true);
    } catch (error) {
      console.error('Error opening camera:', error);
      setCameraError('Failed to open camera');
      toast.error('Failed to open camera');
    }
  }, [requestCameraPermission]);

  const closeCamera = useCallback(() => {
    setShowCamera(false);
    setCameraError(null);
    
    // Clean up camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleCameraError = useCallback((error) => {
    console.error('Camera error:', error);
    let errorMessage = 'Camera error occurred';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    setCameraError(errorMessage);
    toast.error(errorMessage);
    setShowCamera(false);
    setShowPermissionHelp(true);
  }, []);

  // Permission Help Component
  const PermissionHelp = () => (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
        <div className="text-sm">
          <p className="text-yellow-800 font-medium mb-2">Camera Permission Required</p>
          <p className="text-yellow-700 mb-3">
            {errors.camera || 'To take photos, please allow camera access in your browser.'}
          </p>
          <div className="text-yellow-700">
            <p className="font-medium mb-1">How to enable:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Click the camera icon in your browser's address bar</li>
              <li>Select "Allow" for camera permissions</li>
              <li>Refresh the page if needed</li>
            </ul>
          </div>
          <Button
            onClick={openCamera}
            size="sm"
            className="mt-3"
            disabled={loading.camera}
          >
            {loading.camera ? 'Checking...' : 'Try Again'}
          </Button>
        </div>
      </div>
    </div>
  );

  // Camera View
  if (showCamera) {
    return (
      <div className={`fixed inset-0 z-50 bg-black ${className}`}>
        <div className="relative h-full">
          <CameraPro
            ref={cameraRef}
            aspectRatio={4/3}
            facingMode="environment"
            onCameraError={handleCameraError}
            errorMessages={{
              noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
              permissionDenied: 'Permission denied. Please refresh and give camera permission.',
              switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
              canvas: 'Canvas is not supported.',
            }}
          />
          
          {/* Error Overlay */}
          {cameraError && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md text-center">
                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h3 className="text-lg font-semibold mb-2">Camera Error</h3>
                <p className="text-gray-600 mb-4">{cameraError}</p>
                <div className="flex space-x-3">
                  <Button onClick={closeCamera} variant="secondary" className="flex-1">
                    Close
                  </Button>
                  <Button onClick={openCamera} className="flex-1">
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Camera Controls */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6">
            <Button
              variant="secondary"
              onClick={closeCamera}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              <X size={24} />
            </Button>
            
            <Button
              onClick={handleTakePhoto}
              disabled={isProcessing || !!cameraError}
              className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              ) : (
                <Camera size={24} className="text-gray-800" />
              )}
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => cameraRef.current?.switchCamera?.()}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              disabled={!!cameraError}
            >
              <RotateCcw size={24} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Photo Preview
  if (capturedPhoto || previewUrl) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative rounded-lg overflow-hidden bg-gray-100">
          <img
            src={previewUrl}
            alt="Captured photo"
            className="w-full h-48 object-cover"
            onError={() => {
              console.error('Error loading image preview');
              toast.error('Error loading image preview');
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRemovePhoto}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
            title="Remove photo"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    );
  }

  // Upload Interface
  return (
    <div className={`space-y-4 ${className}`}>
      {showPermissionHelp && <PermissionHelp />}
      
      <div className="flex space-x-4">
        <Button
          onClick={openCamera}
          className="flex-1 flex items-center justify-center space-x-2 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          disabled={isProcessing || loading.camera}
        >
          {loading.camera ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
          ) : (
            <Camera size={24} />
          )}
          <span>{loading.camera ? 'Checking...' : 'Take Photo'}</span>
        </Button>
        
        <Button
          onClick={triggerFileInput}
          variant="secondary"
          className="flex-1 flex items-center justify-center space-x-2 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
          ) : (
            <Upload size={24} />
          )}
          <span>{isProcessing ? 'Processing...' : 'Upload Photo'}</span>
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,image/heic,image/heif"
        onChange={handleFileUpload}
        className="hidden"
        disabled={isProcessing}
      />
      
      {/* Fallback option for devices without camera */}
      {permissions.camera === 'denied' && (
        <div className="text-center text-sm text-gray-500 mt-4 p-4 bg-gray-50 rounded-lg">
          <FileImage className="mx-auto mb-2" size={32} />
          <p>Camera not available. Use the upload button to select photos from your device.</p>
        </div>
      )}
    </div>
  );
};
export default PhotoUpload;