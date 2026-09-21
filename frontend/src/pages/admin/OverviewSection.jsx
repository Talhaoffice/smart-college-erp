import {
  BookOpenCheck,
  Building2,
  GraduationCap,
  UserCog,
} from 'lucide-react'
import StatCard from '../../components/ui/StatCard.jsx'

function OverviewSection({ dashboard }) {
  return (
    <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        hint="Institution-wide attendance health"
        icon={BookOpenCheck}
        accent="rose"
      />
    </section>
  )
}

export default OverviewSection
