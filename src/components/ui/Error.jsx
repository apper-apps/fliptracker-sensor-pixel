import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message, onRetry, className = '' }) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-500" />
      </div>
      
      <h3 className="font-semibold text-lg text-gray-900 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          icon="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default Error