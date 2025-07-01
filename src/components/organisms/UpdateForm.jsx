import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import PhotoUpload from '@/components/molecules/PhotoUpload'
import ProjectSelector from '@/components/molecules/ProjectSelector'
import { updateService } from '@/services/api/updateService'
import { projectService } from '@/services/api/projectService'

const UpdateForm = () => {
  const navigate = useNavigate()
  const [selectedProject, setSelectedProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Progress'
  })
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  
  const categories = [
    'Progress',
    'Issue', 
    'Before',
    'After',
    'Milestone'
  ]
  useEffect(() => {
    // Load last selected project from localStorage
    const lastProjectId = localStorage.getItem('lastSelectedProject')
    if (lastProjectId) {
      loadProject(parseInt(lastProjectId))
    }
  }, [])
  
  const loadProject = async (projectId) => {
    try {
      const project = await projectService.getById(projectId)
      setSelectedProject(project)
    } catch (error) {
      console.error('Failed to load project:', error)
    }
  }
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    localStorage.setItem('lastSelectedProject', project.Id.toString())
  }
  
const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedProject) {
      toast.error('Please select a project')
      return
    }
    
    if (photos.length === 0) {
      toast.error('Please add at least one photo')
      return  
    }
    setLoading(true)
    
    try {
      // Convert photos to the expected format for the service
      const processedPhotos = photos.map(photo => ({
        id: photo.id,
        url: photo.url,
        thumbnailUrl: photo.url,
        caption: photo.caption,
        takenAt: new Date().toISOString()
      }))
      
const updateData = {
        projectId: selectedProject.Id,
        title: formData.title.trim() || 'Photo Update',
        description: formData.description,
        category: formData.category,
        photos: processedPhotos,
        timestamp: new Date().toISOString(),
        author: 'Field Manager'
      }
      
      await updateService.create(updateData)
      
      toast.success('Update posted successfully!')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Progress'
      })
      setPhotos([])
      
      // Navigate to timeline
      navigate('/timeline')
      
    } catch (error) {
      toast.error('Failed to post update. Please try again.')
      console.error('Submit error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
{/* Project Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Project
        </label>
        <ProjectSelector
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
        />
      </div>
      
      {/* Photos - Primary Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Photos <span className="text-red-500">*</span>
        </label>
<PhotoUpload
          photos={photos}
          onPhotosChange={setPhotos}
        />
      </div>
      
      {/* Text Updates - Optional Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Additional Details (Optional)
        </h3>
        
        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="input-field"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Title */}
        <Input
          label="Update Title (Optional)"
          type="text"
          placeholder="e.g., Kitchen demo completed"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          icon="Type"
        />
      </div>
      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          placeholder="Add notes about this update..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="input-field resize-none"
        />
      </div>
      
      {/* Submit */}
      <div className="flex space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
variant="primary"
          loading={loading}
          disabled={!selectedProject || photos.length === 0}
          className="flex-1"
        >
          Post Update
        </Button>
      </div>
    </motion.form>
  )
}

export default UpdateForm