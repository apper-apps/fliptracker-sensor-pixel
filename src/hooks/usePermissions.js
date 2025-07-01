import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing browser permissions with proper error handling
 * Prevents NotAllowedError by graceful degradation
 */
export const usePermissions = () => {
  const [permissions, setPermissions] = useState({
    camera: null,
    microphone: null,
    geolocation: null
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({});

  const requestCameraPermission = useCallback(async () => {
    setLoading(prev => ({ ...prev, camera: true }));
    setErrors(prev => ({ ...prev, camera: null }));
    
    try {
      // Check if navigator.mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false 
      });
      
      // Clean up stream immediately after permission check
      stream.getTracks().forEach(track => track.stop());
      
      setPermissions(prev => ({ ...prev, camera: 'granted' }));
      return { success: true, stream: null };
      
    } catch (error) {
      let errorMessage = 'Camera access denied';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please enable camera access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported on this device.';
      }
      
      setPermissions(prev => ({ ...prev, camera: 'denied' }));
      setErrors(prev => ({ ...prev, camera: errorMessage }));
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, camera: false }));
    }
  }, []);

  const requestMicrophonePermission = useCallback(async () => {
    setLoading(prev => ({ ...prev, microphone: true }));
    setErrors(prev => ({ ...prev, microphone: null }));
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone not supported on this device');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      
      stream.getTracks().forEach(track => track.stop());
      
      setPermissions(prev => ({ ...prev, microphone: 'granted' }));
      return { success: true };
      
    } catch (error) {
      let errorMessage = 'Microphone access denied';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied. Please enable microphone access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found on this device.';
      }
      
      setPermissions(prev => ({ ...prev, microphone: 'denied' }));
      setErrors(prev => ({ ...prev, microphone: errorMessage }));
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, microphone: false }));
    }
  }, []);

  const checkPermissionStatus = useCallback(async (permissionName) => {
    try {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: permissionName });
        return result.state;
      }
      return 'prompt';
    } catch (error) {
      console.warn(`Could not check ${permissionName} permission:`, error);
      return 'prompt';
    }
  }, []);

  useEffect(() => {
    // Initialize permission states on mount
    const initPermissions = async () => {
      try {
        const cameraStatus = await checkPermissionStatus('camera');
        const microphoneStatus = await checkPermissionStatus('microphone');
        
        setPermissions({
          camera: cameraStatus,
          microphone: microphoneStatus,
          geolocation: null
        });
      } catch (error) {
        console.warn('Could not initialize permissions:', error);
      }
    };

    initPermissions();
  }, [checkPermissionStatus]);

  return {
    permissions,
    errors,
    loading,
    requestCameraPermission,
    requestMicrophonePermission,
    checkPermissionStatus
  };
};

export default usePermissions;