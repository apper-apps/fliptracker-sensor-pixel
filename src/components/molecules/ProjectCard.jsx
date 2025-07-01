import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { format } from 'date-fns'

const ProjectCard = ({ project, className = '' }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate(`/projects/${project.Id}`)
  }
  
  const getStatusVariant = (status) => {
    const statusMap = {
      'Demo': 'demo',
      'Framing': 'framing',
      'Finishing': 'finishing',
      'Completed': 'completed'
    }
    return statusMap[status] || 'default'
  }
  
  const getCoverImage = () => {
    return `https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop&crop=center`
  }
  
  return (
    <motion.div
      className={`card overflow-hidden cursor-pointer hover:shadow-elevated transition-all duration-200 ${className}`}
      onClick={handleClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={getCoverImage()}
          alt={project.address}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge variant={getStatusVariant(project.status)}>
            {project.status}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg leading-tight mb-1">
            {project.address}
          </h3>
          <p className="text-white/80 text-sm">
            {project.propertyType}
          </p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
            Started {format(new Date(project.startDate), 'MMM d')}
          </div>
          <div className="flex items-center">
            <ApperIcon name="Target" className="w-4 h-4 mr-1" />
            Due {format(new Date(project.targetDate), 'MMM d')}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Camera" className="w-4 h-4 mr-1" />
            <span>12 updates</span>
          </div>
          <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard