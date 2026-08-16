import React, { useEffect, useState } from 'react'
import apiClient from '../api/client.js'
import DataTable from '../components/DataTable.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'

const emptyForm = { name: '', email: '', phone: '', company: '', title: '' }

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    apiClient.get('/contacts').then((res) => setContacts(res.data)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true) }
  const openEdit = (contact) => { setForm(contact); setEditingId(contact.id); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await apiClient.put(`/contacts/${editingId}`, form)
        setToast({ message: 'Contact updated successfully', type: 'success' })
      } else {
        await apiClient.post('/contacts', form)
        setToast({ message: 'Contact created successfully', type: 'success' })
      }
      setShowForm(false)
      load()
    } catch {
      setToast({ message: 'Something went wrong. Please check the form.', type: 'error' })
    }
  }

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/contacts/${deleteTarget.id}`)
      setToast({ message: 'Contact deleted', type: 'success' })
      setDeleteTarget(null)
      load()
    } catch {
      setToast({ message: 'Could not delete contact', type: 'error' })
    }
  }

  const filtered = contacts.filter((c) =>
    [c.name, c.company, c.email].join(' ').toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'title', label: 'Title' },
    { key: 'company', label: 'Company' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Contacts</h1>
          <p className="page-subtitle">Your directory of customer relationships.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ New Contact</button>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search contacts by name, company, or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading-state">Loading contacts…</div>
      ) : (
        <DataTable columns={columns} rows={filtered} onEdit={openEdit} onDelete={setDeleteTarget} emptyMessage="No contacts yet. Click 'New Contact' to add one." />
      )}

      {showForm && (
        <Modal
          title={editingId ? 'Edit Contact' : 'New Contact'}
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-primary" form="contact-form" type="submit">{editingId ? 'Save Changes' : 'Create Contact'}</button>
            </>
          }
        >
          <form id="contact-form" className="crm-form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <label>Job Title</label>
            <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />

            <label>Company</label>
            <input value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} />

            <label>Email</label>
            <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />

            <label>Phone</label>
            <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Contact"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onDone={() => setToast(null)} />
    </div>
  )
}
