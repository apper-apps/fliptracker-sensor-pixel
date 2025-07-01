import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  icon = 'FileText', 
  title, 
  description, 
  actionText, 
  onAction, 
  className = '' 
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="font-semibold text-xl text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {actionText && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          icon="Plus"
          className="bg-gradient-to-r from-primary to-orange-500 hover:from-orange-600 hover:to-orange-700"
        >
          {actionText}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty