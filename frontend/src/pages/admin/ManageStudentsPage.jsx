import { Building2, Users } from 'lucide-react'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import SearchSection from './SearchSection.jsx'
import StudentSection from './StudentSection.jsx'
import { useAdminPortal } from './AdminLayout.jsx'

function ManageStudentsPage() {
  const { students, departments, refresh } = useAdminPortal()

  return (
    <>
      <PageIntro
        eyebrow="Manage Students"
        title="Student records"
        description="Search, add and update student details from one page."
      />

      <section className="stats-grid stats-grid-2">
        <StatCard
          label="Students"
          value={students.length}
          hint="Loaded student records"
          icon={Users}
          accent="sky"
        />
        <StatCard
          label="Departments"
          value={departments.length}
          hint="Departments available for assignment"
          icon={Building2}
          accent="amber"
        />
      </section>

      <SearchSection />
      <StudentSection
        canManageFees={true}
        departments={departments}
        students={students}
        onRefresh={refresh}
      />
    </>
  )
}

export default ManageStudentsPage
