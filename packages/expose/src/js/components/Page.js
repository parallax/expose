import React from 'react'

let Page = ({ children, padding = 'md', className = '' }) => (
  <div
    className={`absolute pin ${
      padding === 'lg' ? 'px-8' : 'px-6'
    } ${className}`}
  >
    {children}
  </div>
)

export default Page
