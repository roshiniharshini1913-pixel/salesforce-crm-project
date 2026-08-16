import React from 'react'
import Modal from './Modal.jsx'

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  )
}
