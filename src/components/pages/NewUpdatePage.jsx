import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import UpdateForm from '@/components/organisms/UpdateForm'
import ApperIcon from '@/components/ApperIcon'

const NewUpdatePage = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900">
                New Update
              </h1>
              <p className="text-gray-600 text-sm">
                Document your project progress
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <UpdateForm />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default NewUpdatePage