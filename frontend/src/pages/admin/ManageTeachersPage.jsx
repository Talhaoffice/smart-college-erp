import { Building2, UserCog } from 'lucide-react'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import TeacherSection from './TeacherSection.jsx'
import { useAdminPortal } from './AdminLayout.jsx'

function ManageTeachersPage() {
  const { teachers, departments, refresh } = useAdminPortal()

  return (
    <>
      <PageIntro
        eyebrow="Manage Teachers"
        title="Teacher records"
        description="Add and update faculty details without mixing them into the main dashboard."
      />

      <section className="stats-grid stats-grid-2">
        <StatCard
          label="Teachers"
          value={teachers.length}
          hint="Faculty records loaded"
          icon={UserCog}
          accent="sky"
        />
        <StatCard
          label="Departments"
          value={departments.length}
          hint="Departments available for mapping"
          icon={Building2}
          accent="amber"
        />
      </section>

      <TeacherSection departments={departments} teachers={teachers} onRefresh={refresh} />
    </>
  )
}

export default ManageTeachersPage
