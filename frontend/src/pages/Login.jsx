import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import apiClient from '../api/client.js'

export default function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiClient.post('/auth/login', { username, password })
      login(
        { username: res.data.username, fullName: res.data.fullName, role: res.data.role },
        res.data.token
      )
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Please check the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="login-visual-inner">
          <span className="brand-icon big">☁️</span>
          <h1>ConnectCRM</h1>
          <p>Sales &amp; Service Cloud built for high-performing teams.</p>
          <ul className="login-highlights">
            <li>📈 Real-time pipeline &amp; case analytics</li>
            <li>🧲 Lead-to-opportunity tracking</li>
            <li>🎧 Unified customer service cases</li>
            <li>🔒 Secure, role-aware access</li>
          </ul>
        </div>
      </div>
      <div className="login-form-side">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="login-sub">Sign in to your CRM workspace</p>

          {error && <div className="alert-error">{error}</div>}

          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" required />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

          <button className="btn-primary full-width" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="login-demo-hint">
            Demo credentials: <strong>admin / admin123</strong> or <strong>rep / rep123</strong>
          </div>
        </form>
      </div>
    </div>
  )
}
