import React from 'react'
import { motion } from 'framer-motion'
import ProjectGrid from '@/components/organisms/ProjectGrid'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ProjectsPage = () => {
  const handleCreateProject = () => {
    // This would typically navigate to a create project page
    console.log('Create new project')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
                Projects
              </h1>
              <p className="text-gray-600 mt-1">
                Track your fix and flip properties
              </p>
            </div>
            <Button
              variant="primary"
              icon="Plus"
              onClick={handleCreateProject}
              className="hidden sm:flex"
            >
              New Project
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProjectGrid />
        </motion.div>
      </div>
      
      {/* Mobile FAB for create project */}
      <div className="fixed bottom-24 right-4 sm:hidden z-30">
        <motion.button
          onClick={handleCreateProject}
          className="bg-secondary text-white rounded-full p-4 shadow-fab"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          <ApperIcon name="Plus" className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  )
}

export default ProjectsPage