import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/molecules/ProjectCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { projectService } from '@/services/api/projectService'

const ProjectGrid = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
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