import React from 'react'
import { Link } from '@reach/router'

let BackLink = ({ to }) => (
  <Link
    to={to}
    className="inline-flex items-center no-underline text-purple-dark"
    data-back
  >
    <svg width={24} height={24} className="fill-current mr-2">
      <path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z" />
    </svg>
    Back
  </Link>
)

export default BackLink
