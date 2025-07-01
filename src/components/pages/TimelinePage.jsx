import React from 'react'
import { motion } from 'framer-motion'
import TimelineFeed from '@/components/organisms/TimelineFeed'
import ApperIcon from '@/components/ApperIcon'

const TimelinePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
                Timeline
              </h1>
              <p className="text-gray-600 mt-1">
                Latest updates from all projects
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span>Live updates</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TimelineFeed />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TimelinePage