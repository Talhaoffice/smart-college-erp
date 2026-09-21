import {
  BellRing,
  BookMarked,
  BookOpenCheck,
  ClipboardCheck,
  GraduationCap,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import LoadingScreen from '../components/ui/LoadingScreen.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'
import AssignmentSection from './teacher/AssignmentSection.jsx'
import AttendanceSection from './teacher/AttendanceSection.jsx'
import MarksSection from './teacher/MarksSection.jsx'
import NoticeSection from './teacher/NoticeSection.jsx'
import OverviewSection from './teacher/OverviewSection.jsx'
import StudentsSection from './teacher/StudentsSection.jsx'

function TeacherDashboard() {
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
      setPageError(
        requestError.response?.data?.message ??
          'Unable to load the teacher dashboard right now.',
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
    return <LoadingScreen label="Loading the teacher dashboard" />
  }

  return (
    <DashboardLayout
      title="Teacher Workspace"
      subtitle="Track your subjects, record attendance, upload marks, publish notices, and manage assignments from one calm academic console."
      navItems={[
        { label: 'Overview', href: '#overview', icon: BookMarked },
        { label: 'Attendance', href: '#attendance', icon: ClipboardCheck },
        { label: 'Marks', href: '#marks', icon: BookOpenCheck },
        { label: 'Assignments', href: '#assignments', icon: GraduationCap },
        { label: 'Notices', href: '#notices', icon: BellRing },
        { label: 'Students', href: '#students', icon: Users },
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

      <OverviewSection dashboard={dashboard} />
      <AttendanceSection subjects={subjects} />
      <MarksSection subjects={subjects} />
      <AssignmentSection assignments={assignments} subjects={subjects} onRefresh={loadData} />
      <NoticeSection notices={notices} subjects={subjects} onRefresh={loadData} />
      <StudentsSection students={students} subjects={subjects} />
    </DashboardLayout>
  )
}

export default TeacherDashboard
