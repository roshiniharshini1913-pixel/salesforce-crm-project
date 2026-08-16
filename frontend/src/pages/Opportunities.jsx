import React, { useEffect, useState } from 'react'
import apiClient from '../api/client.js'
import DataTable from '../components/DataTable.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'
import Badge from '../components/Badge.jsx'

const emptyForm = { name: '', accountName: '', stage: 'PROSPECTING', amount: '', closeDate: '', contactName: '' }

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0)

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    apiClient.get('/opportunities').then((res) => setOpportunities(res.data)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true) }
  const openEdit = (opp) => { setForm({ ...opp, closeDate: opp.closeDate || '' }); setEditingId(opp.id); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, amount: parseFloat(form.amount) || 0 }
      if (editingId) {
        await apiClient.put(`/opportunities/${editingId}`, payload)
        setToast({ message: 'Opportunity updated successfully', type: 'success' })
      } else {
        await apiClient.post('/opportunities', payload)
        setToast({ message: 'Opportunity created successfully', type: 'success' })
      }
      setShowForm(false)
      load()
    } catch {
      setToast({ message: 'Something went wrong. Please check the form.', type: 'error' })
    }
  }

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/opportunities/${deleteTarget.id}`)
      setToast({ message: 'Opportunity deleted', type: 'success' })
      setDeleteTarget(null)
      load()
    } catch {
      setToast({ message: 'Could not delete opportunity', type: 'error' })
    }
  }

  const filtered = opportunities.filter((o) =>
    [o.name, o.accountName, o.contactName].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'name', label: 'Opportunity' },
    { key: 'accountName', label: 'Account' },
    { key: 'stage', label: 'Stage', render: (row) => <Badge value={row.stage} /> },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'closeDate', label: 'Close Date' },
    { key: 'contactName', label: 'Contact' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Opportunities</h1>
          <p className="page-subtitle">Manage your active sales pipeline.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ New Opportunity</button>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search by opportunity, account, or contact…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading-state">Loading opportunities…</div>
      ) : (
        <DataTable columns={columns} rows={filtered} onEdit={openEdit} onDelete={setDeleteTarget} emptyMessage="No opportunities yet. Click 'New Opportunity' to add one." />
      )}

      {showForm && (
        <Modal
          title={editingId ? 'Edit Opportunity' : 'New Opportunity'}
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-primary" form="opp-form" type="submit">{editingId ? 'Save Changes' : 'Create Opportunity'}</button>
            </>
          }
        >
          <form id="opp-form" className="crm-form" onSubmit={handleSubmit}>
            <label>Opportunity Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <label>Account Name</label>
            <input required value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} />

            <div className="form-row">
              <div>
                <label>Stage</label>
                <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                  {['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'].map((s) => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label>Amount (USD)</label>
                <input type="number" min="0" step="1000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
            </div>

            <label>Expected Close Date</label>
            <input type="date" value={form.closeDate || ''} onChange={(e) => setForm({ ...form, closeDate: e.target.value })} />

            <label>Primary Contact</label>
            <input value={form.contactName || ''} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Opportunity"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onDone={() => setToast(null)} />
    </div>
  )
}
