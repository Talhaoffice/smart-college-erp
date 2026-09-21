import { GraduationCap } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import { formatDateTime } from '../../lib/utils.js'
import { useStudentPortal } from './StudentLayout.jsx'

function StudentAssignmentsPage() {
  const { assignments } = useStudentPortal()

  return (
    <>
      <PageIntro
        eyebrow="Assignments"
        title="Assignments"
        description="Current assignment list and deadlines."
      />

      <section className="stats-grid stats-grid-2">
        <StatCard
          label="Open Assignments"
          value={assignments.length}
          hint="Current tasks from faculty"
          icon={GraduationCap}
          accent="amber"
        />
        <StatCard
          label="Next Deadline"
          value={
            assignments[0]?.deadline_at
              ? formatDateTime(assignments[0].deadline_at)
              : 'No upcoming deadline'
          }
          hint="Closest visible due date"
          icon={GraduationCap}
          accent="sky"
        />
      </section>

      <div className="stack-md">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="section-card" hoverable>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-800">
                  {assignment.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {assignment.description}
                </p>
              </div>

              <div className="muted-panel text-sm text-slate-600">
                <p className="font-semibold text-slate-800">
                  {assignment.subject?.name ?? 'Subject'}
                </p>
                <p className="mt-1">{assignment.teacher}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {formatDateTime(assignment.deadline_at)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}

export default StudentAssignmentsPage
