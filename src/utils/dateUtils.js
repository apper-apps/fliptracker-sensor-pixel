import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, formatStr) : 'Invalid date'
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid date'
  }
}

export const formatTimeAgo = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : 'Unknown'
  } catch (error) {
    console.error('Time ago formatting error:', error)
    return 'Unknown'
  }
}
export const formatDateTime = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, 'MMM d, yyyy • h:mm a') : 'Invalid date'
  } catch (error) {
    console.error('DateTime formatting error:', error)
    return 'Invalid date'
  }
}

export const formatReportDate = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, 'MMMM d, yyyy') : 'Invalid date'
  } catch (error) {
    console.error('Report date formatting error:', error)
    return 'Invalid date'
  }
}