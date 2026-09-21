import { ClipboardCheck, Users } from 'lucide-react'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import AttendanceSection from './AttendanceSection.jsx'
import { useTeacherPortal } from './TeacherLayout.jsx'

function TeacherAttendancePage() {
  const { dashboard, subjects, students } = useTeacherPortal()

  return (
    <>
      <PageIntro
        eyebrow="Attendance"
        title="Attendance"
        description="Mark attendance by subject and date."
      />

      <section className="stats-grid stats-grid-3">
        <StatCard
          label="Attendance Today"
          value={`${dashboard?.stats?.attendance_today_percentage ?? 0}%`}
          hint="Current attendance snapshot"
          icon={ClipboardCheck}
          accent="emerald"
        />
        <StatCard
          label="Subjects"
          value={subjects.length}
          hint="Subjects available for attendance"
          icon={ClipboardCheck}
          accent="sky"
        />
        <StatCard
          label="Students"
          value={students.length}
          hint="Students in teaching scope"
          icon={Users}
          accent="amber"
        />
      </section>

      <AttendanceSection subjects={subjects} />
    </>
  )
}

export default TeacherAttendancePage
