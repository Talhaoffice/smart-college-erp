import { GraduationCap, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils.js'

function Sidebar({ navItems, roleLabel, isOpen, onClose }) {
  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar"
        className={cn(
          'sidebar-overlay transition duration-200 lg:hidden',
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'sidebar-shell',
          isOpen ? 'is-open' : '',
        )}
      >
        <div className="sidebar-panel">
          <div className="sidebar-top">
            <div className="sidebar-brand">
              <div className="sidebar-brand-row">
                <div className="sidebar-mark">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <p className="brand-label">Smart College ERP</p>
                  <h1 className="brand-title">{roleLabel}</h1>
                  <p className="sidebar-brand-note">Just Tech Solutions</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary btn-icon sidebar-close lg:hidden"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'sidebar-link',
                      isActive ? 'sidebar-link-active' : '',
                    )
                  }
                >
                  {() => (
                    <>
                      <span className="sidebar-link-icon">
                        <Icon size={16} />
                      </span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
