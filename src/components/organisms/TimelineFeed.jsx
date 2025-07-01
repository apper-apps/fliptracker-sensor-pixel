import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import UpdateCard from '@/components/molecules/UpdateCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { updateService } from '@/services/api/updateService'
import { projectService } from '@/services/api/projectService'
import { toast } from 'react-toastify'

const TimelineFeed = () => {
  const [updates, setUpdates] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [updatesData, projectsData] = await Promise.all([
        updateService.getAll(),
        projectService.getAll()
      ])
      setUpdates(updatesData)
      setProjects(projectsData)
    } catch (err) {
      setError('Failed to load timeline. Please try again.')
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
  
  const getProjectForUpdate = (projectId) => {
    return projects.find(project => project.Id === projectId)
  }
  
  const filteredUpdates = updates.filter(update => {
    if (filter === 'all') return true
    return update.category.toLowerCase() === filter.toLowerCase()
  })
  
  const filterOptions = [
    { value: 'all', label: 'All Updates', icon: 'List' },
    { value: 'progress', label: 'Progress', icon: 'TrendingUp' },
    { value: 'issue', label: 'Issues', icon: 'AlertTriangle' },
    { value: 'milestone', label: 'Milestones', icon: 'Target' }
  ]
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? 'primary' : 'secondary'}
            size="sm"
            icon={option.icon}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      
      {/* Updates Feed */}
      {filteredUpdates.length === 0 ? (
        <Empty
          icon="Clock"
          title="No Updates Yet"
          description={filter === 'all' 
            ? "Start documenting your project progress by posting your first update." 
            : `No ${filter} updates found. Try a different filter.`}
          actionText="Post Update"
          onAction={() => {
            // This would navigate to new update page
            window.location.href = '/new-update'
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((update, index) => (
            <motion.div
              key={update.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <UpdateCard
                update={update}
                project={getProjectForUpdate(update.projectId)}
                onDelete={handleDeleteUpdate}
              />
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Load More (placeholder for future pagination) */}
      {filteredUpdates.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Showing {filteredUpdates.length} updates
          </p>
        </div>
      )}
    </div>
  )
}

export default TimelineFeed