import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { reportService } from "@/services/api/reportService";

const ReportPreview = ({ project, updates, onClose }) => {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    generateReportData()
  }, [project, updates])

  const generateReportData = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await reportService.generateProjectReport(project, updates)
      setReportData(data)
    } catch (err) {
      setError('Failed to generate report preview')
    } finally {
      setLoading(false)
    }
  }

const handleDownload = async () => {
    setGenerating(true)
    try {
      // Create a simple text-based report for download
      const reportContent = generateTextReport(reportData)
      const blob = new Blob([reportContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${project.address.replace(/[^a-z0-9]/gi, '_')}_Report.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Report downloaded successfully')
      onClose()
    } catch (err) {
      toast.error('Failed to download report')
    } finally {
      setGenerating(false)
    }
  }

const handleShare = async () => {
    try {
      const reportContent = generateTextReport(reportData)
      
      if (navigator.share && typeof File !== 'undefined') {
        try {
          await navigator.share({
            title: `Project Report - ${project.address}`,
            text: reportContent,
            files: [new File([reportContent], `${project.address.replace(/[^a-z0-9]/gi, '_')}_Report.txt`, {
              type: 'text/plain'
            })]
          })
          toast.success('Report shared successfully')
        } catch (shareErr) {
          // If file sharing fails, try sharing without files
          if (navigator.share && shareErr.name !== 'AbortError') {
            await navigator.share({
              title: `Project Report - ${project.address}`,
              text: reportContent
            })
            toast.success('Report shared successfully')
          } else {
            throw shareErr
          }
        }
      } else if (navigator.share) {
        // Share without files if File constructor is not available
        await navigator.share({
          title: `Project Report - ${project.address}`,
          text: reportContent
        })
        toast.success('Report shared successfully')
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(reportContent)
        toast.success('Report copied to clipboard')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Failed to share report')
      }
    }
  }

  const generateTextReport = (data) => {
    let content = `PROJECT REPORT\n`
    content += `=====================================\n\n`
    content += `Property Address: ${data.project.address}\n`
    content += `Property Type: ${data.project.propertyType}\n`
    content += `Status: ${data.project.status}\n`
    content += `Start Date: ${data.project.startDate}\n`
    content += `Target Date: ${data.project.targetDate}\n`
    content += `Report Generated: ${data.generatedAt}\n\n`
    
    content += `PROJECT SUMMARY\n`
    content += `=====================================\n`
    content += `Total Updates: ${data.totalUpdates}\n`
    content += `Progress Updates: ${data.summary.progressUpdates}\n`
    content += `Milestones: ${data.summary.milestones}\n`
    content += `Issues: ${data.summary.issues}\n`
    content += `Total Photos: ${data.summary.totalPhotos}\n\n`
    
    content += `CHRONOLOGICAL TIMELINE\n`
    content += `=====================================\n\n`
    
    data.updates.forEach((update, index) => {
      content += `${index + 1}. ${update.title}\n`
      content += `   Date: ${update.timestamp}\n`
      content += `   Category: ${update.category}\n`
      content += `   Author: ${update.author}\n`
      content += `   Description: ${update.description}\n`
      if (update.photoCount > 0) {
        content += `   Photos: ${update.photoCount} attached\n`
      }
      content += `\n`
    })
    
    return content
  }

  const getCategoryVariant = (category) => {
    const categoryMap = {
      'Progress': 'primary',
      'Milestone': 'success',
      'Issue': 'error',
      'Before': 'secondary'
    }
    return categoryMap[category] || 'default'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Project Report Preview</h2>
                <p className="text-sm text-gray-600 mt-1">{project.address}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {loading && <Loading />}
            {error && <Error message={error} onRetry={generateReportData} />}
            
            {reportData && (
              <div className="space-y-8">
                {/* Project Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{reportData.totalUpdates}</div>
                      <div className="text-sm text-gray-600">Total Updates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{reportData.summary.milestones}</div>
                      <div className="text-sm text-gray-600">Milestones</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{reportData.summary.issues}</div>
                      <div className="text-sm text-gray-600">Issues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{reportData.summary.totalPhotos}</div>
                      <div className="text-sm text-gray-600">Photos</div>
                    </div>
                  </div>
                </div>

                {/* Timeline Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Chronological Timeline</h3>
                  <div className="space-y-4">
                    {reportData.updates.map((update, index) => (
                      <div key={update.Id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={getCategoryVariant(update.category)}>
                                {update.category}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {update.timestamp}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900">{update.title}</h4>
                          </div>
                          {update.photoCount > 0 && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <ApperIcon name="Camera" className="w-4 h-4" />
                              {update.photoCount}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{update.description}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          By {update.author}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {reportData && `Generated on ${reportData.generatedAt}`}
            </div>
<div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={generating}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                icon="Share"
                onClick={handleShare}
                disabled={!reportData}
              >
                Share Report
              </Button>
              <Button
                variant="primary"
                icon="Download"
                onClick={handleDownload}
                loading={generating}
                disabled={!reportData || generating}
              >
                {generating ? 'Generating...' : 'Download Report'}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ReportPreview