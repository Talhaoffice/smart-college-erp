import {
  BellRing,
  BookOpenCheck,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  UserRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Badge from '../components/ui/Badge.jsx'
import LoadingScreen from '../components/ui/LoadingScreen.jsx'
import SectionCard from '../components/ui/SectionCard.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { currency, formatDateTime } from '../lib/utils.js'
import api from '../services/api.js'

function StudentDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [marks, setMarks] = useState([])
  const [fees, setFees] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [notices, setNotices] = useState([])
  const [notifications, setNotifications] = useState({ unread_count: 0, data: [] })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setPageError('')

    try {
      const [
        dashboardResponse,
        attendanceResponse,
        marksResponse,
        feesResponse,
        assignmentsResponse,
        noticesResponse,
        notificationsResponse,
      ] = await Promise.all([
        api.get('/student/dashboard'),
        api.get('/student/attendance'),
        api.get('/student/marks'),
        api.get('/student/fees'),
        api.get('/student/assignments'),
        api.get('/student/notices'),
        api.get('/notifications'),
      ])

      setDashboard(dashboardResponse.data)
      setAttendance(attendanceResponse.data.data)
      setMarks(marksResponse.data.data)
      setFees(feesResponse.data.data)
      setAssignments(assignmentsResponse.data.data)
      setNotices(noticesResponse.data.data)
      setNotifications(notificationsResponse.data)
    } catch (requestError) {
      setPageError(
        requestError.response?.data?.message ??
          'Unable to load the student dashboard right now.',
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  if (loading && !dashboard) {
    return <LoadingScreen label="Loading the student portal" />
  }

  return (
    <DashboardLayout
      title="Student Portal"
      subtitle="Track your profile, attendance, marks, fees, assignments, and notices in one modern campus dashboard."
      navItems={[
        { label: 'Overview', href: '#overview', icon: UserRound },
        { label: 'Attendance', href: '#attendance', icon: ClipboardCheck },
        { label: 'Marks', href: '#marks', icon: BookOpenCheck },
        { label: 'Fees', href: '#fees', icon: CreditCard },
        { label: 'Assignments', href: '#assignments', icon: GraduationCap },
        { label: 'Notices', href: '#notices', icon: BellRing },
      ]}
      notificationCount={notifications.unread_count}
      onLogout={handleLogout}
      user={user}
    >
      {pageError ? (
        <div className="section-card border border-rose-200 bg-rose-50 text-sm text-rose-700">
          {pageError}
        </div>
      ) : null}

      <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Subjects"
          value={dashboard?.stats?.subjects ?? 0}
          hint="Current department subjects"
          icon={BookOpenCheck}
          accent="sky"
        />
        <StatCard
          label="Attendance"
          value={`${dashboard?.stats?.overall_attendance_percentage ?? 0}%`}
          hint="Overall presence score"
          icon={ClipboardCheck}
          accent="emerald"
        />
        <StatCard
          label="Pending Assignments"
          value={dashboard?.stats?.pending_assignments ?? 0}
          hint="Upcoming deadlines"
          icon={GraduationCap}
          accent="amber"
        />
        <StatCard
          label="Notifications"
          value={dashboard?.stats?.notifications ?? 0}
          hint="Unread updates"
          icon={BellRing}
          accent="rose"
        />
      </section>

      <SectionCard
        id="profile"
        eyebrow="Profile"
        title="Personal profile and alerts"
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="tiny-label">Full Name</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {dashboard?.profile?.name}
                </p>
              </div>
              <div>
                <p className="tiny-label">Enrollment Number</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {dashboard?.profile?.enrollment_no}
                </p>
              </div>
              <div>
                <p className="tiny-label">Department</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {dashboard?.profile?.department?.name}
                </p>
              </div>
              <div>
                <p className="tiny-label">Semester</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {dashboard?.profile?.semester}
                </p>
              </div>
              <div>
                <p className="tiny-label">Email</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {dashboard?.profile?.email}
                </p>
              </div>
              <div>
                <p className="tiny-label">Phone</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {dashboard?.profile?.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <p className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
              Recent Notifications
            </p>
            <div className="mt-4 space-y-3">
              {notifications.data.slice(0, 4).map((notification) => (
                <div key={notification.id} className="rounded-2xl bg-white p-4">
                  <p className="font-semibold text-slate-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        id="attendance"
        eyebrow="Attendance"
        title="Subject-wise attendance percentage"
      >
        <div className="table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Attended</th>
                <th>Total Classes</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((item) => (
                <tr key={item.subject_id}>
                  <td>
                    <p className="font-semibold text-slate-900">{item.subject_name}</p>
                    <p className="text-xs text-slate-500">{item.subject_code}</p>
                  </td>
                  <td>{item.attended_classes}</td>
                  <td>{item.total_classes}</td>
                  <td>{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard id="marks" eyebrow="Assessment" title="Internal and external marks">
        <div className="table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Internal</th>
                <th>External</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((item) => (
                <tr key={item.subject_id}>
                  <td>
                    <p className="font-semibold text-slate-900">{item.subject_name}</p>
                    <p className="text-xs text-slate-500">{item.subject_code}</p>
                  </td>
                  <td>{item.internal ?? 'Pending'}</td>
                  <td>{item.external ?? 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard id="fees" eyebrow="Finance" title="Fees status">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="tiny-label">Status</p>
              <div className="mt-2">
                <Badge value={fees?.status ?? 'N/A'} />
              </div>
            </div>
            <div>
              <p className="tiny-label">Amount</p>
              <p className="mt-2 font-semibold text-slate-900">{currency(fees?.amount)}</p>
            </div>
            <div>
              <p className="tiny-label">Due Date</p>
              <p className="mt-2 font-semibold text-slate-900">
                {fees?.due_date ?? 'Not assigned'}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard id="assignments" eyebrow="Homework" title="Assignments and deadlines">
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <article
              key={assignment.id}
              className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5"
            >
              <p className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                {assignment.title}
              </p>
              <p className="mt-2 text-sm text-slate-600">{assignment.description}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>{assignment.subject?.name}</span>
                <span>{assignment.teacher}</span>
                <span>{formatDateTime(assignment.deadline_at)}</span>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="notices" eyebrow="Updates" title="Notices and circulars">
        <div className="space-y-4">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5"
            >
              <p className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                {notice.title}
              </p>
              <p className="mt-2 text-sm text-slate-600">{notice.content}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>{notice.scope}</span>
                <span>{notice.author}</span>
                <span>{formatDateTime(notice.created_at)}</span>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </DashboardLayout>
  )
}

export default StudentDashboard
