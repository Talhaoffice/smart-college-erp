import { BookMarked, Users } from 'lucide-react'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import StudentsSection from './StudentsSection.jsx'
import { useTeacherPortal } from './TeacherLayout.jsx'

function TeacherStudentsPage() {
  const { students, subjects } = useTeacherPortal()

  return (
    <>
      <PageIntro
        eyebrow="Student List"
        title="Student list"
        description="View the roster for your subjects and departments."
      />

      <section className="stats-grid stats-grid-2">
        <StatCard
          label="Students In Scope"
          value={students.length}
          hint="Visible roster entries"
          icon={Users}
          accent="sky"
        />
        <StatCard
          label="Assigned Subjects"
          value={subjects.length}
          hint="Subjects linked to your scope"
          icon={BookMarked}
          accent="amber"
        />
      </section>

      <StudentsSection students={students} subjects={subjects} />
    </>
  )
}

export default TeacherStudentsPage
