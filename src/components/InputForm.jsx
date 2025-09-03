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
  error,
  className = '' 
}) => {
  const handleChange = (e) => {
    let newValue;
    if (type === 'number') {
      // Handle empty string for number inputs
      newValue = e.target.value === '' ? '' : parseInt(e.target.value) || 0;
    } else {
      newValue = e.target.value;
    }
    onChange(newValue);
  }

  const inputClasses = `w-full px-md py-sm bg-background border rounded-md 
                   text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-primary focus:border-transparent transition-all duration-base
                   ${error ? 'border-error' : 'border-gray-600 hover:border-gray-500'}`;

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
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${label}-error` : help ? `${label}-help` : undefined}
      />
      
      {error ? (
        <p id={`${label}-error`} className="text-xs text-error">{error}</p>
      ) : help ? (
        <p id={`${label}-help`} className="text-xs text-gray-500">{help}</p>
      ) : null}
    </div>
  )
}

export default InputForm
