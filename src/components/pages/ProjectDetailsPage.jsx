import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import UpdateCard from '@/components/molecules/UpdateCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import ReportPreview from '@/components/molecules/ReportPreview'
import { projectService } from '@/services/api/projectService'
import { updateService } from '@/services/api/updateService'
import { toast } from 'react-toastify'

const ProjectDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [updates, setUpdates] = useState([])
const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showReportPreview, setShowReportPreview] = useState(false)
  const [editingAccessInstructions, setEditingAccessInstructions] = useState(false)
  const [accessInstructions, setAccessInstructions] = useState('')
  
  useEffect(() => {
    loadProjectData()
  }, [id])
  
  const loadProjectData = async () => {
    setLoading(true)
    setError('')
    try {
      const [projectData, updatesData] = await Promise.all([
        projectService.getById(parseInt(id)),
        updateService.getAll()
])
      
      setProject(projectData)
      setAccessInstructions(projectData.accessInstructions || '')
      // Filter updates for this project
      const projectUpdates = updatesData.filter(update => update.projectId === projectData.Id)
      setUpdates(projectUpdates)
    } catch (err) {
      setError('Failed to load project details. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDeleteUpdate = async (updateId) => {
    try {
      await updateService.delete(updateId)
      setUpdates(prev => prev.filter(update => update.Id !== updateId))
      toast.success('Update deleted successfully')
    } catch (error) {
      toast.error('Failed to delete update')
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

  const statusOptions = [
    'Planning & Permits',
    'Demo & Structural', 
    'Systems & Rough-In',
    'Finishes & Final',
    'On-Market',
    'Sold'
  ]

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedProject = await projectService.update(project.Id, { status: newStatus })
      setProject(updatedProject)
      toast.success('Project status updated successfully')
    } catch (error) {
      toast.error('Failed to update project status')
    }
}

  const handleAccessInstructionsUpdate = async () => {
    try {
      const updatedProject = await projectService.update(project.Id, { accessInstructions })
      setProject(updatedProject)
      setEditingAccessInstructions(false)
      toast.success('Access instructions updated successfully')
    } catch (error) {
      toast.error('Failed to update access instructions')
    }
  }
  
  const handleNewUpdate = () => {
    // Store current project in localStorage for the update form
    localStorage.setItem('lastSelectedProject', project.Id.toString())
    navigate('/new-update')
  }
  
  const handleGenerateReport = () => {
    setShowReportPreview(true)
  }
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProjectData} />
  if (!project) return <Error message="Project not found" />
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/projects')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 text-gray-600" />
            </button>
<div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {updates.length} updates
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-1">
                {project.address}
              </h1>
              <p className="text-gray-600">
                {project.propertyType}
              </p>
              
              {/* Status Dropdown */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Status
                </label>
                <select
                  value={project.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
              Started {format(new Date(project.startDate), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center">
              <ApperIcon name="Target" className="w-4 h-4 mr-1" />
              Due {format(new Date(project.targetDate), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>
      
{/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Access Instructions Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ApperIcon name="Key" className="w-5 h-5 mr-2 text-gray-600" />
                Access Instructions
              </h2>
              {!editingAccessInstructions ? (
                <Button
                  variant="outline"
                  size="sm"
                  icon="Edit"
                  onClick={() => setEditingAccessInstructions(true)}
                >
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingAccessInstructions(false)
                      setAccessInstructions(project.accessInstructions || '')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAccessInstructionsUpdate}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
            
            {!editingAccessInstructions ? (
              <div className="text-gray-700 whitespace-pre-wrap">
                {project.accessInstructions || 'No access instructions provided yet.'}
              </div>
            ) : (
              <textarea
                value={accessInstructions}
                onChange={(e) => setAccessInstructions(e.target.value)}
                placeholder="Enter access instructions including lockbox codes, entry procedures, contact information, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary resize-vertical"
                rows="6"
              />
            )}
          </div>
          
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Project Updates
            </h2>
<div className="flex gap-3">
              <Button
                variant="primary"
                icon="Camera"
                onClick={handleNewUpdate}
              >
                📷 Take Photos
              </Button>
              <Button
                variant="outline"
                icon="FileText"
                onClick={handleGenerateReport}
              >
                Generate Report
              </Button>
            </div>
          </div>
          
          {/* Updates Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {updates.length === 0 ? (
              <Empty
                icon="Camera"
                title="No Updates Yet"
                description="Start documenting this project's progress by posting your first update with photos."
                actionText="Add First Update"
                onAction={handleNewUpdate}
              />
            ) : (
              <div className="space-y-4">
                {updates.map((update, index) => (
                  <motion.div
                    key={update.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <UpdateCard
                      update={update}
                      project={project}
                      onDelete={handleDeleteUpdate}
                    />
                  </motion.div>
                ))}
              </div>
            )}
</motion.div>
        </div>
      </div>
      
      {/* Report Preview Modal */}
      {showReportPreview && (
        <ReportPreview
          project={project}
          updates={updates}
          onClose={() => setShowReportPreview(false)}
        />
      )}
    </div>
  )
}

export default ProjectDetailsPage