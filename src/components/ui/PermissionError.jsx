import React from 'react';
import { AlertCircle, Camera, Mic, MapPin, RefreshCw } from 'lucide-react';
import Button from '@/components/atoms/Button';

const PermissionError = ({ 
  type = 'camera', 
  error, 
  onRetry, 
  onDismiss,
  showInstructions = true 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'camera': return <Camera size={48} />;
      case 'microphone': return <Mic size={48} />;
      case 'geolocation': return <MapPin size={48} />;
      default: return <AlertCircle size={48} />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'camera': return 'Camera Permission Required';
      case 'microphone': return 'Microphone Permission Required';
      case 'geolocation': return 'Location Permission Required';
      default: return 'Permission Required';
    }
  };

  const getDescription = () => {
    if (error) return error;
    
    switch (type) {
      case 'camera': 
        return 'To take photos, please allow camera access in your browser settings.';
      case 'microphone': 
        return 'To record audio, please allow microphone access in your browser settings.';
      case 'geolocation': 
        return 'To use location features, please allow location access in your browser settings.';
      default: 
        return 'This feature requires permission to access your device.';
    }
  };

  const getInstructions = () => {
    return [
      'Click the permission icon in your browser\'s address bar',
      'Select "Allow" for the required permission',
      'Refresh the page if needed',
      'Try the action again'
    ];
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
      <div className="text-red-500 mb-4 flex justify-center">
        {getIcon()}
      </div>
      
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        {getTitle()}
      </h3>
      
      <p className="text-red-700 mb-4">
        {getDescription()}
      </p>
      
      {showInstructions && (
        <div className="text-left mb-6">
          <p className="text-red-700 font-medium mb-2">How to enable:</p>
          <ol className="list-decimal list-inside text-sm text-red-600 space-y-1">
            {getInstructions().map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}
      
      <div className="flex space-x-3">
        {onDismiss && (
          <Button
            onClick={onDismiss}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        
        {onRetry && (
          <Button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PermissionError;