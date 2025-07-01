import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { format, formatDistanceToNow } from 'date-fns'

const UpdateCard = ({ update, project, onDelete }) => {
  const [showFullGallery, setShowFullGallery] = useState(false)
  
  const getCategoryVariant = (category) => {
    const categoryMap = {
      'Progress': 'accent',
      'Issue': 'error',
      'Before': 'warning',
      'After': 'success',
      'Milestone': 'primary'
    }
    return categoryMap[category] || 'default'
  }
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this update?')) {
      onDelete(update.Id)
    }
  }
  
  return (
    <motion.div
      className="card p-4 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={getCategoryVariant(update.category)}>
              {update.category}
            </Badge>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(update.timestamp), { addSuffix: true })}
            </span>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {update.title}
          </h3>
          <p className="text-sm text-gray-600">
            {project?.address} • {update.author}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </button>
      </div>
      
{/* Description */}
      {update.description && update.description.trim() && (
        <p className="text-gray-700 mb-4 leading-relaxed">
          {update.description}
        </p>
      )}
      
      {/* Photos */}
      {update.photos && update.photos.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {update.photos.slice(0, showFullGallery ? undefined : 6).map((photo, index) => (
              <motion.div
                key={photo.id || index}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={photo.url || `https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=300&h=300&fit=crop&crop=center&sig=${index}`}
                  alt={photo.caption || `Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {!showFullGallery && index === 5 && update.photos.length > 6 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{update.photos.length - 6} more
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          {update.photos.length > 6 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullGallery(!showFullGallery)}
              className="w-full"
            >
              {showFullGallery ? 'Show Less' : `View All ${update.photos.length} Photos`}
            </Button>
          )}
        </div>
      )}
      
      {/* Timestamp */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
          {format(new Date(update.timestamp), 'MMM d, yyyy • h:mm a')}
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Camera" className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {update.photos?.length || 0} photos
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default UpdateCard