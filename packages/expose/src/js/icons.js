import React from 'react'

let icons = {
  b: props => (
    <svg width={16} height={16} viewBox="0 0 24 24" {...props}>
      <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
    </svg>
  ),
  i: props => (
    <svg width={16} height={16} viewBox="0 0 24 24" {...props}>
      <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
    </svg>
  ),
  p: props => (
    <svg width={16} height={16} viewBox="0 0 24 24" {...props}>
      <path d="M10,4a4,4,0,0,0,0,8v8h2V6h2V20h2V6h2V4Z" />
    </svg>
  ),
  a: props => (
    <svg width={16} height={16} viewBox="0 0 24 24" {...props}>
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
    </svg>
  ),
  h1: props => (
    <svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <polygon points="10 7 10 11 8 11 8 7 6 7 6 17 8 17 8 13 10 13 10 17 12 17 12 7 10 7" />
      <polygon points="18 17 18 7 14 7 14 9 16 9 16 17 18 17" />
    </svg>
  ),
  h2: props => (
    <svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <path d="M15,11a2,2,0,0,0-2,2v4h6V15H15V13h2a2,2,0,0,0,2-2V9a2,2,0,0,0-2-2H13V9h4v2Z" />
      <polygon points="9 7 9 11 7 11 7 7 5 7 5 17 7 17 7 13 9 13 9 17 11 17 11 7 9 7" />
    </svg>
  ),
  h3: props => (
    <svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <polygon points="9 7 9 11 7 11 7 7 5 7 5 17 7 17 7 13 9 13 9 17 11 17 11 7 9 7" />
      <path d="M13,15v2h4a2,2,0,0,0,2-2V13.5A1.5,1.5,0,0,0,17.5,12,1.5,1.5,0,0,0,19,10.5V9a2,2,0,0,0-2-2H13V9h4v2H15v2h2v2Z" />
    </svg>
  ),
  h4: props => (
    <svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <polygon points="9 7 9 11 7 11 7 7 5 7 5 17 7 17 7 13 9 13 9 17 11 17 11 7 9 7" />
      <polygon points="13 7 13 13 17 13 17 17 19 17 19 7 17 7 17 11 15 11 15 7 13 7" />
    </svg>
  ),
  h5: props => (
    <svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <polygon points="9 7 9 11 7 11 7 7 5 7 5 17 7 17 7 13 9 13 9 17 11 17 11 7 9 7" />
      <path d="M13,15v2h4a2,2,0,0,0,2-2V13a2,2,0,0,0-2-2H15V9h4V7H13v6h4v2Z" />
    </svg>
  ),
  h6: props => (
    <svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <polygon points="9 7 9 11 7 11 7 7 5 7 5 17 7 17 7 13 9 13 9 17 11 17 11 7 9 7" />
      <path d="M19,9V7H15a2,2,0,0,0-2,2v6a2,2,0,0,0,2,2h2a2,2,0,0,0,2-2V13a2,2,0,0,0-2-2H15V9Zm-2,4v2H15V13Z" />
    </svg>
  )
}

export default icons
