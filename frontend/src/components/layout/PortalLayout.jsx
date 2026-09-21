import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

function PortalLayout({
  shellTitle,
  shellSubtitle,
  roleLabel,
  navItems,
  user,
  notificationCount,
  onLogout,
  children,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <div className="portal-layout">
        <Sidebar
          navItems={navItems}
          roleLabel={roleLabel}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="app-content">
          <div className="app-watermark" aria-hidden="true">
            Just Tech Solutions
          </div>

          <Navbar
            title={shellTitle}
            subtitle={shellSubtitle}
            user={user}
            notificationCount={notificationCount}
            onLogout={onLogout}
            onMenuToggle={() => setIsSidebarOpen(true)}
          />

          <main className="app-main">{children}</main>

          <footer className="app-footer">
            <span>Powered by Just Tech Solutions</span>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default PortalLayout
