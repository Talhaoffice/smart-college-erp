import { BookOpenCheck, ClipboardCheck, GraduationCap, UserRound } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import { useStudentPortal } from './StudentLayout.jsx'

function average(values) {
  if (!values.length) return 0
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length)
}

function StudentMarksPage() {
  const { marks } = useStudentPortal()

  const internalMarks = marks
    .map((item) => Number(item.internal))
    .filter((value) => Number.isFinite(value))
  const externalMarks = marks
    .map((item) => Number(item.external))
    .filter((value) => Number.isFinite(value))
  const recordedSubjects = marks.filter(
    (item) => item.internal !== null || item.external !== null,
  ).length

  return (
    <>
      <PageIntro
        eyebrow="Marks"
        title="Marks"
        description="Recorded internal and external marks for each subject."
      />

      <section className="stats-grid stats-grid-4">
        <StatCard
          label="Recorded Subjects"
          value={recordedSubjects}
          hint="Subjects with at least one mark"
          icon={GraduationCap}
          accent="sky"
        />
        <StatCard
          label="Internal Average"
          value={internalMarks.length ? average(internalMarks) : 'N/A'}
          hint="Across available internal marks"
          icon={ClipboardCheck}
          accent="emerald"
        />
        <StatCard
          label="External Average"
          value={externalMarks.length ? average(externalMarks) : 'N/A'}
          hint="Across available external marks"
          icon={BookOpenCheck}
          accent="amber"
        />
        <StatCard
          label="Pending Entries"
          value={marks.length - recordedSubjects}
          hint="Subjects still awaiting marks"
          icon={UserRound}
          accent="rose"
        />
      </section>

      <Card className="table-card">
        <div className="table-card-head">
          <p className="section-kicker">Detailed View</p>
          <h3 className="section-title mt-2">Marks table</h3>
        </div>

        <div className="table-wrap rounded-none border-0">
          <table className="table-base">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Internal</th>
                <th>External</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((item) => (
                <tr key={item.subject_id}>
                  <td>
                    <p className="font-semibold text-slate-900">{item.subject_name}</p>
                    <p className="text-xs text-slate-500">{item.subject_code}</p>
                  </td>
                  <td>{item.internal ?? 'Pending'}</td>
                  <td>{item.external ?? 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default StudentMarksPage
