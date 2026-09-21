import Badge from '../../components/ui/Badge.jsx'
import Card from '../../components/ui/Card.jsx'
import PageIntro from '../../components/ui/PageIntro.jsx'
import { formatDateTime } from '../../lib/utils.js'
import { useStudentPortal } from './StudentLayout.jsx'

function StudentNoticesPage() {
  const { notices } = useStudentPortal()

  return (
    <>
      <PageIntro
        eyebrow="Notices"
        title="Notices"
        description="Current campus and department notices."
      />

      <div className="stack-md">
        {notices.map((notice) => (
          <Card key={notice.id} className="section-card" hoverable>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-lg font-semibold text-slate-800">
                    {notice.title}
                  </p>
                  <Badge value={notice.scope ?? 'Notice'} />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{notice.content}</p>
              </div>

              <div className="muted-panel text-sm text-slate-600">
                <p className="font-semibold text-slate-800">{notice.author}</p>
                <p className="mt-1">{notice.scope}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {formatDateTime(notice.created_at)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}

export default StudentNoticesPage
