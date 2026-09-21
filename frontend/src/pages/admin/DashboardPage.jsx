import { BookOpenCheck, Building2, GraduationCap, UserCog } from 'lucide-react'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import ActivitySection from './ActivitySection.jsx'
import { useAdminPortal } from './AdminLayout.jsx'

function AdminDashboardPage() {
  const { dashboard } = useAdminPortal()

  return (
    <>
      <PageIntro
        eyebrow="Dashboard"
        title="College ERP Dashboard"
        description="Quick counts and recent activity for your institution. The detailed work stays on the pages below."
      />

      <section className="stats-grid stats-grid-4">
        <StatCard
          label="Students"
          value={dashboard?.stats?.total_students ?? 0}
          hint="Active student records"
          icon={GraduationCap}
          accent="sky"
        />
        <StatCard
          label="Teachers"
          value={dashboard?.stats?.total_teachers ?? 0}
          hint="Faculty accounts"
          icon={UserCog}
          accent="amber"
        />
        <StatCard
          label="Departments"
          value={dashboard?.stats?.total_departments ?? 0}
          hint="Managed academic units"
          icon={Building2}
          accent="emerald"
        />
        <StatCard
          label="Attendance"
          value={`${dashboard?.stats?.attendance_percentage ?? 0}%`}
          hint="Institution-wide attendance view"
          icon={BookOpenCheck}
          accent="rose"
        />
      </section>

      <ActivitySection dashboard={dashboard} />

      <section className="stats-grid stats-grid-4">
        <StatCard
          label="Published Notices"
          value={dashboard?.analytics?.published_notices ?? 0}
          hint="Communication volume across the institution"
          icon={Building2}
          accent="emerald"
        />
        <StatCard
          label="Active Assignments"
          value={dashboard?.analytics?.active_assignments ?? 0}
          hint="Assignments with upcoming deadlines"
          icon={GraduationCap}
          accent="amber"
        />
        <StatCard
          label="Tracked Attendance"
          value={dashboard?.analytics?.tracked_attendance_records ?? 0}
          hint="Attendance records available for reporting"
          icon={BookOpenCheck}
          accent="rose"
        />
        <StatCard
          label="Tracked Subjects"
          value={dashboard?.analytics?.tracked_subjects ?? 0}
          hint="Subjects included in reporting"
          icon={UserCog}
          accent="sky"
        />
      </section>
    </>
  )
}

export default AdminDashboardPage
