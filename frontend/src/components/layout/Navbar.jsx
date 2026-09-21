import { Bell, LogOut, Menu, CalendarDays } from 'lucide-react'
import dayjs from 'dayjs'

function getInitials(name) {
  return String(name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SC'
}

function Navbar({
  title,
  subtitle,
  user,
  notificationCount = 0,
  onLogout,
  onMenuToggle,
}) {
  return (
    <header className="topbar">
      <div className="topbar-card">
        <div className="topbar-row">
          <div className="flex items-start gap-3">
            <button
              type="button"
              className="btn-secondary btn-icon lg:hidden"
              onClick={onMenuToggle}
            >
              <Menu size={16} />
            </button>

            <div>
              <p className="page-kicker">{subtitle}</p>
              <h2 className="page-title">{title}</h2>
              <p className="brand-waterline">Just Tech Solutions</p>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="topbar-chip">
              <CalendarDays size={17} />
              <span>{dayjs().format('ddd, D MMM YYYY')}</span>
            </div>

            <div className="topbar-chip">
              <Bell size={17} />
              <span>{notificationCount} unread</span>
            </div>

            <div className="profile-card">
              <div className="profile-avatar">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="profile-name">{user?.name}</p>
                <p className="profile-email">{user?.email}</p>
              </div>
            </div>

            <button type="button" className="btn-secondary" onClick={onLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
