import { BookMarked, ClipboardCheck, GraduationCap, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import { formatDateTime } from '../../lib/utils.js'
import { useTeacherPortal } from './TeacherLayout.jsx'

function TeacherDashboardPage() {
  const { dashboard, subjects } = useTeacherPortal()
  const safeSubjects = Array.isArray(subjects) ? subjects : []

  return (
    <>
      <PageIntro
        eyebrow="Dashboard"
        title="Teacher dashboard"
        description="Quick numbers for classes, students, attendance and active assignment work."
        aside={
          <div>
            <p className="tiny-label">Assigned Subjects</p>
            <p className="mt-2 font-semibold text-slate-800">{safeSubjects.length}</p>
            <p className="mt-1 text-slate-500">Current teaching load</p>
          </div>
        }
      />

      <section className="stats-grid stats-grid-4">
        <StatCard
          label="Assigned Subjects"
          value={dashboard?.stats?.assigned_subjects ?? 0}
          hint="Current teaching load"
          icon={BookMarked}
          accent="sky"
        />
        <StatCard
          label="Students In Scope"
          value={dashboard?.stats?.students_in_scope ?? 0}
          hint="Across linked departments"
          icon={Users}
          accent="amber"
        />
        <StatCard
          label="Attendance Today"
          value={`${dashboard?.stats?.attendance_today_percentage ?? 0}%`}
          hint="Current classroom snapshot"
          icon={ClipboardCheck}
          accent="emerald"
        />
        <StatCard
          label="Upcoming Assignments"
          value={dashboard?.stats?.upcoming_assignments ?? 0}
          hint="Deadlines still active"
          icon={GraduationCap}
          accent="rose"
        />
      </section>

      <div className="detail-grid detail-grid-tight">
        <Card className="section-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Subjects</p>
              <h3 className="section-title mt-2">Current teaching scope</h3>
            </div>
            <Link to="/teacher/students" className="btn-secondary">
              Open student list
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {safeSubjects.map((subject) => (
              <div key={subject.id} className="tag-chip">
                {subject.name}
              </div>
            ))}
          </div>
        </Card>

        <Card className="section-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Recent Work</p>
              <h3 className="section-title mt-2">Assignments going out</h3>
            </div>
            <Link to="/teacher/assignments" className="btn-secondary">
              Manage assignments
            </Link>
          </div>

          <div className="stack-sm mt-5">
            {dashboard?.recent_assignments?.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="list-card">
                <p className="font-semibold text-slate-800">{assignment.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {assignment.subject?.name} / {assignment.subject?.department?.name}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {formatDateTime(assignment.deadline)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="section-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Notice Preview</p>
            <h3 className="section-title mt-2">Recent notices</h3>
          </div>
          <Link to="/teacher/assignments" className="btn-secondary">
            Open notice tools
          </Link>
        </div>

        <div className="detail-grid detail-grid-two mt-5">
          {dashboard?.recent_notices?.slice(0, 4).map((notice) => (
            <div key={notice.id} className="list-card">
              <p className="font-semibold text-slate-800">{notice.title}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                {notice.content}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {notice.is_global ? 'All Students' : notice.department?.name} /{' '}
                {formatDateTime(notice.created_at)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

export default TeacherDashboardPage
