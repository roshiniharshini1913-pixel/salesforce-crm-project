import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/leads', label: 'Leads', icon: '🧲' },
  { to: '/contacts', label: 'Contacts', icon: '👤' },
  { to: '/opportunities', label: 'Opportunities', icon: '💼' },
  { to: '/cases', label: 'Cases', icon: '🎧' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-icon">☁️</span>
          {!collapsed && <span className="brand-text">ConnectCRM</span>}
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '»' : '« Collapse'}
        </button>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">Sales & Service Cloud</div>
          <div className="topbar-user">
            <div className="avatar">{user?.fullName?.charAt(0) ?? 'U'}</div>
            <div className="user-meta">
              <span className="user-name">{user?.fullName}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <button className="btn-ghost" onClick={handleLogout}>Log Out</button>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
