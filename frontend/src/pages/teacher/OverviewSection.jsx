import {
  BookMarked,
  ClipboardCheck,
  GraduationCap,
  Users,
} from 'lucide-react'
import SectionCard from '../../components/ui/SectionCard.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import { formatDateTime } from '../../lib/utils.js'

function OverviewSection({ dashboard }) {
  return (
    <>
      <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
          hint="Across all assigned departments"
          icon={Users}
          accent="amber"
        />
        <StatCard
          label="Attendance Today"
          value={`${dashboard?.stats?.attendance_today_percentage ?? 0}%`}
          hint="Live classroom presence snapshot"
          icon={ClipboardCheck}
          accent="emerald"
        />
        <StatCard
          label="Upcoming Assignments"
          value={dashboard?.stats?.upcoming_assignments ?? 0}
          hint="Pending submission windows"
          icon={GraduationCap}
          accent="rose"
        />
      </section>

      <SectionCard
        id="overview-feed"
        eyebrow="At A Glance"
        title="Recent teaching activity"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <p className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
              Recent Assignments
            </p>
            <div className="mt-4 space-y-3">
              {dashboard?.recent_assignments?.map((assignment) => (
                <div key={assignment.id} className="rounded-2xl bg-white p-4">
                  <p className="font-semibold text-slate-900">{assignment.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {assignment.subject?.name} • {assignment.subject?.department?.name}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {formatDateTime(assignment.deadline)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <p className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
              Recent Notices
            </p>
            <div className="mt-4 space-y-3">
              {dashboard?.recent_notices?.map((notice) => (
                <div key={notice.id} className="rounded-2xl bg-white p-4">
                  <p className="font-semibold text-slate-900">{notice.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{notice.content}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {notice.is_global ? 'All Students' : notice.department?.name} •{' '}
                    {formatDateTime(notice.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </>
  )
}

export default OverviewSection
