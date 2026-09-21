import {
  BookMarked,
  BookOpenCheck,
  ClipboardCheck,
  GraduationCap,
  Users,
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
  { label: 'Dashboard', to: '/teacher/dashboard', icon: BookMarked, end: true },
  { label: 'Attendance', to: '/teacher/attendance', icon: ClipboardCheck },
  { label: 'Marks', to: '/teacher/marks', icon: BookOpenCheck },
  { label: 'Assignments', to: '/teacher/assignments', icon: GraduationCap },
  { label: 'Student List', to: '/teacher/students', icon: Users },
]

function TeacherLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
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
        subjectsResponse,
        studentsResponse,
        assignmentsResponse,
        noticesResponse,
        notificationsResponse,
      ] = await Promise.all([
        api.get('/teacher/dashboard'),
        api.get('/teacher/subjects'),
        api.get('/teacher/students'),
        api.get('/teacher/assignments'),
        api.get('/teacher/notices'),
        api.get('/notifications'),
      ])

      setDashboard(dashboardResponse.data)
      setSubjects(subjectsResponse.data.data)
      setStudents(studentsResponse.data.data)
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
    return <LoadingScreen label="Loading the teacher dashboard" />
  }

  return (
    <PortalLayout
      shellTitle="Teacher dashboard"
      shellSubtitle="Classroom work"
      roleLabel="Teacher"
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
          subjects,
          students,
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

export function useTeacherPortal() {
  return useOutletContext()
}

export default TeacherLayout
