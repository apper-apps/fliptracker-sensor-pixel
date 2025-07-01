import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { projectService } from '@/services/api/projectService'

const ProjectSelector = ({ selectedProject, onProjectSelect, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await projectService.getAll()
      setProjects(data)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }
  
const getStatusVariant = (status) => {
    const statusMap = {
      'Planning & Permits': 'planning',
      'Demo & Structural': 'demo',
      'Systems & Rough-In': 'systems',
      'Finishes & Final': 'finishing',
      'On-Market': 'market',
      'Sold': 'completed'
    }
    return statusMap[status] || 'default'
  }
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Home" className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">
              {selectedProject?.address || 'Select Project'}
            </p>
            {selectedProject && (
              <p className="text-sm text-gray-500">
                {selectedProject.propertyType}
              </p>
            )}
          </div>
        </div>
        <ApperIcon 
          name="ChevronDown" 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-elevated z-50 max-h-80 overflow-y-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className="p-4 text-center">
                  <ApperIcon name="Loader2" className="w-5 h-5 animate-spin mx-auto text-gray-400" />
                </div>
              ) : (
                <div className="py-2">
                  {projects.map((project) => (
                    <button
                      key={project.Id}
                      onClick={() => {
                        onProjectSelect(project)
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ApperIcon name="Home" className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {project.address}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {project.propertyType}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </button>
                  ))}
                  {projects.length === 0 && (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <ApperIcon name="Home" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No projects found</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProjectSelector