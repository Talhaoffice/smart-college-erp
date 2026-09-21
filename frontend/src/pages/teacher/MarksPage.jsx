import { BookOpenCheck, Users } from 'lucide-react'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import MarksSection from './MarksSection.jsx'
import { useTeacherPortal } from './TeacherLayout.jsx'

function TeacherMarksPage() {
  const { subjects, students } = useTeacherPortal()

  return (
    <>
      <PageIntro
        eyebrow="Marks"
        title="Marks entry"
        description="Upload internal or external marks for each subject."
      />

      <section className="stats-grid stats-grid-2">
        <StatCard
          label="Subjects"
          value={subjects.length}
          hint="Subjects available for marks entry"
          icon={BookOpenCheck}
          accent="sky"
        />
        <StatCard
          label="Students In Scope"
          value={students.length}
          hint="Possible entries across departments"
          icon={Users}
          accent="amber"
        />
      </section>

      <MarksSection subjects={subjects} />
    </>
  )
}

export default TeacherMarksPage
