import React, { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import apiClient from '../api/client.js'
import StatCard from '../components/StatCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const PIE_COLORS = ['#00A1E0', '#FFB75D', '#4BCA81', '#FE5C4C', '#8E5CF7', '#032D60']

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0)

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    apiClient.get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(() => setErrorMsg('Could not load dashboard data. Is the backend running on port 8080?'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-state">Loading dashboard…</div>
  if (errorMsg) return <div className="alert-error">{errorMsg}</div>
  if (!stats) return null

  const stageData = Object.entries(stats.opportunitiesByStage || {}).map(([name, value]) => ({ name: name.replaceAll('_', ' '), value }))
  const caseStatusData = Object.entries(stats.casesByStatus || {}).map(([name, value]) => ({ name: name.replaceAll('_', ' '), value }))
  const leadStatusData = Object.entries(stats.leadsByStatus || {}).map(([name, value]) => ({ name: name.replaceAll('_', ' '), value }))

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Here's what's happening across your pipeline today.</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon="🧲" label="Total Leads" value={stats.totalLeads} accent="#00A1E0" />
        <StatCard icon="👤" label="Total Contacts" value={stats.totalContacts} accent="#8E5CF7" />
        <StatCard icon="💼" label="Open Pipeline" value={formatCurrency(stats.pipelineValue)} accent="#FFB75D" />
        <StatCard icon="🏆" label="Closed Won" value={formatCurrency(stats.wonValue)} accent="#4BCA81" />
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Opportunities by Stage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#00A1E0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Case Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={caseStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {caseStatusData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Leads by Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={leadStatusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#8E5CF7" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card summary-card">
          <h3>Quick Summary</h3>
          <ul className="summary-list">
            <li><span>Total Opportunities</span><strong>{stats.totalOpportunities}</strong></li>
            <li><span>Total Cases</span><strong>{stats.totalCases}</strong></li>
            <li><span>Pipeline Value</span><strong>{formatCurrency(stats.pipelineValue)}</strong></li>
            <li><span>Won Revenue</span><strong>{formatCurrency(stats.wonValue)}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
