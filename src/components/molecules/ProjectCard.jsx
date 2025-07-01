import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format, isValid } from "date-fns";
import { formatDate } from "@/utils/dateUtils";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const ProjectCard = ({ project, className }) => {
  const navigate = useNavigate()
  
  // Early return if project is invalid
  if (!project) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${className || ''}`}>
        <div className="text-center text-gray-500">
          <p>Project data unavailable</p>
        </div>
      </div>
    )
  }
  
  const handleClick = () => {
    if (project.Id) {
      navigate(`/projects/${project.Id}`)
    }
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

  const formatDate = (dateValue, fallback = 'TBD') => {
    if (!dateValue) return fallback
    const date = new Date(dateValue)
    return isValid(date) ? format(date, 'MMM d') : fallback
  }

  const safeProject = {
    Id: project.Id || null,
    name: project.name || 'Unnamed Project',
    address: project.address || 'Address not specified',
    status: project.status || 'Unknown',
    progress: Math.min(Math.max(project.progress || 0, 0), 100),
    startDate: project.startDate,
    targetDate: project.targetDate,
    budget: project.budget || 0,
    spent: project.spent || 0
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer overflow-hidden ${className || ''}`}
      onClick={handleClick}
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
        <img 
          src={getCoverImage()}
          alt={`${safeProject.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={getStatusVariant(safeProject.status)} size="sm">
            {safeProject.status}
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {safeProject.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{safeProject.address}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
            Started {formatDate(safeProject.startDate)}
          </div>
          <div className="flex items-center">
            <ApperIcon name="Target" className="w-4 h-4 mr-1" />
            Due {formatDate(safeProject.targetDate)}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{safeProject.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${safeProject.progress}%` }}
            />
          </div>
        </div>
        
        {/* Budget Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-medium">Budget:</span> ${safeProject.budget.toLocaleString()}
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Spent:</span> ${safeProject.spent.toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
