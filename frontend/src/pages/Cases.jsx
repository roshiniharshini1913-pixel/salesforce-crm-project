import React, { useEffect, useState } from 'react'
import apiClient from '../api/client.js'
import DataTable from '../components/DataTable.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'
import Badge from '../components/Badge.jsx'

const emptyForm = { subject: '', description: '', status: 'OPEN', priority: 'MEDIUM', contactName: '' }

export default function Cases() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    apiClient.get('/cases').then((res) => setCases(res.data)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true) }
  const openEdit = (c) => { setForm(c); setEditingId(c.id); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await apiClient.put(`/cases/${editingId}`, form)
        setToast({ message: 'Case updated successfully', type: 'success' })
      } else {
        await apiClient.post('/cases', form)
        setToast({ message: 'Case created successfully', type: 'success' })
      }
      setShowForm(false)
      load()
    } catch {
      setToast({ message: 'Something went wrong. Please check the form.', type: 'error' })
    }
  }

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/cases/${deleteTarget.id}`)
      setToast({ message: 'Case deleted', type: 'success' })
      setDeleteTarget(null)
      load()
    } catch {
      setToast({ message: 'Could not delete case', type: 'error' })
    }
  }

  const filtered = cases.filter((c) =>
    [c.subject, c.contactName].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'subject', label: 'Subject' },
    { key: 'contactName', label: 'Contact' },
    { key: 'status', label: 'Status', render: (row) => <Badge value={row.status} /> },
    { key: 'priority', label: 'Priority', render: (row) => <Badge value={row.priority} /> },
    { key: 'createdDate', label: 'Created' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Cases</h1>
          <p className="page-subtitle">Track and resolve customer support tickets.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ New Case</button>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search cases by subject or contact…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading-state">Loading cases…</div>
      ) : (
        <DataTable columns={columns} rows={filtered} onEdit={openEdit} onDelete={setDeleteTarget} emptyMessage="No cases yet. Click 'New Case' to add one." />
      )}

      {showForm && (
        <Modal
          title={editingId ? 'Edit Case' : 'New Case'}
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-primary" form="case-form" type="submit">{editingId ? 'Save Changes' : 'Create Case'}</button>
            </>
          }
        >
          <form id="case-form" className="crm-form" onSubmit={handleSubmit}>
            <label>Subject</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />

            <label>Description</label>
            <textarea rows="4" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <div className="form-row">
              <div>
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {['OPEN', 'IN_PROGRESS', 'ESCALATED', 'CLOSED'].map((s) => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label>Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <label>Related Contact</label>
            <input value={form.contactName || ''} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Case"
          message={`Are you sure you want to delete "${deleteTarget.subject}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onDone={() => setToast(null)} />
    </div>
  )
}
