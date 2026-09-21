import { BookOpenCheck, ClipboardCheck, CreditCard, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge.jsx'
import Card from '../../components/ui/Card.jsx'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import { formatDateTime } from '../../lib/utils.js'
import { useStudentPortal } from './StudentLayout.jsx'

function StudentDashboardPage() {
  const { dashboard, marks, fees, assignments, notices } = useStudentPortal()
  const safeMarks = Array.isArray(marks) ? marks : []
  const safeAssignments = Array.isArray(assignments) ? assignments : []
  const safeNotices = Array.isArray(notices) ? notices : []

  const latestMark =
    safeMarks.find((item) => item?.internal !== null || item?.external !== null) ?? null
  const feeAccent =
    fees?.status === 'paid' ? 'emerald' : fees?.status === 'partial' ? 'amber' : 'rose'

  return (
    <>
      <PageIntro
        eyebrow="Dashboard"
        title="Student dashboard"
        description="A short summary of attendance, marks, fees and current campus updates."
        aside={
          <div>
            <p className="tiny-label">Current Term</p>
            <p className="mt-2 font-semibold text-slate-800">
              Semester {dashboard?.profile?.semester ?? '-'}
            </p>
            <p className="mt-1 text-slate-500">
              {dashboard?.profile?.department?.name ?? 'Department'}
            </p>
          </div>
        }
      />

      <section className="stats-grid stats-grid-4">
        <StatCard
          label="Attendance"
          value={`${dashboard?.stats?.overall_attendance_percentage ?? 0}%`}
          hint="Overall class presence"
          icon={ClipboardCheck}
          accent="emerald"
        />
        <StatCard
          label="Fees Status"
          value={fees?.status ?? 'N/A'}
          hint="Latest account status"
          icon={CreditCard}
          accent={feeAccent}
        />
        <StatCard
          label="Latest Marks"
          value={
            latestMark
              ? `${latestMark.internal ?? '-'} / ${latestMark.external ?? '-'}`
              : 'Pending'
          }
          hint={latestMark?.subject_name ?? 'No marks uploaded yet'}
          icon={BookOpenCheck}
          accent="sky"
        />
        <StatCard
          label="Pending Work"
          value={safeAssignments.length}
          hint="Assignments to review"
          icon={GraduationCap}
          accent="amber"
        />
      </section>

      <div className="detail-grid detail-grid-wide">
        <Card className="section-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Marks Preview</p>
              <h3 className="section-title mt-2">Latest recorded subjects</h3>
            </div>
            <Link to="/student/marks" className="btn-secondary">
              Open marks
            </Link>
          </div>

          <div className="stack-sm mt-5">
            {safeMarks.slice(0, 3).map((item) => (
              <div key={item.subject_id} className="list-card">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.subject_name}</p>
                    <p className="text-xs text-slate-500">{item.subject_code}</p>
                  </div>
                  <div className="text-sm text-slate-600">
                    Internal: {item.internal ?? 'Pending'} / External:{' '}
                    {item.external ?? 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="section-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Assignments</p>
              <h3 className="section-title mt-2">What is due next</h3>
            </div>
            <Link to="/student/assignments" className="btn-secondary">
              View all
            </Link>
          </div>

          <div className="stack-sm mt-5">
            {safeAssignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="list-card">
                <p className="font-semibold text-slate-800">{assignment.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {assignment.subject?.name} / {assignment.teacher}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Deadline: {formatDateTime(assignment.deadline_at)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="section-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Notices</p>
            <h3 className="section-title mt-2">Recent campus updates</h3>
          </div>
          <Link to="/student/notices" className="btn-secondary">
            Open notices
          </Link>
        </div>

        <div className="detail-grid detail-grid-two mt-5">
          {safeNotices.slice(0, 4).map((notice) => (
            <div key={notice.id} className="list-card">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-800">{notice.title}</p>
                <Badge value={notice.scope ?? 'Notice'} />
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                {notice.content}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {notice.author} / {formatDateTime(notice.created_at)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

export default StudentDashboardPage
