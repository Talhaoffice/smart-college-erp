import { BellRing, Building2 } from 'lucide-react'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import NoticeSection from './NoticeSection.jsx'
import { useAdminPortal } from './AdminLayout.jsx'

function AdminNoticesPage() {
  const { notices, departments, refresh } = useAdminPortal()

  return (
    <>
      <PageIntro
        eyebrow="Notices"
        title="Notice board"
        description="Post and update notices for all departments or one department."
      />

      <section className="stats-grid stats-grid-2">
        <StatCard
          label="Published Notices"
          value={notices.length}
          hint="Current notice records"
          icon={BellRing}
          accent="sky"
        />
        <StatCard
          label="Departments"
          value={departments.length}
          hint="Available notice targets"
          icon={Building2}
          accent="amber"
        />
      </section>

      <NoticeSection departments={departments} notices={notices} onRefresh={refresh} />
    </>
  )
}

export default AdminNoticesPage
