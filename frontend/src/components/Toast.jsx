import React, { useEffect } from 'react'

export default function Toast({ message, type = 'success', onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  if (!message) return null

  return (
    <div className={`toast toast-${type}`}>
      <span>{type === 'success' ? '✅' : '⚠️'}</span> {message}
    </div>
  )
}
