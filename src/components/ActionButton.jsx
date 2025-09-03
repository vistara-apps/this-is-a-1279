import React from 'react'

const ActionButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className = '' 
}) => {
  const baseClasses = `
    px-lg py-sm rounded-md font-medium transition-all duration-base
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
    disabled:opacity-50 disabled:cursor-not-allowed
  `
  
  const variantClasses = {
    primary: `
      bg-primary hover:bg-primary/90 text-white focus:ring-primary
      shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]
    `,
    secondary: `
      bg-surface hover:bg-surface/80 text-white border border-gray-600
      hover:border-gray-500 focus:ring-gray-500
    `
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default ActionButton