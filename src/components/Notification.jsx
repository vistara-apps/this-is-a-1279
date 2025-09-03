import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react'

/**
 * Notification component for displaying alerts, errors, and success messages
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of notification ('success', 'error', 'warning', 'info')
 * @param {string} props.message - Message to display
 * @param {number} props.duration - Duration in ms to show the notification (0 for no auto-dismiss)
 * @param {Function} props.onClose - Function to call when notification is closed
 */
const Notification = ({ 
  type = 'info', 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    // Auto-dismiss after duration (if not 0)
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        if (onClose) onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])
  
  const handleClose = () => {
    setVisible(false)
    if (onClose) onClose()
  }
  
  if (!visible) return null
  
  // Define styles based on notification type
  const typeStyles = {
    success: {
      bg: 'bg-success/10',
      border: 'border-success/30',
      icon: <CheckCircle className="w-5 h-5 text-success" />
    },
    error: {
      bg: 'bg-error/10',
      border: 'border-error/30',
      icon: <AlertCircle className="w-5 h-5 text-error" />
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      icon: <AlertTriangle className="w-5 h-5 text-warning" />
    },
    info: {
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      icon: <AlertCircle className="w-5 h-5 text-primary" />
    }
  }
  
  const { bg, border, icon } = typeStyles[type] || typeStyles.info
  
  return (
    <div 
      className={`${bg} ${border} border rounded-md p-md flex items-start gap-sm shadow-md animate-fadeIn`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-xs">
        {icon}
      </div>
      
      <div className="flex-1">
        <p className="text-sm text-white">{message}</p>
      </div>
      
      <button 
        onClick={handleClose}
        className="text-gray-400 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Notification

