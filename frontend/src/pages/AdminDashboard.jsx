import {
  BellRing,
  BookOpenCheck,
  Building2,
  GraduationCap,
  Search,
  UserCog,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import LoadingScreen from '../components/ui/LoadingScreen.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'
import ActivitySection from './admin/ActivitySection.jsx'
import DepartmentSection from './admin/DepartmentSection.jsx'
import NoticeSection from './admin/NoticeSection.jsx'
import OverviewSection from './admin/OverviewSection.jsx'
import SearchSection from './admin/SearchSection.jsx'
import StudentSection from './admin/StudentSection.jsx'
import SubjectSection from './admin/SubjectSection.jsx'
import TeacherSection from './admin/TeacherSection.jsx'

function AdminDashboard() {
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
      setPageError(
        requestError.response?.data?.message ??
          'Unable to load the admin workspace right now.',
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
    return <LoadingScreen label="Loading the admin command center" />
  }

  return (
    <DashboardLayout
      title="Admin Command Center"
      subtitle="Manage departments, people, subjects, notices, and enrollment operations from one responsive cloud dashboard."
      navItems={[
        { label: 'Overview', href: '#overview', icon: Building2 },
        { label: 'Search', href: '#search', icon: Search },
        { label: 'Departments', href: '#departments', icon: Building2 },
        { label: 'Teachers', href: '#teachers', icon: UserCog },
        { label: 'Students', href: '#students', icon: Users },
        { label: 'Subjects', href: '#subjects', icon: BookOpenCheck },
        { label: 'Notices', href: '#notices', icon: BellRing },
        { label: 'Activity', href: '#activity', icon: GraduationCap },
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
      <SearchSection />
      <DepartmentSection departments={departments} onRefresh={loadData} />
      <TeacherSection
        departments={departments}
        teachers={teachers}
        onRefresh={loadData}
      />
      <StudentSection
        departments={departments}
        students={students}
        onRefresh={loadData}
      />
      <SubjectSection
        departments={departments}
        subjects={subjects}
        teachers={teachers}
        onRefresh={loadData}
      />
      <NoticeSection
        departments={departments}
        notices={notices}
        onRefresh={loadData}
      />
      <ActivitySection dashboard={dashboard} />
    </DashboardLayout>
  )
}

export default AdminDashboard
