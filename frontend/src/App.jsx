import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import LoadingScreen from './components/ui/LoadingScreen.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { roleHomePath } from './lib/utils.js'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboardPage from './pages/admin/DashboardPage.jsx'
import DepartmentsPage from './pages/admin/DepartmentsPage.jsx'
import ManageStudentsPage from './pages/admin/ManageStudentsPage.jsx'
import ManageTeachersPage from './pages/admin/ManageTeachersPage.jsx'
import AdminNoticesPage from './pages/admin/NoticesPage.jsx'
import StudentLayout from './pages/student/StudentLayout.jsx'
import StudentAssignmentsPage from './pages/student/AssignmentsPage.jsx'
import StudentAttendancePage from './pages/student/AttendancePage.jsx'
import StudentDashboardPage from './pages/student/DashboardPage.jsx'
import StudentFeesPage from './pages/student/FeesPage.jsx'
import StudentMarksPage from './pages/student/MarksPage.jsx'
import StudentNoticesPage from './pages/student/NoticesPage.jsx'

import TeacherLayout from './pages/teacher/TeacherLayout.jsx'
import TeacherAssignmentsPage from './pages/teacher/AssignmentsPage.jsx'
import TeacherAttendancePage from './pages/teacher/AttendancePage.jsx'
import TeacherDashboardPage from './pages/teacher/DashboardPage.jsx'
import TeacherMarksPage from './pages/teacher/MarksPage.jsx'
import TeacherStudentsPage from './pages/teacher/StudentsPage.jsx'

function HomeRedirect() {
  const { user, ready } = useAuth()

  if (!ready) {
    return <LoadingScreen label="Restoring your workspace" />
  }

  return <Navigate to={user ? roleHomePath(user.role) : '/login'} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />


      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="students" element={<ManageStudentsPage />} />
          <Route path="teachers" element={<ManageTeachersPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="notices" element={<AdminNoticesPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="teacher" />}>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboardPage />} />
          <Route path="attendance" element={<TeacherAttendancePage />} />
          <Route path="marks" element={<TeacherMarksPage />} />
          <Route path="assignments" element={<TeacherAssignmentsPage />} />
          <Route path="students" element={<TeacherStudentsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="attendance" element={<StudentAttendancePage />} />
          <Route path="marks" element={<StudentMarksPage />} />
          <Route path="fees" element={<StudentFeesPage />} />
          <Route path="assignments" element={<StudentAssignmentsPage />} />
          <Route path="notices" element={<StudentNoticesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
