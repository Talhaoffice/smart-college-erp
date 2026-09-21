import { Bell, CalendarDays, LogOut } from 'lucide-react'
import dayjs from 'dayjs'

function DashboardLayout({
  title,
  subtitle,
  navItems,
  user,
  notificationCount = 0,
  onLogout,
  children,
}) {
  return (
    <div className="app-shell px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="glass-panel h-fit p-5 lg:sticky lg:top-6">
          <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-[0_18px_48px_-24px_rgba(15,23,42,0.75)]">
            <p className="tiny-label text-white/70">Smart College ERP</p>
            <h1 className="mt-3 font-['Space_Grotesk'] text-2xl font-bold leading-tight">
              Cloud command center for campus operations.
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              One responsive workspace for academic, attendance, notice, and finance workflows.
            </p>
          </div>

          <nav className="mt-5 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>
        </aside>

        <main className="space-y-4">
          <header className="glass-panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div>
              <p className="section-kicker">Dashboard</p>
              <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-900">
                {title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">{subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                <CalendarDays size={18} />
                <span>{dayjs().format('dddd, MMMM D, YYYY')}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700">
                <Bell size={18} />
                <span>{notificationCount} unread</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <p className="font-semibold text-slate-900">{user?.name}</p>
                <p className="text-slate-500">{user?.email}</p>
              </div>

              <button type="button" className="secondary-btn gap-2" onClick={onLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
