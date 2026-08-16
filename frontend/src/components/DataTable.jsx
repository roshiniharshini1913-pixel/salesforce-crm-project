import React from 'react'

export default function DataTable({ columns, rows, onEdit, onDelete, emptyMessage }) {
  if (!rows || rows.length === 0) {
    return <div className="empty-state">{emptyMessage || 'No records found.'}</div>
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
              <td className="col-actions">
                <button className="icon-btn" title="Edit" onClick={() => onEdit(row)}>✏️</button>
                <button className="icon-btn danger" title="Delete" onClick={() => onDelete(row)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
