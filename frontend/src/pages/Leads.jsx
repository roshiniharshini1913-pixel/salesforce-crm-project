import React, { useEffect, useState } from 'react'
import apiClient from '../api/client.js'
import DataTable from '../components/DataTable.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'
import Badge from '../components/Badge.jsx'

const emptyForm = { name: '', email: '', phone: '', company: '', status: 'NEW', source: 'WEBSITE' }

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    apiClient.get('/leads').then((res) => setLeads(res.data)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true) }
  const openEdit = (lead) => { setForm(lead); setEditingId(lead.id); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await apiClient.put(`/leads/${editingId}`, form)
        setToast({ message: 'Lead updated successfully', type: 'success' })
      } else {
        await apiClient.post('/leads', form)
        setToast({ message: 'Lead created successfully', type: 'success' })
      }
      setShowForm(false)
      load()
    } catch {
      setToast({ message: 'Something went wrong. Please check the form.', type: 'error' })
    }
  }

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/leads/${deleteTarget.id}`)
      setToast({ message: 'Lead deleted', type: 'success' })
      setDeleteTarget(null)
      load()
    } catch {
      setToast({ message: 'Could not delete lead', type: 'error' })
    }
  }

  const filtered = leads.filter((l) =>
    [l.name, l.company, l.email].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (row) => <Badge value={row.status} /> },
    { key: 'source', label: 'Source', render: (row) => row.source?.replaceAll('_', ' ') },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Leads</h1>
          <p className="page-subtitle">Track and qualify inbound prospects.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ New Lead</button>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search leads by name, company, or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading-state">Loading leads…</div>
      ) : (
        <DataTable columns={columns} rows={filtered} onEdit={openEdit} onDelete={setDeleteTarget} emptyMessage="No leads yet. Click 'New Lead' to add one." />
      )}

      {showForm && (
        <Modal
          title={editingId ? 'Edit Lead' : 'New Lead'}
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-primary" form="lead-form" type="submit">{editingId ? 'Save Changes' : 'Create Lead'}</button>
            </>
          }
        >
          <form id="lead-form" className="crm-form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <label>Company</label>
            <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />

            <label>Email</label>
            <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />

            <label>Phone</label>
            <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

            <div className="form-row">
              <div>
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label>Source</label>
                <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                  {['WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'EVENT', 'COLD_CALL', 'OTHER'].map((s) => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Lead"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onDone={() => setToast(null)} />
    </div>
  )
}
