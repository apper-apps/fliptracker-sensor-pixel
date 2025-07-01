import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/molecules/ProjectCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { projectService } from '@/services/api/projectService'

const ProjectGrid = ({ groupByStatus = false }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [collapsedSections, setCollapsedSections] = useState({})
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  const loadProjects = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await projectService.getAll()
      setProjects(data)
    } catch (err) {
      setError('Failed to load projects. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusOrder = [
    'Planning & Permits',
    'Demo & Structural',
    'Systems & Rough-In', 
    'Finishes & Final',
    'On-Market',
    'Sold'
  ]

  const groupProjectsByStatus = (projects) => {
    const grouped = statusOrder.reduce((acc, status) => {
      acc[status] = projects.filter(project => project.status === status)
      return acc
    }, {})
    return grouped
  }

  const toggleSection = (status) => {
    setCollapsedSections(prev => ({
      ...prev,
      [status]: !prev[status]
    }))
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProjects} />
  if (projects.length === 0) {
    return (
      <Empty
        icon="FolderOpen"
        title="No Projects Yet"
        description="Start by creating your first fix and flip project to begin tracking progress."
        actionText="Create Project"
        onAction={() => {
          // This would typically navigate to a create project page
          console.log('Create project clicked')
        }}
      />
    )
  }
  
if (groupByStatus) {
    const groupedProjects = groupProjectsByStatus(projects)
    
    return (
      <div className="space-y-8">
        {statusOrder.map((status) => {
          const statusProjects = groupedProjects[status]
          if (statusProjects.length === 0) return null
          
          const isCollapsed = collapsedSections[status]
          
          return (
            <div key={status} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(status)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{status}</h3>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                      {statusProjects.length}
                    </span>
                  </div>
                  <ApperIcon 
                    name="ChevronDown" 
                    className={`w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>
              
              {!isCollapsed && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statusProjects.map((project, index) => (
                      <motion.div
                        key={project.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  )
}

export default ProjectGrid