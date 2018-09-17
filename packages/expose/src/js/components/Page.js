import React from 'react'

let Page = ({ children, padding = 'md' }) => (
  <div className={`absolute pin ${padding === 'lg' ? 'p-8' : 'p-6'}`}>
    {children}
  </div>
)

export default Page
