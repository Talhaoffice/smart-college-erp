import SectionCard from '../../components/ui/SectionCard.jsx'
import { formatDate, formatDateTime } from '../../lib/utils.js'

function ActivitySection({ dashboard }) {
  return (
    <SectionCard
      id="activity"
      eyebrow="Recent Activity"
      title="Recent work"
      description="Latest assignments and notices from the current data."
    >
      <div className="detail-grid detail-grid-two">
        <div className="muted-panel">
          <p className="text-lg font-semibold text-slate-800">Recent Assignments</p>
          <div className="stack-sm mt-4">
            {dashboard?.recent_assignments?.map((assignment) => (
              <div key={assignment.id} className="list-card">
                <p className="font-semibold text-slate-800">{assignment.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {assignment.subject?.name} / {assignment.teacher?.user?.name}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Deadline: {formatDate(assignment.deadline)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="muted-panel">
          <p className="text-lg font-semibold text-slate-800">Recent Notices</p>
          <div className="stack-sm mt-4">
            {dashboard?.recent_notices?.map((notice) => (
              <div key={notice.id} className="list-card">
                <p className="font-semibold text-slate-800">{notice.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{notice.content}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {notice.is_global ? 'All Departments' : notice.department?.name} /{' '}
                  {formatDateTime(notice.created_at)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

export default ActivitySection
