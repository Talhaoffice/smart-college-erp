import { ClipboardCheck, GraduationCap, UserRound } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import { useStudentPortal } from './StudentLayout.jsx'

function AttendancePage() {
  const { dashboard, attendance } = useStudentPortal()
  const lowAttendanceCount = attendance.filter((item) => Number(item.percentage) < 75).length

  return (
    <>
      <PageIntro
        eyebrow="Attendance"
        title="Attendance"
        description="Full attendance details for each subject."
      />

      <section className="stats-grid stats-grid-3">
        <StatCard
          label="Overall Attendance"
          value={`${dashboard?.stats?.overall_attendance_percentage ?? 0}%`}
          hint="Across all active subjects"
          icon={ClipboardCheck}
          accent="emerald"
        />
        <StatCard
          label="Subjects Tracked"
          value={attendance.length}
          hint="Attendance entries loaded"
          icon={GraduationCap}
          accent="sky"
        />
        <StatCard
          label="Watchlist"
          value={lowAttendanceCount}
          hint="Subjects below 75 percent"
          icon={UserRound}
          accent={lowAttendanceCount ? 'rose' : 'amber'}
        />
      </section>

      <Card className="table-card">
        <div className="table-card-head">
          <p className="section-kicker">Detailed View</p>
          <h3 className="section-title mt-2">Attendance record</h3>
        </div>

        <div className="table-wrap rounded-none border-0">
          <table className="table-base">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Attended</th>
                <th>Total Classes</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((item) => (
                <tr key={item.subject_id}>
                  <td>
                    <p className="font-semibold text-slate-900">{item.subject_name}</p>
                    <p className="text-xs text-slate-500">{item.subject_code}</p>
                  </td>
                  <td>{item.attended_classes}</td>
                  <td>{item.total_classes}</td>
                  <td
                    className={Number(item.percentage) < 75 ? 'text-danger-strong' : ''}
                  >
                    {item.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default AttendancePage
