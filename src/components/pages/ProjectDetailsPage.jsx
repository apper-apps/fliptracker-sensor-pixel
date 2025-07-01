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
      'Demo': 'demo',
      'Framing': 'framing',
      'Finishing': 'finishing',
      'Completed': 'completed'
    }
    return statusMap[status] || 'default'
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
{/* Action Bar */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Project Updates
            </h2>
            <div className="flex gap-3">
              <Button
                variant="outline"
                icon="FileText"
                onClick={handleGenerateReport}
              >
                Generate Report
              </Button>
              <Button
                variant="primary"
                icon="Camera"
                onClick={handleNewUpdate}
              >
                📷 Take Photos
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