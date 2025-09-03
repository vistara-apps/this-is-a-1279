import React from 'react'

const InputForm = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  min, 
  max, 
  help,
  className = '' 
}) => {
  const handleChange = (e) => {
    const newValue = type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
    onChange(newValue)
  }

  return (
    <div className={`space-y-sm ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-md py-sm bg-background border border-gray-600 rounded-md 
                   text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-primary focus:border-transparent transition-all duration-base
                   hover:border-gray-500"
      />
      
      {help && (
        <p className="text-xs text-gray-500">{help}</p>
      )}
    </div>
  )
}

export default InputForm