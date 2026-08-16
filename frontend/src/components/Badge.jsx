import React from 'react'

const colorMap = {
  NEW: 'blue', CONTACTED: 'amber', QUALIFIED: 'green', LOST: 'red',
  PROSPECTING: 'blue', QUALIFICATION: 'amber', PROPOSAL: 'purple',
  NEGOTIATION: 'amber', CLOSED_WON: 'green', CLOSED_LOST: 'red',
  OPEN: 'blue', IN_PROGRESS: 'amber', ESCALATED: 'red', CLOSED: 'green',
  LOW: 'green', MEDIUM: 'amber', HIGH: 'red', CRITICAL: 'red',
}

export default function Badge({ value }) {
  const color = colorMap[value] || 'gray'
  const label = value ? value.replaceAll('_', ' ') : ''
  return <span className={`badge badge-${color}`}>{label}</span>
}
