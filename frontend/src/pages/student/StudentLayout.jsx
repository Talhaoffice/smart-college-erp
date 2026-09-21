import {
  BellRing,
  BookOpenCheck,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  UserRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import PortalLayout from '../../components/layout/PortalLayout.jsx'
import Card from '../../components/ui/Card.jsx'
import LoadingScreen from '../../components/ui/LoadingScreen.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { normalizeApiError } from '../../lib/feedback.js'
import api from '../../services/api.js'

const navItems = [
  { label: 'Dashboard', to: '/student/dashboard', icon: UserRound, end: true },
  { label: 'Attendance', to: '/student/attendance', icon: ClipboardCheck },
  { label: 'Marks', to: '/student/marks', icon: BookOpenCheck },
  { label: 'Fees', to: '/student/fees', icon: CreditCard },
  { label: 'Assignments', to: '/student/assignments', icon: GraduationCap },
  { label: 'Notices', to: '/student/notices', icon: BellRing },
]

function StudentLayout() {
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
      setPageError(normalizeApiError(requestError, 'Something went wrong.'))
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
    <PortalLayout
      shellTitle="Student dashboard"
      shellSubtitle="Daily academic view"
      roleLabel="Student"
      navItems={navItems}
      user={user}
      notificationCount={notifications.unread_count}
      onLogout={handleLogout}
    >
      {pageError ? (
        <Card className="alert-error">
          {pageError}
        </Card>
      ) : null}

      <Outlet
        context={{
          dashboard,
          attendance,
          marks,
          fees,
          assignments,
          notices,
          notifications,
          loading,
          refresh: loadData,
        }}
      />
    </PortalLayout>
  )
}

export function useStudentPortal() {
  return useOutletContext()
}

export default StudentLayout
