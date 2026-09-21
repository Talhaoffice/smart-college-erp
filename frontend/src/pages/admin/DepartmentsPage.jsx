import { BookOpenCheck, Building2 } from 'lucide-react'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import DepartmentSection from './DepartmentSection.jsx'
import SubjectSection from './SubjectSection.jsx'
import { useAdminPortal } from './AdminLayout.jsx'

function DepartmentsPage() {
  const { departments, subjects, teachers, refresh } = useAdminPortal()

  return (
    <>
      <PageIntro
        eyebrow="Departments"
        title="Departments and subjects"
        description="Set up departments and map subjects to the right teachers."
      />

      <section className="stats-grid stats-grid-2">
        <StatCard
          label="Departments"
          value={departments.length}
          hint="Configured departments"
          icon={Building2}
          accent="sky"
        />
        <StatCard
          label="Subjects"
          value={subjects.length}
          hint="Subjects linked to departments"
          icon={BookOpenCheck}
          accent="amber"
        />
      </section>

      <DepartmentSection departments={departments} onRefresh={refresh} />
      <SubjectSection
        departments={departments}
        subjects={subjects}
        teachers={teachers}
        onRefresh={refresh}
      />
    </>
  )
}

export default DepartmentsPage
