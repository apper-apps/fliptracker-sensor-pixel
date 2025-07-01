import { formatDate, formatDateTime, formatReportDate } from '@/utils/dateUtils'

// Utility function to add delay for realistic API simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const reportService = {
  async generateProjectReport(project, updates) {
    await delay(300)
    
    try {
      // Sort updates chronologically (oldest first)
      const sortedUpdates = [...updates].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      )
      
      const reportData = {
        project: {
          Id: project.Id,
          address: project.address,
          propertyType: project.propertyType,
          status: project.status,
          startDate: formatReportDate(project.startDate),
          targetDate: formatReportDate(project.targetDate),
          createdAt: formatReportDate(project.createdAt)
        },
        updates: sortedUpdates.map(update => ({
          Id: update.Id,
          title: update.title,
          description: update.description,
          category: update.category,
          timestamp: formatDateTime(update.timestamp),
          author: update.author,
          photoCount: update.photos?.length || 0,
          photos: update.photos?.map(photo => ({
            id: photo.id,
            caption: photo.caption,
            takenAt: formatDateTime(photo.takenAt)
          })) || []
        })),
        generatedAt: formatDateTime(new Date()),
        totalUpdates: sortedUpdates.length,
        summary: {
          progressUpdates: sortedUpdates.filter(u => u.category === 'Progress').length,
          milestones: sortedUpdates.filter(u => u.category === 'Milestone').length,
          issues: sortedUpdates.filter(u => u.category === 'Issue').length,
          totalPhotos: sortedUpdates.reduce((total, update) => total + (update.photos?.length || 0), 0)
        }
      }
      
      return reportData
    } catch (error) {
      console.error('Report generation error:', error)
      throw new Error('Failed to generate report')
    }
  }
}