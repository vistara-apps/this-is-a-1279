import React, { createContext, useContext, useState, useCallback } from 'react'
import Notification from '../components/Notification'

// Create context
const NotificationContext = createContext()

/**
 * Provider component for notification system
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  
  // Add a new notification
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now().toString()
    
    setNotifications(prev => [
      ...prev,
      { id, message, type, duration }
    ])
    
    return id
  }, [])
  
  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])
  
  // Convenience methods for different notification types
  const success = useCallback((message, duration) => {
    return addNotification(message, 'success', duration)
  }, [addNotification])
  
  const error = useCallback((message, duration) => {
    return addNotification(message, 'error', duration)
  }, [addNotification])
  
  const warning = useCallback((message, duration) => {
    return addNotification(message, 'warning', duration)
  }, [addNotification])
  
  const info = useCallback((message, duration) => {
    return addNotification(message, 'info', duration)
  }, [addNotification])
  
  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])
  
  // Context value
  const value = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clearAll
  }
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification container */}
      <div className="fixed bottom-0 right-0 p-lg z-50 space-y-md max-w-md">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

/**
 * Hook for using the notification system
 * 
 * @returns {Object} Notification methods
 */
export const useNotification = () => {
  const context = useContext(NotificationContext)
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  
  return context
}

export default NotificationContext

