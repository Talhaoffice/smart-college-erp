import { BellRing, Building2, UserCog, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import PortalLayout from '../../components/layout/PortalLayout.jsx'
import Card from '../../components/ui/Card.jsx'
import LoadingScreen from '../../components/ui/LoadingScreen.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { normalizeApiError } from '../../lib/feedback.js'
import api from '../../services/api.js'

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: Building2, end: true },
  { label: 'Manage Students', to: '/admin/students', icon: Users },
  { label: 'Manage Teachers', to: '/admin/teachers', icon: UserCog },
  { label: 'Departments', to: '/admin/departments', icon: Building2 },
  { label: 'Notices', to: '/admin/notices', icon: BellRing },
]

function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [departments, setDepartments] = useState([])
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
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
        departmentResponse,
        teacherResponse,
        studentResponse,
        subjectResponse,
        noticeResponse,
        notificationResponse,
      ] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/departments'),
        api.get('/admin/teachers'),
        api.get('/admin/students'),
        api.get('/admin/subjects'),
        api.get('/admin/notices'),
        api.get('/notifications'),
      ])

      setDashboard(dashboardResponse.data)
      setDepartments(departmentResponse.data.data)
      setTeachers(teacherResponse.data.data)
      setStudents(studentResponse.data.data)
      setSubjects(subjectResponse.data.data)
      setNotices(noticeResponse.data.data)
      setNotifications(notificationResponse.data)
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
    return <LoadingScreen label="Loading the admin panel" />
  }

  return (
    <PortalLayout
      shellTitle="College ERP Dashboard"
      shellSubtitle="Administration & Management"
      roleLabel="Admin"
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
          departments,
          teachers,
          students,
          subjects,
          notices,
          notifications,
          loading,
          refresh: loadData,
        }}
      />
    </PortalLayout>
  )
}

export function useAdminPortal() {
  return useOutletContext()
}

export default AdminLayout
