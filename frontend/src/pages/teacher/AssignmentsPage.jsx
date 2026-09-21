import { BellRing, GraduationCap } from 'lucide-react'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import AssignmentSection from './AssignmentSection.jsx'
import NoticeSection from './NoticeSection.jsx'
import { useTeacherPortal } from './TeacherLayout.jsx'

function TeacherAssignmentsPage() {
  const { assignments, notices, subjects, refresh } = useTeacherPortal()

  return (
    <>
      <PageIntro
        eyebrow="Assignments"
        title="Assignments and notices"
        description="Post homework and notices from one working page."
      />

      <section className="stats-grid stats-grid-2">
        <StatCard
          label="Assignments"
          value={assignments.length}
          hint="Currently visible assignments"
          icon={GraduationCap}
          accent="amber"
        />
        <StatCard
          label="Notices"
          value={notices.length}
          hint="Published department or global notices"
          icon={BellRing}
          accent="sky"
        />
      </section>

      <AssignmentSection assignments={assignments} subjects={subjects} onRefresh={refresh} />
      <NoticeSection notices={notices} subjects={subjects} onRefresh={refresh} />
    </>
  )
}

export default TeacherAssignmentsPage
